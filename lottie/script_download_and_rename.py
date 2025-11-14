import os
import requests
import json
import time
import random
import string
import re
import zipfile
import py7zr
import shutil
from typing import Dict, Tuple
from concurrent.futures import ProcessPoolExecutor, as_completed

    
def extract_lottie(filepath):
    # Extract .lottie: try ZIP first (most .lottie are zip-like),
    # fall back to 7z if needed.
    extract_dir = filepath.replace(".lottie", "")
    os.makedirs(extract_dir, exist_ok=True)

    # Try standard ZIP extraction
    try:
        with zipfile.ZipFile(filepath, 'r') as z:
            z.extractall(path=extract_dir)
        print(f"Extracted Lottie file (zip) to {extract_dir}")
        return
    except zipfile.BadZipFile:
        # Not a zip file, try 7z
        try:
            with py7zr.SevenZipFile(filepath, mode='r') as z:
                z.extractall(path=extract_dir)
            print(f"Extracted Lottie file (7z) to {extract_dir}")
            return
        except Exception as e:
            print(f"Failed to extract {filepath}: {e}")
            return
    
def rename_json_extracted_and_move_to_collection(extract_dir,new_name):
    # File expected to be named .\tmp\{extract_dir}\animations\{dummies_name}.json
    animations_dir = os.path.join(extract_dir, "animations")
    if not os.path.exists(animations_dir):
        print(f"Animations directory not found: {animations_dir}")
        return
    json_files = [f for f in os.listdir(animations_dir) if f.endswith(".json")]
    if not json_files:
        print(f"No JSON files found in animations directory: {animations_dir}")
        return
    original_json_path = os.path.join(animations_dir, json_files[0])
    new_json_path = os.path.join("./lottie_collection/", f"{new_name}.json")
    os.makedirs("./lottie_collection/", exist_ok=True)
    os.rename(original_json_path, new_json_path)
    print(f"Renamed and moved JSON file to {new_json_path}")
    
    # Clean up extracted directory
    shutil.rmtree(extract_dir)


def safe_filename(name: str) -> str:
    """Return a filesystem-safe filename (very small sanitizer)."""
    # Replace whitespace and disallowed chars with underscore
    return re.sub(r"[^A-Za-z0-9._-]", "_", name)


def download_lottie(url: str) -> str:
    """Download the Lottie file to ./tmp/ and return the filepath.

    Raises Exception on failure.
    """
    response = requests.get(url)
    if response.status_code != 200:
        raise RuntimeError(f"Failed to download file: {response.status_code} from {url}")
    tmp_dir = "./tmp/"
    filename = url.split("/")[-1]
    filepath = os.path.join(tmp_dir, filename)
    os.makedirs(tmp_dir, exist_ok=True)
    with open(filepath, "wb") as f:
        f.write(response.content)
    print(f"Downloaded Lottie file to {filepath}")
    return filepath

def write_log(message: str):
    """Append a log message to the log file in other processes."""
    log_path = os.path.join(os.path.dirname(__file__), "download_rename_log.txt")
    with open(log_path, "a", encoding="utf-8") as log_file:
        log_file.write(f"{message}\n")


def process_item(url: str, meta: Dict) -> Tuple[str, str, bool, str]:
    """Process a single index item in a separate process.

    Returns tuple: (url, dest_name_or_empty, success_bool, message)
    """
    try:
        page_id = meta.get("page_id") or meta.get("id") or None
        if not page_id:
            msg = "no page_id or id in metadata"
            write_log(f"SKIP {url}: {msg}")
            return (url, "", False, msg)
        dest_name = safe_filename(page_id)

        filepath = download_lottie(url)
        extract_dir = filepath.replace('.lottie', '')
        extract_lottie(filepath)
        rename_json_extracted_and_move_to_collection(extract_dir=extract_dir, new_name=dest_name)

        # Remove downloaded .lottie
        try:
            if os.path.exists(filepath):
                os.remove(filepath)
        except Exception:
            pass

        # write_log(f"OK {url} -> {dest_name}.json")
        return (url, dest_name, True, "")
    except Exception as e:
        # best-effort cleanup
        try:
            if 'filepath' in locals() and os.path.exists(filepath):
                os.remove(filepath)
        except Exception:
            pass
        
        #  "https://assets-v2.lottiefiles.com/a/dd433e4a-1182-11ee-9c2d-534e2c0fdff7/2cwE9248k7.lottie": {"id": "vGIr5PsWQM","title": "rotating sun","description": "Soleil tournant","page_id": "rotating-sun"},
        # collect meta into log file
        write_log(f"\"{url}\": {json.dumps(meta, ensure_ascii=False)},")
        return (url, "", False, str(e))
    
def main():
    
    # Process the index file (relative to this script's folder)
    # index_path = os.path.join(os.path.dirname(__file__), "all_lottie_index.json")
    index_path = os.path.join(os.path.dirname(__file__), "test_lottie_index.json")
    if not os.path.exists(index_path):
        print(f"Index file not found: {index_path}")
        return
    with open(index_path, "r", encoding="utf-8") as fh:
        index: Dict[str, Dict] = json.load(fh)

    # Use a process pool to process items in parallel, limited to 10 processes
    max_workers = 10
    futures = []
    results = []
    with ProcessPoolExecutor(max_workers=max_workers) as executor:
        for url, meta in index.items():
            futures.append(executor.submit(process_item, url, meta))

        # Collect results as they finish
        for fut in as_completed(futures):
            try:
                url, dest_name, ok, msg = fut.result()
                if ok:
                    print(f"Processed {url} -> {dest_name}.json")
                else:
                    print(f"Failed {url}: {msg}")
                results.append((url, dest_name, ok, msg))
            except Exception as e:
                print(f"Worker raised exception: {e}")
                results.append(("", "", False, str(e)))
    
if __name__ == "__main__":
    main()