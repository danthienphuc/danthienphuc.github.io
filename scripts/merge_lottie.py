#!/usr/bin/env python3
"""
Simple script to merge all JSON files in ./links into a single JSON file
Usage: python scripts/merge_lottie.py
Produces: links/all_lottie_index.json
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LINKS = ROOT / 'links'
OUT = LINKS / 'all_lottie_index.json'

def main():
    merged = {}
    for p in sorted(LINKS.glob('all_lottie_items_*.json')):
        try:
            with p.open('r', encoding='utf-8') as f:
                data = json.load(f)
                if isinstance(data, dict):
                    merged.update(data)
        except Exception as e:
            print(f'Warning: failed to read {p}: {e}')

    try:
        with OUT.open('w', encoding='utf-8') as f:
            json.dump(merged, f, ensure_ascii=False, indent=2)
        print(f'Wrote {OUT} with {len(merged)} items')
    except Exception as e:
        print('Failed to write output:', e)

if __name__ == '__main__':
    main()
