#!/bin/bash
# Quick corruption tracker validation script (Node wrapper)

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.."

npm run validate

