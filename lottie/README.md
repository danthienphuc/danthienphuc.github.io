Lottie Gallery

This repository contains a small static Lottie gallery.

Files
- `index.html` — gallery UI. It reads `all_lottie_index.json` in the same folder and renders cards with preview, Copy URL, Embed, and Download buttons.
- `all_lottie_index.json` — data source (mapping of lottie URL -> metadata).

How to open
- Recommended: serve the folder over a local web server (to allow fetch of the JSON). Examples:
  - Python 3: `python -m http.server 8000`
  - Node: `npx http-server . -p 8000`

Then open http://localhost:8000/ in your browser.

Notes
- The page loads the Lottie Player script from unpkg.com. You need network access to load that script.
- Copy URL button copies the raw .lottie URL to clipboard. Embed copies an iframe snippet into the small textarea and attempts to copy it to the clipboard.
- If you open `index.html` via the `file://` protocol the fetch for `all_lottie_index.json` may fail due to browser restrictions; use a local server as shown above.

Enjoy!