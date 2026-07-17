#!/usr/bin/env python3
"""Generate `assets/data/recipe-seasonality.json`.

Feeds the `/calendrier/?affichage=recettes-de-saison` mode: for every recipe
and component, list its temporal ingredients (categories legume/fruit/
champignon/coquillage) and their per-fortnight phase (start/peak/end).

Schema per SPEC.md §4:

    {
      "fortnights": ["jan-1", …, "dec-2"],
      "temporal_categories": ["legume", "fruit", "champignon", "coquillage"],
      "phase_weights": {"peak": 1.0, "start": 0.5, "end": 0.5},
      "recipes": [
        {"slug", "title", "url", "kind": "recipe"|"component",
         "temporal_ingredients": [
           {"id", "category", "phases": {"<0..23>": "start"|"peak"|"end"}}
         ]}
      ]
    }

Rules:
- A file is included iff its frontmatter has ≥ 1 canonical ingredient tag
  from `_data/recipe_tags.yml`. `temporal_ingredients` may still be empty.
- Site-relative URLs (no baseurl); JS prepends baseurl at render time.
- Deterministic output: recipes sorted by slug; each recipe's
  `temporal_ingredients` sorted by id; each `phases` map sorted by
  numeric key.

Run: `uv run python scripts/generate_recipe_seasonality.py`
"""
# /// script
# requires-python = ">=3.12"
# dependencies = ["pyyaml"]
# ///
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
RECIPES_DIR = ROOT / "_recipes"
COMPONENTS_DIR = ROOT / "_components"
SEASONALITY_YML = ROOT / "_data" / "seasonality.yml"
TAGS_YML = ROOT / "_data" / "recipe_tags.yml"
OUT_DIR = ROOT / "assets" / "data"
OUT_PATH = OUT_DIR / "recipe-seasonality.json"

FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)
TOKEN_RE = re.compile(
    r"^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)-([12]):(start|peak|end)$"
)
MONTHS = ["jan", "feb", "mar", "apr", "may", "jun",
          "jul", "aug", "sep", "oct", "nov", "dec"]
FORTNIGHTS = [f"{m}-{h}" for m in MONTHS for h in (1, 2)]
TEMPORAL_CATEGORIES = [
    "legume", "fruit", "herbe", "champignon",
    "poisson", "coquillage", "viande", "fromage",
]
PHASE_WEIGHTS = {"peak": 1.0, "start": 0.5, "end": 0.5}


def parse_frontmatter(path: Path) -> dict | None:
    text = path.read_text(encoding="utf-8")
    m = FRONTMATTER_RE.match(text)
    if not m:
        return None
    try:
        return yaml.safe_load(m.group(1)) or {}
    except yaml.YAMLError as e:
        print(f"WARN: bad frontmatter in {path.name}: {e}", file=sys.stderr)
        return None


def parse_season(season: str) -> dict[str, str]:
    """Return {"<0..23>": "start"|"peak"|"end"} for the entry's tokens."""
    phases: dict[str, str] = {}
    for tok in (t.strip() for t in season.split(",")):
        if not tok:
            continue
        m = TOKEN_RE.match(tok)
        if not m:
            continue
        month, half, phase = m.group(1), int(m.group(2)), m.group(3)
        idx = MONTHS.index(month) * 2 + (half - 1)
        phases[str(idx)] = phase
    return dict(sorted(phases.items(), key=lambda kv: int(kv[0])))


def load_seasonality() -> dict[str, dict]:
    """id → {category, phases: {"<idx>": phase}} for entries in TEMPORAL_CATEGORIES."""
    with SEASONALITY_YML.open("r", encoding="utf-8") as f:
        entries = yaml.safe_load(f)
    out: dict[str, dict] = {}
    for e in entries:
        cat = e.get("category")
        if cat not in TEMPORAL_CATEGORIES:
            continue
        out[e["id"]] = {"category": cat, "phases": parse_season(e.get("season", ""))}
    return out


def load_canonical_tag_ids() -> set[str]:
    with TAGS_YML.open("r", encoding="utf-8") as f:
        entries = yaml.safe_load(f)
    return {e["id"] for e in entries if isinstance(e, dict) and "id" in e}


def collect(dir_path: Path, kind: str, canonical_tags: set[str],
            seasonality: dict[str, dict]) -> list[dict]:
    out: list[dict] = []
    if not dir_path.is_dir():
        return out
    for path in sorted(dir_path.glob("*.md")):
        fm = parse_frontmatter(path)
        if not fm:
            continue
        tags = fm.get("tags") or []
        if not isinstance(tags, list):
            continue
        # Only include files that use at least one canonical tag id.
        canonical_hits = [t for t in tags if isinstance(t, str) and t in canonical_tags]
        if not canonical_hits:
            continue
        slug = path.stem
        temporal = [
            {"id": t, "category": seasonality[t]["category"],
             "phases": seasonality[t]["phases"]}
            for t in canonical_hits
            if t in seasonality
        ]
        temporal.sort(key=lambda x: x["id"])
        out.append({
            "slug": slug,
            "title": fm.get("title", slug),
            "url": f"/{slug}.html",
            "kind": kind,
            "image": fm.get("image", slug),
            "temporal_ingredients": temporal,
        })
    return out


def main() -> int:
    seasonality = load_seasonality()
    canonical = load_canonical_tag_ids()

    recipes = collect(RECIPES_DIR, "recipe", canonical, seasonality)
    components = collect(COMPONENTS_DIR, "component", canonical, seasonality)
    all_entries = sorted(recipes + components, key=lambda r: r["slug"])

    payload = {
        "fortnights": FORTNIGHTS,
        "temporal_categories": TEMPORAL_CATEGORIES,
        "phase_weights": PHASE_WEIGHTS,
        "recipes": all_entries,
    }

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2, sort_keys=False) + "\n",
        encoding="utf-8",
    )

    with_temporal = sum(1 for r in all_entries if r["temporal_ingredients"])
    print(f"Wrote {OUT_PATH.relative_to(ROOT)}")
    print(f"  recipes: {len(recipes)} · components: {len(components)}")
    print(f"  entries with ≥1 temporal ingredient: {with_temporal}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
