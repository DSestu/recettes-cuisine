#!/usr/bin/env python3
"""Generate `_data/seasonality.yml` seed from the FR seasonality mapping below.

Reads `_data/recipe_tags.yml`; for each `ingredient: true` id that appears in
the SEASONALITY map, emits a `{ id, category, season }` entry. Ingredients not
in the map are considered year-round and skipped.

Run: `uv run python scripts/generate_seasonality_seed.py`
"""
from __future__ import annotations

import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
TAGS = ROOT / "_data" / "recipe_tags.yml"
OUT = ROOT / "_data" / "seasonality.yml"

VALID_CATEGORIES = {
    "fruit", "legume", "viande", "poisson", "coquillage",
    "fromage", "herbe", "champignon", "autre",
}

# id -> (category, season string) for seasonal produce in metropolitan France.
#
# The map covers both ingredients that already exist in `_data/recipe_tags.yml`
# AND "exploratory" ingredients that don't yet appear in any recipe. The UI
# hides the exploratory ones unless the user toggles "explore" mode; that
# distinction is derived at UI-build time from whether the id has recipes in
# the ingredient index — no flag needed in seasonality.yml.
#
# Year-round staples (spices, oils, sugars, flours, dairy basics, cured meats,
# farmed fish, dried legumes, hardy herbs, aged cheeses, stored roots) are
# intentionally omitted. Cultivated mushrooms (Paris) are also omitted; only
# strictly seasonal wild ones are listed.
SEASONALITY: dict[str, tuple[str, str]] = {
    # ==================================================================
    # Fruits
    # ==================================================================
    "abricot": ("fruit", "jun-1:start, jun-2:peak, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:end"),
    "agrumes": ("fruit", "nov-1:start, nov-2:peak, dec-1:peak, dec-2:peak, jan-1:peak, jan-2:peak, feb-1:peak, feb-2:peak, mar-1:end, mar-2:end"),
    "citron": ("fruit", "nov-1:start, nov-2:peak, dec-1:peak, dec-2:peak, jan-1:peak, jan-2:peak, feb-1:peak, feb-2:peak, mar-1:peak, mar-2:end, apr-1:end"),
    "clementine": ("fruit", "oct-2:start, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:peak, jan-1:peak, jan-2:end, feb-1:end"),
    "framboises": ("fruit", "jun-1:start, jun-2:peak, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:end, sep-1:end"),
    "kumquat": ("fruit", "dec-1:start, dec-2:peak, jan-1:peak, jan-2:peak, feb-1:peak, feb-2:end, mar-1:end"),
    "muscat": ("fruit", "sep-1:start, sep-2:peak, oct-1:peak, oct-2:end"),
    "orange": ("fruit", "dec-1:start, dec-2:peak, jan-1:peak, jan-2:peak, feb-1:peak, feb-2:peak, mar-1:peak, mar-2:end, apr-1:end"),
    "peche": ("fruit", "jun-2:start, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:peak, sep-1:end"),
    "poire": ("fruit", "aug-2:start, sep-1:peak, sep-2:peak, oct-1:peak, oct-2:peak, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:end, jan-1:end"),
    "pomme": ("fruit", "sep-1:start, sep-2:peak, oct-1:peak, oct-2:peak, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:peak, jan-1:peak, jan-2:end, feb-1:end"),
    # -- exploratory fruits (no recipe yet) --
    "cerises": ("fruit", "may-2:start, jun-1:peak, jun-2:peak, jul-1:peak, jul-2:end"),
    "coings": ("fruit", "oct-1:start, oct-2:peak, nov-1:peak, nov-2:end, dec-1:end"),
    "figues": ("fruit", "aug-1:start, aug-2:peak, sep-1:peak, sep-2:peak, oct-1:end, oct-2:end"),
    "fraises": ("fruit", "apr-2:start, may-1:peak, may-2:peak, jun-1:peak, jun-2:peak, jul-1:peak, jul-2:end"),
    "groseilles": ("fruit", "jun-1:start, jun-2:peak, jul-1:peak, jul-2:peak, aug-1:end"),
    "kaki": ("fruit", "oct-2:start, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:end"),
    "melon": ("fruit", "jun-2:start, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:peak, sep-1:end, sep-2:end"),
    "mirabelles": ("fruit", "aug-1:start, aug-2:peak, sep-1:peak, sep-2:end"),
    "mures": ("fruit", "jul-2:start, aug-1:peak, aug-2:peak, sep-1:peak, sep-2:end"),
    "myrtilles": ("fruit", "jun-2:start, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:end, sep-1:end"),
    "nectarines": ("fruit", "jun-2:start, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:peak, sep-1:end"),
    "pasteque": ("fruit", "jul-1:start, jul-2:peak, aug-1:peak, aug-2:peak, sep-1:end"),
    "prunes": ("fruit", "jul-2:start, aug-1:peak, aug-2:peak, sep-1:peak, sep-2:end"),
    "raisin": ("fruit", "aug-2:start, sep-1:peak, sep-2:peak, oct-1:peak, oct-2:end"),
    "rhubarbe": ("fruit", "apr-1:start, apr-2:peak, may-1:peak, may-2:peak, jun-1:peak, jun-2:end, jul-1:end"),

    # ==================================================================
    # Légumes
    # ==================================================================
    "asperges": ("legume", "apr-1:start, apr-2:peak, may-1:peak, may-2:peak, jun-1:end, jun-2:end"),
    "butternut": ("legume", "sep-1:start, sep-2:peak, oct-1:peak, oct-2:peak, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:end, jan-1:end"),
    "carottes": ("legume", "jun-1:start, jun-2:peak, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:peak, sep-1:peak, sep-2:peak, oct-1:end, oct-2:end"),
    "celeri": ("legume", "jul-1:start, aug-1:peak, aug-2:peak, sep-1:peak, sep-2:peak, oct-1:peak, oct-2:peak, nov-1:peak, nov-2:end, dec-1:end"),
    "chou": ("legume", "sep-1:start, oct-1:peak, oct-2:peak, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:peak, jan-1:peak, jan-2:peak, feb-1:peak, feb-2:end, mar-1:end"),
    "chou-fleur": ("legume", "sep-1:start, sep-2:peak, oct-1:peak, oct-2:peak, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:end, jan-1:end"),
    "choux de bruxelles": ("legume", "oct-1:start, oct-2:peak, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:peak, jan-1:peak, jan-2:peak, feb-1:end"),
    "concombre": ("legume", "may-1:start, may-2:peak, jun-1:peak, jun-2:peak, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:peak, sep-1:end, sep-2:end"),
    "edamame": ("legume", "jul-1:start, jul-2:peak, aug-1:peak, aug-2:peak, sep-1:end"),
    "endives": ("legume", "oct-1:start, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:peak, jan-1:peak, jan-2:peak, feb-1:peak, feb-2:peak, mar-1:end, mar-2:end, apr-1:end"),
    "epinards": ("legume", "mar-1:start, mar-2:peak, apr-1:peak, apr-2:peak, may-1:peak, may-2:end, oct-1:start, oct-2:peak, nov-1:peak, nov-2:end"),
    "fenouil": ("legume", "oct-1:start, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:peak, jan-1:peak, jan-2:peak, feb-1:peak, feb-2:peak, mar-1:peak, mar-2:end, apr-1:end"),
    "haricots verts": ("legume", "jun-2:start, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:peak, sep-1:peak, sep-2:end"),
    "navets": ("legume", "sep-1:start, oct-1:peak, oct-2:peak, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:peak, jan-1:peak, jan-2:end, feb-1:end"),
    "patate douce": ("legume", "oct-1:start, oct-2:peak, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:peak, jan-1:peak, jan-2:end, feb-1:end"),
    "petits pois": ("legume", "may-1:start, may-2:peak, jun-1:peak, jun-2:peak, jul-1:end, jul-2:end"),
    "poireaux": ("legume", "sep-1:start, oct-1:peak, oct-2:peak, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:peak, jan-1:peak, jan-2:peak, feb-1:peak, feb-2:peak, mar-1:end, mar-2:end, apr-1:end"),
    "poireau japonais": ("legume", "sep-1:start, oct-1:peak, oct-2:peak, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:peak, jan-1:peak, jan-2:peak, feb-1:peak, feb-2:peak, mar-1:end, mar-2:end, apr-1:end"),
    "potimarron": ("legume", "sep-2:start, oct-1:peak, oct-2:peak, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:end, jan-1:end"),
    "potiron": ("legume", "sep-2:start, oct-1:peak, oct-2:peak, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:end, jan-1:end"),
    "racine de bardane": ("legume", "oct-1:start, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:peak, jan-1:peak, jan-2:end, feb-1:end"),
    "racine de lotus": ("legume", "nov-1:start, dec-1:peak, dec-2:peak, jan-1:peak, jan-2:peak, feb-1:peak, feb-2:end"),
    "radis": ("legume", "apr-1:start, apr-2:peak, may-1:peak, may-2:peak, jun-1:peak, jun-2:peak, jul-1:peak, jul-2:peak, aug-1:end, aug-2:end"),
    "roquette": ("legume", "apr-1:start, may-1:peak, may-2:peak, jun-1:peak, jun-2:peak, jul-1:peak, jul-2:peak, aug-1:end, aug-2:end"),
    "tomate cerise": ("legume", "jun-2:start, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:peak, sep-1:peak, sep-2:end, oct-1:end"),
    "tomates": ("legume", "jun-2:start, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:peak, sep-1:peak, sep-2:end, oct-1:end"),
    # -- exploratory légumes (no recipe yet) --
    "artichauts": ("legume", "apr-1:start, may-1:peak, may-2:peak, jun-1:peak, jun-2:peak, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:end, sep-1:end"),
    "aubergines": ("legume", "jun-2:start, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:peak, sep-1:peak, sep-2:end, oct-1:end"),
    "betteraves": ("legume", "jun-1:start, jul-1:peak, aug-1:peak, sep-1:peak, oct-1:peak, nov-1:peak, nov-2:end, dec-1:end"),
    "blettes": ("legume", "may-1:start, jun-1:peak, jul-1:peak, aug-1:peak, sep-1:peak, oct-1:peak, oct-2:end, nov-1:end"),
    "brocolis": ("legume", "sep-1:start, oct-1:peak, oct-2:peak, nov-1:peak, nov-2:peak, dec-1:end"),
    "cardons": ("legume", "oct-1:start, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:end, jan-1:end"),
    "chou rouge": ("legume", "sep-1:start, oct-1:peak, nov-1:peak, dec-1:peak, jan-1:peak, feb-1:end, mar-1:end"),
    "courge": ("legume", "sep-2:start, oct-1:peak, oct-2:peak, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:end, jan-1:end"),
    "courgettes": ("legume", "may-2:start, jun-1:peak, jun-2:peak, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:peak, sep-1:peak, sep-2:end, oct-1:end"),
    "cresson": ("legume", "mar-1:start, apr-1:peak, may-1:peak, jun-1:peak, jul-1:end, sep-1:start, oct-1:peak, nov-1:end"),
    "mache": ("legume", "oct-1:start, nov-1:peak, dec-1:peak, jan-1:peak, feb-1:peak, mar-1:end"),
    "panais": ("legume", "oct-1:start, nov-1:peak, dec-1:peak, jan-1:peak, feb-1:peak, mar-1:end"),
    "poivrons": ("legume", "jun-2:start, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:peak, sep-1:peak, sep-2:end, oct-1:end"),
    "salsifis": ("legume", "oct-1:start, nov-1:peak, dec-1:peak, jan-1:peak, feb-1:peak, mar-1:end"),
    "topinambours": ("legume", "oct-1:start, nov-1:peak, dec-1:peak, jan-1:peak, feb-1:peak, mar-1:end"),

    # ==================================================================
    # Herbes
    # ==================================================================
    "basilic": ("herbe", "may-1:start, may-2:peak, jun-1:peak, jun-2:peak, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:peak, sep-1:end, sep-2:end"),
    "cerfeuil": ("herbe", "mar-1:start, apr-1:peak, apr-2:peak, may-1:peak, may-2:peak, jun-1:peak, jun-2:peak, jul-1:end"),
    "ciboulette": ("herbe", "mar-1:start, apr-1:peak, apr-2:peak, may-1:peak, may-2:peak, jun-1:peak, jun-2:peak, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:peak, sep-1:peak, sep-2:end, oct-1:end"),
    "coriandre": ("herbe", "may-1:start, jun-1:peak, jun-2:peak, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:peak, sep-1:end"),
    "estragon": ("herbe", "apr-1:start, may-1:peak, may-2:peak, jun-1:peak, jun-2:peak, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:end, sep-1:end"),
    "menthe": ("herbe", "apr-1:start, may-1:peak, may-2:peak, jun-1:peak, jun-2:peak, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:peak, sep-1:peak, sep-2:end, oct-1:end"),
    "origan": ("herbe", "may-1:start, jun-1:peak, jun-2:peak, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:peak, sep-1:end"),
    "shiso": ("herbe", "jun-1:start, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:peak, sep-1:end"),
    # -- exploratory herbes --
    "aneth": ("herbe", "may-1:start, jun-1:peak, jul-1:peak, aug-1:peak, aug-2:end, sep-1:end"),
    "oseille": ("herbe", "apr-1:start, may-1:peak, jun-1:peak, jul-1:peak, aug-1:end, sep-1:end"),

    # ==================================================================
    # Champignons (only truly seasonal — Paris button is year-round)
    # ==================================================================
    "girolles": ("champignon", "jun-1:start, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:peak, sep-1:peak, sep-2:peak, oct-1:peak, oct-2:end, nov-1:end"),
    # -- exploratory champignons --
    "cepes": ("champignon", "aug-2:start, sep-1:peak, sep-2:peak, oct-1:peak, oct-2:peak, nov-1:end"),
    "morilles": ("champignon", "mar-2:start, apr-1:peak, apr-2:peak, may-1:peak, may-2:end"),
    "pleurotes": ("champignon", "sep-1:start, oct-1:peak, oct-2:peak, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:end, jan-1:end"),
    "trompettes de la mort": ("champignon", "sep-2:start, oct-1:peak, oct-2:peak, nov-1:peak, nov-2:end"),

    # ==================================================================
    # Poissons & coquillages
    # ==================================================================
    "bonite": ("poisson", "aug-1:start, sep-1:peak, sep-2:peak, oct-1:peak, oct-2:end, nov-1:end"),
    "maquereau": ("poisson", "apr-1:start, may-1:peak, may-2:peak, jun-1:peak, jun-2:peak, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:end, sep-1:end"),
    "moules": ("coquillage", "jul-1:start, aug-1:peak, aug-2:peak, sep-1:peak, sep-2:peak, oct-1:peak, oct-2:peak, nov-1:peak, nov-2:end, dec-1:end"),
    "saint-jacques": ("coquillage", "oct-1:start, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:peak, jan-1:peak, jan-2:peak, feb-1:peak, feb-2:peak, mar-1:peak, mar-2:end, apr-1:end, apr-2:end, may-1:end"),
    "thon": ("poisson", "may-1:start, jun-1:peak, jun-2:peak, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:peak, sep-1:peak, sep-2:end, oct-1:end"),
    # -- exploratory poissons & coquillages --
    "dorade": ("poisson", "may-1:start, jun-1:peak, jul-1:peak, aug-1:peak, sep-1:peak, oct-1:end"),
    "huitres": ("coquillage", "sep-1:start, sep-2:start, oct-1:peak, oct-2:peak, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:peak, jan-1:peak, jan-2:peak, feb-1:peak, feb-2:peak, mar-1:peak, mar-2:end, apr-1:end"),
    "sardines": ("poisson", "may-1:start, jun-1:peak, jul-1:peak, aug-1:peak, sep-1:peak, sep-2:end, oct-1:end"),
    "sole": ("poisson", "mar-1:start, apr-1:peak, may-1:peak, jun-1:peak, jul-1:end, aug-1:end"),

    # ==================================================================
    # Viandes
    # ==================================================================
    "agneau": ("viande", "mar-1:start, apr-1:peak, apr-2:peak, may-1:peak, may-2:peak, jun-1:end"),
    "foie gras": ("viande", "oct-1:start, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:peak, jan-1:end"),
    # -- exploratory viandes --
    "gibier": ("viande", "oct-1:start, oct-2:peak, nov-1:peak, nov-2:peak, dec-1:peak, dec-2:peak, jan-1:end, jan-2:end"),

    # ==================================================================
    # Fromages
    # ==================================================================
    "beaufort": ("fromage", "jul-1:start, aug-1:peak, sep-1:peak, oct-1:peak, nov-1:peak, dec-1:end"),
    "brousse de brebis": ("fromage", "mar-1:start, apr-1:peak, apr-2:peak, may-1:peak, may-2:peak, jun-1:end"),
    "chevre": ("fromage", "mar-1:start, apr-1:peak, may-1:peak, may-2:peak, jun-1:peak, jun-2:peak, jul-1:peak, jul-2:peak, aug-1:peak, aug-2:end, sep-1:end"),
    # -- exploratory fromages --
    "mont d'or": ("fromage", "sep-2:start, oct-1:peak, nov-1:peak, dec-1:peak, jan-1:peak, feb-1:peak, mar-1:end, apr-1:end"),

    # ==================================================================
    # Autres (fruits secs / châtaignes)
    # ==================================================================
    "chataigne": ("autre", "sep-2:start, oct-1:peak, oct-2:peak, nov-1:peak, nov-2:end, dec-1:end"),
    "marrons": ("autre", "oct-1:start, oct-2:peak, nov-1:peak, nov-2:peak, dec-1:end"),
    "noisettes": ("autre", "sep-1:start, oct-1:peak, oct-2:peak, nov-1:peak, nov-2:end"),
    "noix": ("autre", "sep-2:start, oct-1:peak, oct-2:peak, nov-1:peak, nov-2:peak, dec-1:end"),
}


