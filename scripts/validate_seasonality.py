#!/usr/bin/env python3
"""Validate `_data/seasonality.yml` against `_data/recipe_tags.yml`.

Checks:
- Each entry has `id`, `category`, `season` (strings).
- If `id` is present in recipe_tags.yml, it must have `ingredient: true`.
  Ids absent from recipe_tags.yml are allowed (exploratory: no recipe yet).
- `category` in the closed set.
- `season` tokens match the grammar and no quinzaine is duplicated.
- Each id appears once.

Exits non-zero on the first error class encountered.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
TAGS = ROOT / "_data" / "recipe_tags.yml"
SEASONALITY = ROOT / "_data" / "seasonality.yml"

VALID_CATEGORIES = {
    "fruit", "legume", "viande", "poisson", "coquillage",
    "fromage", "herbe", "champignon", "autre",
}
VALID_MONTHS = {"jan", "feb", "mar", "apr", "may", "jun",
                "jul", "aug", "sep", "oct", "nov", "dec"}
TOKEN_RE = re.compile(r"^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)-([12]):(start|peak|end)$")


def fail(msg: str) -> None:
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(1)


def main() -> int:
    if not SEASONALITY.exists():
        fail(f"missing file: {SEASONALITY.relative_to(ROOT)}")

    with TAGS.open("r", encoding="utf-8") as f:
        tags_list = yaml.safe_load(f)
    all_tag_ids = {e["id"] for e in tags_list}
    ingredient_ids = {e["id"] for e in tags_list if e.get("ingredient") is True}

    with SEASONALITY.open("r", encoding="utf-8") as f:
        entries = yaml.safe_load(f)
    if not isinstance(entries, list):
        fail("seasonality.yml must be a YAML list")

    seen_ids: set[str] = set()
    errors: list[str] = []

    for i, e in enumerate(entries):
        loc = f"entry #{i}"
        if not isinstance(e, dict):
            errors.append(f"{loc}: not a mapping")
            continue
        for key in ("id", "category", "season"):
            if key not in e:
                errors.append(f"{loc}: missing key `{key}`")
        if errors and errors[-1].startswith(loc):
            continue

        iid = e["id"]
        loc = f"id={iid!r}"
        if iid in seen_ids:
            errors.append(f"{loc}: duplicate id")
        seen_ids.add(iid)

        # Exploratory ids (not in the registry at all) are allowed.
        # But if the id IS in the registry, it must be flagged ingredient:true.
        if iid in all_tag_ids and iid not in ingredient_ids:
            errors.append(f"{loc}: present in recipe_tags.yml but not marked `ingredient: true`")

        cat = e["category"]
        if cat not in VALID_CATEGORIES:
            errors.append(f"{loc}: invalid category {cat!r} (allowed: {sorted(VALID_CATEGORIES)})")

        season = e["season"]
        if not isinstance(season, str) or not season.strip():
            errors.append(f"{loc}: season must be a non-empty string")
            continue

        tokens = [t.strip() for t in season.split(",") if t.strip()]
        if not tokens:
            errors.append(f"{loc}: season has no tokens")
            continue
        quinzaines_seen: set[str] = set()
        for tok in tokens:
            m = TOKEN_RE.match(tok)
            if not m:
                errors.append(f"{loc}: bad token {tok!r} (expected e.g. `may-1:peak`)")
                continue
            key = f"{m.group(1)}-{m.group(2)}"
            if key in quinzaines_seen:
                errors.append(f"{loc}: duplicate quinzaine {key} in season")
            quinzaines_seen.add(key)

    if errors:
        for msg in errors:
            print(f"ERROR: {msg}", file=sys.stderr)
        print(f"\n{len(errors)} error(s) in {SEASONALITY.relative_to(ROOT)}", file=sys.stderr)
        return 1

    print(f"OK — {len(entries)} entries valid in {SEASONALITY.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
