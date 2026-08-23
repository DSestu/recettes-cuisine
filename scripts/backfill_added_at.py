#!/usr/bin/env python3
"""
Backfill the `date:` frontmatter key on recipes and components, inferring each
file's "added at" date from git history (the commit that first added the file).

The key is inserted right after `image:` (or after `title:` when there is no
`image:`), matching the canonical frontmatter order. Editing is textual, one
line inserted, so diffs stay minimal — no YAML round-trip that would reflow
every ingredient list.

Idempotent: files that already declare `date:` are skipped unless --force.

Usage (from repo root):
  uv run python scripts/backfill_added_at.py [--dry-run] [--force]
"""

from __future__ import annotations

import argparse
import datetime as dt
import subprocess
import sys
from pathlib import Path

TARGET_DIRS = ("_recipes", "_components")

DATE_KEY_RE = "date:"


def git_add_dates(repo_root: Path) -> dict[str, str]:
    """Map repo-relative path -> YYYY-MM-DD of the commit that first added it.

    One `git log` invocation over both collections. `--reverse` walks oldest
    first, so the first date under which a path appears is its add date.
    """
    cmd = [
        "git",
        "log",
        "--diff-filter=A",
        "--reverse",
        "--date=short",
        "--format=@%ad",
        "--name-only",
        "--",
        *TARGET_DIRS,
    ]
    out = subprocess.run(
        cmd,
        cwd=repo_root,
        check=True,
        capture_output=True,
        text=True,
    ).stdout

    dates: dict[str, str] = {}
    current: str | None = None
    for line in out.splitlines():
        line = line.strip()
        if not line:
            continue
        if line.startswith("@"):
            current = line[1:]
            continue
        if current and line.endswith(".md") and line not in dates:
            dates[line] = current
    return dates


def git_add_date_followed(repo_root: Path, rel: str) -> str | None:
    """Add date for a single file, following renames.

    The bulk `--diff-filter=A` scan misses files that git recorded as a rename
    (R) rather than an add (A) under their current path; `--follow` is per-file
    only, so it is used just as a fallback. Falls back once more to the oldest
    commit touching the path.
    """
    for extra in (["--follow", "--diff-filter=A"], []):
        out = subprocess.run(
            ["git", "log", *extra, "--date=short", "--format=%ad", "--", rel],
            cwd=repo_root,
            check=True,
            capture_output=True,
            text=True,
        ).stdout.split()
        if out:
            return out[-1]
    return None


def find_insertion_index(lines: list[str]) -> int | None:
    """Index at which to insert the `date:` line, or None if unparseable.

    Expects a file starting with a `---` frontmatter fence. Returns the index
    after `image:`, else after `title:`, else just inside the opening fence.
    """
    if not lines or lines[0].strip() != "---":
        return None

    end = None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            end = i
            break
    if end is None:
        return None

    image_at = None
    title_at = None
    for i in range(1, end):
        stripped = lines[i].lstrip()
        if stripped.startswith("image:") and image_at is None:
            image_at = i
        elif stripped.startswith("title:") and title_at is None:
            title_at = i

    if image_at is not None:
        return image_at + 1
    if title_at is not None:
        return title_at + 1
    return 1


def has_date_key(lines: list[str]) -> bool:
    """True when the frontmatter block already declares a top-level `date:`."""
    if not lines or lines[0].strip() != "---":
        return False
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            return False
        if lines[i].startswith(DATE_KEY_RE):
            return True
    return False


def strip_date_key(lines: list[str]) -> list[str]:
    """Remove existing top-level `date:` lines from the frontmatter block."""
    if not lines or lines[0].strip() != "---":
        return lines
    out = [lines[0]]
    in_fm = True
    for line in lines[1:]:
        if in_fm and line.strip() == "---":
            in_fm = False
        if in_fm and line.startswith(DATE_KEY_RE):
            continue
        out.append(line)
    return out


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Backfill `date:` frontmatter from git add dates.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="report planned changes without writing any file",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="overwrite an existing `date:` value",
    )
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[1]
    add_dates = git_add_dates(repo_root)
    today = dt.date.today().isoformat()

    files: list[Path] = []
    for d in TARGET_DIRS:
        files.extend(sorted((repo_root / d).glob("*.md")))

    written = 0
    skipped = 0
    unresolved: list[str] = []
    unparseable: list[str] = []
    seen_dates: list[str] = []

    for path in files:
        rel = path.relative_to(repo_root).as_posix()
        # newline="" keeps CRLF intact — some files use it, and translating
        # them to LF would turn a one-line insertion into a whole-file diff.
        with path.open("r", encoding="utf-8", newline="") as fh:
            lines = fh.read().splitlines(keepends=True)
        eol = "\r\n" if lines and lines[0].endswith("\r\n") else "\n"

        if has_date_key(lines):
            if not args.force:
                skipped += 1
                continue
            lines = strip_date_key(lines)

        date = add_dates.get(rel) or git_add_date_followed(repo_root, rel)
        if date is None:
            date = today
            unresolved.append(rel)

        idx = find_insertion_index(lines)
        if idx is None:
            unparseable.append(rel)
            continue

        lines.insert(idx, f"date: {date}{eol}")
        seen_dates.append(date)

        if args.dry_run:
            print(f"would set date: {date}  {rel}")
        else:
            with path.open("w", encoding="utf-8", newline="") as fh:
                fh.write("".join(lines))
        written += 1

    verb = "would write" if args.dry_run else "wrote"
    print(
        f"\n{verb} {written} file(s), skipped {skipped} "
        f"(already had `date:`), {len(files)} scanned",
    )
    if seen_dates:
        print(f"date range: {min(seen_dates)} -> {max(seen_dates)}")
    if unresolved:
        print(
            f"\nWARNING: {len(unresolved)} file(s) not found in git history, "
            f"defaulted to {today}:",
        )
        for rel in unresolved:
            print(f"  {rel}")
    if unparseable:
        print(f"\nWARNING: {len(unparseable)} file(s) with unparseable frontmatter:")
        for rel in unparseable:
            print(f"  {rel}")

    return 1 if unparseable else 0


if __name__ == "__main__":
    sys.exit(main())
