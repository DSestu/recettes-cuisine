#!/usr/bin/env bash
# Refuse to commit any non-WebP file under images/.
# Called by the pre-commit framework with staged filenames as arguments.
set -euo pipefail

bad=$(printf '%s\n' "$@" | grep -E '^images/.*\.(png|jpe?g|avif|gif)$' || true)
if [ -n "$bad" ]; then
  echo "Refused: only .webp allowed under images/"
  echo "$bad" | sed 's/^/  /'
  exit 1
fi
