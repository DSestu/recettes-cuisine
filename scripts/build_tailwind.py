#!/usr/bin/env python3
"""
Pre-compile Tailwind CSS into a static stylesheet so pages don't run the
JIT runtime on every navigation.

Uses pytailwindcss, which fetches a pinned standalone CLI binary on first
run (no Node required). Reads `assets/css/_tailwind.css` + `tailwind.config.js`,
writes `assets/css/tailwind.css` (minified).

Idempotent: Tailwind only rewrites if the output would change. Run from
repo root: `uv run python scripts/build_tailwind.py`.
"""

import os
import subprocess
import sys
from pathlib import Path

# Pin v3 so `tailwind.config.js` is still respected (v4 moved config to CSS).
os.environ.setdefault("TAILWINDCSS_VERSION", "v3.4.17")


def main() -> None:
    repo_root = Path(__file__).resolve().parent.parent
    src = repo_root / "assets" / "css" / "_tailwind.css"
    dst = repo_root / "assets" / "css" / "tailwind.css"
    config = repo_root / "tailwind.config.js"

    if not src.is_file():
        print(f"missing source: {src}", file=sys.stderr)
        sys.exit(1)
    if not config.is_file():
        print(f"missing config: {config}", file=sys.stderr)
        sys.exit(1)

    cmd = [
        "tailwindcss",
        "-i",
        str(src.relative_to(repo_root)),
        "-o",
        str(dst.relative_to(repo_root)),
        "-c",
        str(config.relative_to(repo_root)),
        "--minify",
    ]
    print(" ".join(cmd), flush=True)
    subprocess.run(cmd, cwd=repo_root, check=True)


if __name__ == "__main__":
    main()