def load_tags(path: Path) -> dict[str, bool]:
    with path.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return {entry["id"]: bool(entry.get("ingredient", False)) for entry in data}


def build_entries(tags: dict[str, bool]) -> list[dict]:
    # Ids present in the registry must be flagged ingredient:true.
    # Ids absent from the registry are "exploratory" (no recipe yet) and allowed.
    non_ingredient = [k for k in SEASONALITY if k in tags and tags[k] is not True]
    if non_ingredient:
        print(f"ERROR: seasonality ids present in recipe_tags.yml but not ingredient:true: {non_ingredient}", file=sys.stderr)
        sys.exit(1)

    bad_cat = [(k, c) for k, (c, _) in SEASONALITY.items() if c not in VALID_CATEGORIES]
    if bad_cat:
        print(f"ERROR: invalid categories: {bad_cat}", file=sys.stderr)
        sys.exit(1)

    entries = [{"id": k, "category": c, "season": s} for k, (c, s) in SEASONALITY.items()]
    entries.sort(key=lambda e: (e["category"], e["id"]))
    return entries


def write_yaml(entries: list[dict], path: Path) -> None:
    lines = [
        "# Ingredient seasonality (metropolitan France) — quinzaine granularity.",
        "# Format: season = comma-separated tokens \"<mon>-<1|2>:<start|peak|end>\".",
        "# Months absent from the string are out of season.",
        "# Regenerate with: uv run python scripts/generate_seasonality_seed.py",
        "# Validate with:   uv run python scripts/validate_seasonality.py",
        "",
    ]
    for e in entries:
        lines.append(f"- id: {e['id']}")
        lines.append(f"  category: {e['category']}")
        lines.append(f"  season: \"{e['season']}\"")
    lines.append("")  # trailing newline
    path.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    tags = load_tags(TAGS)
    entries = build_entries(tags)
    write_yaml(entries, OUT)
    print(f"Wrote {len(entries)} entries to {OUT.relative_to(ROOT)}")
    by_cat: dict[str, int] = {}
    exploratory: list[str] = []
    for e in entries:
        by_cat[e["category"]] = by_cat.get(e["category"], 0) + 1
        if e["id"] not in tags:
            exploratory.append(e["id"])
    for cat, n in sorted(by_cat.items()):
        print(f"  {cat}: {n}")
    print(f"  (exploratory, not yet in recipe_tags.yml: {len(exploratory)})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
