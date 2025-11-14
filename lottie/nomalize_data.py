import json
import os
import requests
from concurrent.futures import ProcessPoolExecutor, as_completed
from typing import Tuple

"""
Sample url
https://lottiefiles.com/free-animation/{id used in url}

sample json
{
  "https://assets-v2.lottiefiles.com/a/dd433e4a-1182-11ee-9c2d-534e2c0fdff7/2cwE9248k7.lottie": {
    "id": "vGIr5PsWQM", # id used in url
    "title": "rotating sun",
    "description": "Soleil tournant",
    "page_id": "rotating-sun" 
  },
  "https://assets-v2.lottiefiles.com/a/48628860-1170-11ee-9d9c-d7bbc911ebcf/8R7Wp4rEhV.lottie": {
    "id": "84b14bc3-6289-4e75-b731-aa3128630597",
    "title": "48628860-1170-11ee-9d9c-d7bbc911ebcf",
    "description": "duplicate",
    "page_id": "t14fTrikda" # id used in url
  },
  "https://assets-v2.lottiefiles.com/a/dd443796-1182-11ee-9c2e-db6ef4da3073/1pyjrnf0hd.lottie": {
    "id": "5",
    "title": "dd443796-1182-11ee-9c2e-db6ef4da3073",
    "description": "heartbeat",
    "page_id": "2U2RyxXsxd" # id used in url
  }
}

Mục tiêu: fill tất cả thông tin chính xác bằng cách get data từ lottie.com/free-animation/{id}
Nếu value của id là id used in url thì ta có thể lấy được trang lottie.com/free-animation/{id}
Nếu lỗi 404 thì thử lại với value của page_id
Nếu vẫn lỗi 404 thì thử lại với value của title
Nếu vẫn lỗi 404 thì thử lại với value của description
Nếu vẫn lỗi thì log ra file not_found.log để sau này xử lý thủ công. Sample log line: \"url\": {json of the entry}

Về xử lý html để lấy các thông tin id, title, description, page_id use bs4 như trong script bên dưới

"""

def fetch_lottie_metadata_by_id(lottie_id: str) -> dict:
    """Fetch metadata from lottiefiles.com/free-animation/{id} page."""
    url = f"https://lottiefiles.com/free-animation/{lottie_id}"
    response = requests.get(url)
    if response.status_code == 404:
        raise ValueError(f"Lottie with id {lottie_id} not found (404).")
    response.raise_for_status()
    html_content = response.text

    # Parse HTML to extract metadata
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')

    # Extract title
    title_tag = soup.find('meta', property='og:title')
    title = title_tag['content'] if title_tag else ''

    # Extract description
    description_tag = soup.find('meta', property='og:description')
    description = description_tag['content'] if description_tag else ''

    # Extract page_id from URL
    canonical_tag = soup.find('link', rel='canonical')
    page_id = ''
    if canonical_tag:
        canonical_url = canonical_tag['href']
        if canonical_url.startswith("https://lottiefiles.com/free-animation/"):
            page_id = canonical_url.split("/")[-1]

    return {
        "id": lottie_id,
        "title": title,
        "description": description,
        "page_id": page_id
    }


from typing import Dict, Optional


def try_fetch_for_entry(entry: Dict) -> Optional[Dict]:
  """Try candidates in order and return fetched metadata dict or None.

  Order: id, page_id, title, description
  """
  candidates = [entry.get("id"), entry.get("page_id"), entry.get("title"), entry.get("description")]
  for cand in candidates:
    if not cand:
      continue
    try:
      meta = fetch_lottie_metadata_by_id(str(cand))
      return meta
    except ValueError:
      # 404 -> try next candidate
      continue
    except Exception as e:
      # Non-404 error: warn and continue to next candidate
      print(f"Warning: error fetching candidate '{cand}': {e}")
      continue

  return None


def process_entry(url: str, entry: Dict) -> Tuple[str, Optional[Dict], bool, str]:
  """Worker function for processing a single index entry in a separate process.

  Returns (url, merged_entry_or_original, found_bool, message).
  """
  try:
    fetched = try_fetch_for_entry(entry)
    if fetched is None:
      return (url, entry, False, "not_found")
  
    # title is "Free rotating sun Animation by ThÃ©ophile Menard | LottieFiles"
    # Extract the actual title part before the " | LottieFiles" suffix
    actual_title = fetched.get("title", "")
    if actual_title.endswith(" | LottieFiles"):
        actual_title = actual_title.rsplit(" | LottieFiles", 1)[0]

    # merge fetched fields into entry (overwrite with authoritative values)
    merged = dict(entry)
    page_id_val = fetched.get("page_id", merged.get("page_id"))
    # If page_id ends with -{id}, strip the suffix
    fetched_id = fetched.get("id")
    if page_id_val and fetched_id and str(page_id_val).endswith(f"-{fetched_id}"):
      page_id_val = str(page_id_val).rsplit('-', 1)[0]

    merged.update({
      "id": fetched.get("id", merged.get("id")),
      "title": actual_title,
      "description": fetched.get("description", merged.get("description")),
      "page_id": page_id_val,
    })
    return (url, merged, True, "ok")
  except Exception as e:
    return (url, entry, False, str(e))


def normalize_index_file(input_path: str, output_path: str, not_found_path: str):
  """Normalize entries in input_path, write updated index to output_path.

  Not-found entries are appended as JSON lines to not_found_path where each line
  is a JSON object {"url": <original_entry>}.
  """
  with open(input_path, "r", encoding="utf-8") as fh:
    index: Dict[str, Dict] = json.load(fh)

  normalized: Dict[str, Dict] = {}

  # open not-found log for append
  # Use a process pool to handle entries in parallel (network-bound work)
  with ProcessPoolExecutor(max_workers=20) as executor:
    future_to_url = {executor.submit(process_entry, url, entry): url for url, entry in index.items()}

    # open not-found log for append
    with open(not_found_path, "a", encoding="utf-8") as nf:
      for fut in as_completed(future_to_url):
        try:
          url, result_entry, ok, msg = fut.result()
        except Exception as e:
          print(f"Worker failed: {e}")
          continue

        if not ok:
          # append original entry for manual inspection
          nf.write(json.dumps({url: result_entry}, ensure_ascii=False) + "\n")
          print(f"Not found or error for {url}: {msg}")
          normalized[url] = result_entry
        else:
          normalized[url] = result_entry
          print(f"{result_entry.get('page_id')}")

  # write normalized index
  with open(output_path, "w", encoding="utf-8") as outfh:
    json.dump(normalized, outfh, ensure_ascii=False, indent=2)


def main():
  # Normalize the test index (adjust filenames as needed)
  original_path = os.path.join(os.path.dirname(__file__), "all_lottie_index.json")
  if not os.path.exists(original_path):
    print(f"File not found: {original_path}")
    return

  output_path = os.path.join(os.path.dirname(__file__), "all_lottie_index.enriched.json")
  not_found_path = os.path.join(os.path.dirname(__file__), "not_found.log")
  normalize_index_file(original_path, output_path, not_found_path)


if __name__ == "__main__":
    main()