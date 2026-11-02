#!/bin/bash
# validate-openpinas.sh (Node wrapper)
# Run this after ph-news-refresher or ph-weekly-review updates.

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

npm run validate
