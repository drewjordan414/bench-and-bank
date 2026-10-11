#!/bin/bash
# Run the site:   tools/dev.sh          dev server, opens the browser
#                 tools/dev.sh build    production build into site/dist
set -e
cd "$(dirname "$0")/../site"
[ -d node_modules ] || npm install
if [ $# -eq 0 ]; then exec npx vite --open; else exec npx vite "$@"; fi
