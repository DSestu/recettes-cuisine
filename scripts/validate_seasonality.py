#!/usr/bin/env python3
"""Validate `_data/seasonality.yml` against `_data/recipe_tags.yml`.

Checks:
- Each entry has `id`, `category`, `season` (strings).
- If `id` is present in recipe_tags.yml, it must have `ingredient: true`.
  Ids absent from recipe_tags.yml are allowed (exploratory: no recipe yet).
- `category` in the closed set.
- `season` tokens match the grammar and no quinzaine is duplicated.
- Each id appears once.
- CONTINUITY: within any single contiguous "run" of quinzaines (allowing
  wrap-around dec→jan), the intensity pattern must be `start*peak+end*` —
  no holes inside a season, and no illegal orderings like `peak,start,peak`.
  Multiple runs per entry are allowed (e.g. spring + autumn spinach).

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
MONTHS_ORDER = ["jan", "feb", "mar", "apr", "may", "jun",
                "jul", "aug", "sep", "oct", "nov", "dec"]
TOKEN_RE = re.compile(r"^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)-([12]):(start|peak|end)$")


def check_continuity(entry_id, intensity_by_slot):
    """Return an error message if the entry's runs violate `start*peak+end*`,
    or None on success. Multiple non-adjacent runs are allowed (multi-season)."""
    if not intensity_by_slot:
        return None
    n = 24
    slots = set(intensity_by_slot.keys())
    # Find run starts: slots whose predecessor (mod 24) is not in the set.
    starts = [s for s in slots if ((s - 1) % n) not in slots]
    # Whole-year cycle: no boundary, treat lowest index as arbitrary start.
    if not starts:
        starts = [min(slots)]
    runs = []
    for start in starts:
        run = [start]
        cur = start
        while ((cur + 1) % n) in slots and (cur + 1) % n != start:
            cur = (cur + 1) % n
            run.append(cur)
        runs.append(run)
    covered = sum(len(r) for r in runs)
    if covered != len(slots):
        return f"internal: run coverage {covered} != slot count {len(slots)}"
    for run in runs:
        seq = [intensity_by_slot[s] for s in run]
        i = 0
        while i < len(seq) and seq[i] == "start":
            i += 1
        if i == len(seq) or seq[i] != "peak":
            return f"run {[slot_name(s) for s in run]} has no 'peak' after 'start' (got {seq})"
        while i < len(seq) and seq[i] == "peak":
            i += 1
        while i < len(seq) and seq[i] == "end":
            i += 1
        if i != len(seq):
            return f"run {[slot_name(s) for s in run]} has invalid intensity order {seq} (expected start*peak+end*)"
    return None


def slot_name(idx):
    return f"{MONTHS_ORDER[idx // 2]}-{idx % 2 + 1}"


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
        intensity_by_slot: dict[int, str] = {}
        for tok in tokens:
            m = TOKEN_RE.match(tok)
            if not m:
                errors.append(f"{loc}: bad token {tok!r} (expected e.g. `may-1:peak`)")
                continue
            key = f"{m.group(1)}-{m.group(2)}"
            if key in quinzaines_seen:
                errors.append(f"{loc}: duplicate quinzaine {key} in season")
            quinzaines_seen.add(key)
            slot_idx = MONTHS_ORDER.index(m.group(1)) * 2 + (int(m.group(2)) - 1)
            intensity_by_slot[slot_idx] = m.group(3)
        # Contiguity: no holes inside a run, no illegal intensity ordering.
        cont_err = check_continuity(iid, intensity_by_slot)
        if cont_err:
            errors.append(f"{loc}: {cont_err}")

    if errors:
        for msg in errors:
            print(f"ERROR: {msg}", file=sys.stderr)
        print(f"\n{len(errors)} error(s) in {SEASONALITY.relative_to(ROOT)}", file=sys.stderr)
        return 1

    print(f"OK — {len(entries)} entries valid in {SEASONALITY.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
