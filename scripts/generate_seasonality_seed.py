#!/usr/bin/env python3
"""Generate `_data/seasonality.yml` — French seasonality calendar.

The map below is defined per-ingredient with structured boundaries:

    "fraise": {
        "category": "fruit",
        "seasons": [("apr-2", "may-1", "jul-1", "jul-2")],
        # (fade-in start, first peak, last peak, fade-out end)
    }

Multiple entries in `seasons` are allowed for ingredients with two distinct
windows in the year (e.g. spinach in spring and autumn).

Sources cross-referenced (metropolitan France):
  - Interfel — calendrier des fruits et légumes de saison
  - CRPMEM — calendrier des poissons et coquillages (Bretagne / Normandie)
  - INAO — cahiers des charges AOP fromages (Mont d'Or, Beaufort, etc.)
  - Fédération nationale des chasseurs — dates de chasse du gibier
  - AAPPMA — pêche des rivières

The script fills every quinzaine between `start` and `end` inclusively so
NO holes are possible in a continuous period. Intensity is assigned:
  - start..peak_start-1  → "start"  (opacité 35 %)
  - peak_start..peak_end → "peak"   (opacité 100 %)
  - peak_end+1..end      → "end"    (opacité 35 %)

Wrap-around (start > end in quinzaine index) is supported for winter seasons
that cross year boundary (huîtres, gibier, agrumes...).
"""
from __future__ import annotations

import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
TAGS = ROOT / "_data" / "recipe_tags.yml"
OUT = ROOT / "_data" / "seasonality.yml"

MONTHS = ["jan", "feb", "mar", "apr", "may", "jun",
          "jul", "aug", "sep", "oct", "nov", "dec"]

VALID_CATEGORIES = {
    "fruit", "legume", "viande", "poisson", "coquillage",
    "fromage", "herbe", "champignon", "autre",
}

# ---------------------------------------------------------------------------
# Ingredient definitions — French seasonality
# ---------------------------------------------------------------------------
# Structure:  id -> {"category": <cat>, "seasons": [(start, peak_start, peak_end, end), ...]}
# Ids MUST be ASCII (per format-pasted-recipe rules). Where an id already
# exists in `_data/recipe_tags.yml`, use the exact canonical form.
INGREDIENTS: dict[str, dict] = {

    # ============================================================
    # FRUITS
    # ============================================================
    "abricot":       {"category": "fruit", "seasons": [("jun-2", "jul-1", "aug-1", "aug-2")]},
    "agrumes":       {"category": "fruit", "seasons": [("nov-1", "dec-1", "feb-2", "mar-2")]},
    "amandes fraiches": {"category": "fruit", "seasons": [("aug-1", "aug-2", "sep-1", "sep-2")]},
    "cassis":        {"category": "fruit", "seasons": [("jun-2", "jul-1", "jul-2", "aug-1")]},
    "cerises":       {"category": "fruit", "seasons": [("may-2", "jun-1", "jun-2", "jul-2")]},
    "chataigne":     {"category": "fruit", "seasons": [("sep-2", "oct-1", "nov-2", "dec-1")]},
    "citron":        {"category": "fruit", "seasons": [("nov-1", "nov-2", "mar-1", "apr-1")]},
    "clementine":    {"category": "fruit", "seasons": [("oct-2", "nov-1", "dec-2", "feb-1")]},
    "coings":        {"category": "fruit", "seasons": [("sep-2", "oct-1", "nov-2", "dec-1")]},
    "figues":        {"category": "fruit", "seasons": [("aug-1", "aug-2", "sep-2", "oct-2")]},
    "fraises":       {"category": "fruit", "seasons": [("apr-2", "may-1", "jul-1", "jul-2")]},
    "fraises des bois":  {"category": "fruit", "seasons": [("jun-1", "jun-2", "aug-1", "aug-2")]},
    "framboises":    {"category": "fruit", "seasons": [("jun-1", "jun-2", "sep-1", "sep-2")]},
    "grenade":       {"category": "fruit", "seasons": [("oct-1", "oct-2", "dec-1", "dec-2")]},
    "groseilles":    {"category": "fruit", "seasons": [("jun-1", "jun-2", "jul-2", "aug-1")]},
    "kaki":          {"category": "fruit", "seasons": [("oct-2", "nov-1", "dec-1", "dec-2")]},
    "kiwi":          {"category": "fruit", "seasons": [("oct-2", "nov-1", "feb-2", "mar-1")]},
    "kumquat":       {"category": "fruit", "seasons": [("dec-1", "dec-2", "feb-1", "mar-1")]},
    "mandarine":     {"category": "fruit", "seasons": [("oct-2", "nov-1", "dec-2", "jan-2")]},
    "marrons":       {"category": "fruit", "seasons": [("oct-1", "oct-2", "nov-2", "dec-1")]},
    "melon":         {"category": "fruit", "seasons": [("jun-2", "jul-1", "aug-2", "sep-1")]},
    "mirabelles":    {"category": "fruit", "seasons": [("aug-1", "aug-2", "sep-1", "sep-2")]},
    "muscat":        {"category": "fruit", "seasons": [("sep-1", "sep-2", "oct-1", "oct-2")]},
    "mures":         {"category": "fruit", "seasons": [("jul-2", "aug-1", "sep-1", "sep-2")]},
    "myrtilles":     {"category": "fruit", "seasons": [("jul-1", "jul-2", "aug-2", "sep-1")]},
    "nectarines":    {"category": "fruit", "seasons": [("jun-2", "jul-1", "aug-2", "sep-1")]},
    "noisettes":     {"category": "fruit", "seasons": [("sep-1", "sep-2", "oct-2", "nov-1")]},
    "noisettes fraiches": {"category": "fruit", "seasons": [("sep-1", "sep-2", "oct-2", "nov-1")]},
    "noix":          {"category": "fruit", "seasons": [("sep-2", "oct-1", "nov-1", "dec-1")]},
    "noix fraiches": {"category": "fruit", "seasons": [("sep-2", "oct-1", "oct-2", "nov-2")]},
    "orange":        {"category": "fruit", "seasons": [("dec-1", "dec-2", "mar-1", "apr-1")]},
    "pamplemousse":  {"category": "fruit", "seasons": [("dec-1", "jan-1", "mar-1", "apr-1")]},
    "pasteque":      {"category": "fruit", "seasons": [("jul-1", "jul-2", "aug-2", "sep-1")]},
    "peche":         {"category": "fruit", "seasons": [("jun-2", "jul-1", "aug-2", "sep-1")]},
    "physalis":      {"category": "fruit", "seasons": [("aug-2", "sep-1", "oct-2", "nov-1")]},
    "poire":         {"category": "fruit", "seasons": [("aug-2", "sep-1", "dec-2", "jan-2")]},
    "pomelo":        {"category": "fruit", "seasons": [("dec-1", "jan-1", "mar-1", "apr-1")]},
    "pomme":         {"category": "fruit", "seasons": [("sep-1", "sep-2", "jan-2", "feb-1")]},
    "prunes":        {"category": "fruit", "seasons": [("jul-2", "aug-1", "sep-1", "sep-2")]},
    "quetsches":     {"category": "fruit", "seasons": [("aug-2", "sep-1", "sep-2", "oct-1")]},
    "raisin":        {"category": "fruit", "seasons": [("aug-2", "sep-1", "oct-1", "oct-2")]},
    "reine claude":  {"category": "fruit", "seasons": [("aug-1", "aug-2", "sep-1", "sep-2")]},
    "rhubarbe":      {"category": "fruit", "seasons": [("apr-1", "apr-2", "jun-1", "jul-1")]},

    # ============================================================
    # LÉGUMES
    # ============================================================
    "ail nouveau":       {"category": "legume", "seasons": [("jun-1", "jun-2", "jul-2", "aug-1")]},
    "ail des ours":      {"category": "legume", "seasons": [("mar-1", "apr-1", "apr-2", "may-1")]},
    "artichauts":        {"category": "legume", "seasons": [("apr-1", "may-1", "sep-1", "oct-1")]},
    "artichaut violet":  {"category": "legume", "seasons": [("apr-1", "may-1", "jun-2", "jul-1")]},
    "asperges":          {"category": "legume", "seasons": [("apr-1", "apr-2", "may-2", "jun-2")]},
    "asperges blanches": {"category": "legume", "seasons": [("apr-1", "apr-2", "may-2", "jun-1")]},
    "asperges vertes":   {"category": "legume", "seasons": [("apr-1", "apr-2", "may-2", "jun-2")]},
    "aubergines":        {"category": "legume", "seasons": [("jun-2", "jul-1", "sep-2", "oct-1")]},
    "betteraves":        {"category": "legume", "seasons": [("jun-1", "jul-1", "jan-2", "mar-1")]},
    "blettes":           {"category": "legume", "seasons": [("apr-1", "may-1", "oct-2", "nov-1")]},
    "brocolis":          {"category": "legume", "seasons": [("aug-2", "sep-1", "dec-1", "jan-1")]},
    "butternut":         {"category": "legume", "seasons": [("sep-1", "sep-2", "dec-2", "jan-1")]},
    "cardons":           {"category": "legume", "seasons": [("oct-1", "nov-1", "dec-2", "jan-1")]},
    "carottes":          {"category": "legume", "seasons": [("jun-1", "jul-1", "oct-1", "nov-2")]},
    "carottes nouvelles": {"category": "legume", "seasons": [("apr-1", "may-1", "jul-1", "aug-1")]},
    "celeri":            {"category": "legume", "seasons": [("jul-1", "aug-1", "nov-1", "dec-1")]},
    "celeri rave":       {"category": "legume", "seasons": [("sep-1", "oct-1", "feb-1", "mar-1")]},
    "chou":              {"category": "legume", "seasons": [("sep-1", "oct-1", "feb-2", "mar-1")]},
    "chou kale":         {"category": "legume", "seasons": [("oct-1", "nov-1", "feb-1", "mar-1")]},
    "chou pointu":       {"category": "legume", "seasons": [("apr-1", "may-1", "jun-1", "jul-1")]},
    "chou rouge":        {"category": "legume", "seasons": [("sep-1", "oct-1", "jan-1", "feb-2")]},
    "chou romanesco":    {"category": "legume", "seasons": [("sep-1", "oct-1", "dec-1", "jan-1")]},
    "chou vert frise":   {"category": "legume", "seasons": [("sep-1", "oct-1", "feb-2", "mar-1")]},
    "chou-fleur":        {"category": "legume", "seasons": [("sep-1", "sep-2", "dec-1", "jan-1")]},
    "choux de bruxelles": {"category": "legume", "seasons": [("oct-1", "oct-2", "jan-2", "feb-1")]},
    "ciboule":           {"category": "legume", "seasons": [("mar-1", "apr-1", "oct-1", "oct-2")]},
    "concombre":         {"category": "legume", "seasons": [("may-1", "may-2", "aug-2", "sep-2")]},
    "courge":            {"category": "legume", "seasons": [("sep-2", "oct-1", "dec-1", "jan-1")]},
    "courgettes":        {"category": "legume", "seasons": [("may-2", "jun-1", "sep-1", "oct-1")]},
    "fleurs de courgette":  {"category": "legume", "seasons": [("jun-1", "jun-2", "aug-1", "aug-2")]},
    "cresson":           {"category": "legume", "seasons": [("mar-1", "apr-1", "jun-1", "jul-1"),
                                                              ("sep-1", "oct-1", "oct-2", "nov-1")]},
    "crosnes":           {"category": "legume", "seasons": [("nov-1", "nov-2", "jan-2", "feb-1")]},
    "edamame":           {"category": "legume", "seasons": [("jul-1", "jul-2", "aug-2", "sep-1")]},
    "endives":           {"category": "legume", "seasons": [("oct-1", "nov-1", "feb-2", "apr-1")]},
    "epinards":          {"category": "legume", "seasons": [("mar-1", "mar-2", "may-1", "may-2"),
                                                              ("oct-1", "oct-2", "nov-1", "nov-2")]},
    "fenouil":           {"category": "legume", "seasons": [("oct-1", "nov-1", "feb-2", "apr-1")]},
    "feves":             {"category": "legume", "seasons": [("apr-2", "may-1", "jun-1", "jul-1")]},
    "haricots beurre":   {"category": "legume", "seasons": [("jul-1", "jul-2", "aug-2", "sep-2")]},
    "haricots coco":     {"category": "legume", "seasons": [("jul-2", "aug-1", "sep-1", "sep-2")]},
    "haricots verts":    {"category": "legume", "seasons": [("jun-2", "jul-1", "sep-1", "sep-2")]},
    "laitue":            {"category": "legume", "seasons": [("apr-1", "may-1", "sep-1", "oct-1")]},
    "mache":             {"category": "legume", "seasons": [("oct-1", "nov-1", "feb-1", "mar-1")]},
    "mais frais":        {"category": "legume", "seasons": [("jul-1", "aug-1", "sep-2", "oct-1")]},
    "mesclun":           {"category": "legume", "seasons": [("apr-1", "may-1", "sep-1", "oct-1")]},
    "navets":            {"category": "legume", "seasons": [("sep-1", "oct-1", "feb-2", "mar-1")]},
    "navets nouveaux":   {"category": "legume", "seasons": [("apr-1", "may-1", "jun-1", "jul-1")]},
    "oignon nouveau":    {"category": "legume", "seasons": [("apr-1", "may-1", "jun-2", "jul-2")]},
    "panais":            {"category": "legume", "seasons": [("oct-1", "nov-1", "feb-2", "mar-1")]},
    "patate douce":      {"category": "legume", "seasons": [("oct-1", "oct-2", "jan-2", "feb-1")]},
    "persil racine":     {"category": "legume", "seasons": [("oct-1", "nov-1", "feb-1", "mar-1")]},
    "petits pois":       {"category": "legume", "seasons": [("may-1", "may-2", "jun-2", "jul-2")]},
    "pissenlit":         {"category": "legume", "seasons": [("mar-1", "apr-1", "apr-2", "may-1")]},
    "poireau japonais":  {"category": "legume", "seasons": [("sep-1", "oct-1", "feb-2", "apr-1")]},
    "poireau baguette":  {"category": "legume", "seasons": [("may-1", "jun-1", "jul-2", "aug-2")]},
    "poireaux":          {"category": "legume", "seasons": [("sep-1", "oct-1", "feb-2", "apr-1")]},
    "poivrons":          {"category": "legume", "seasons": [("jun-2", "jul-1", "sep-2", "oct-1")]},
    "pommes de terre nouvelles": {"category": "legume", "seasons": [("may-1", "may-2", "jul-1", "aug-1")]},
    "potimarron":        {"category": "legume", "seasons": [("sep-2", "oct-1", "nov-2", "dec-2")]},
    "potiron":           {"category": "legume", "seasons": [("sep-2", "oct-1", "nov-2", "dec-2")]},
    "racine de bardane": {"category": "legume", "seasons": [("oct-1", "nov-1", "dec-2", "feb-1")]},
    "racine de lotus":   {"category": "legume", "seasons": [("nov-1", "dec-1", "feb-1", "feb-2")]},
    "radis":             {"category": "legume", "seasons": [("mar-2", "apr-2", "jul-2", "aug-2")]},
    "radis noir":        {"category": "legume", "seasons": [("oct-1", "nov-1", "feb-1", "mar-1")]},
    "roquette":          {"category": "legume", "seasons": [("apr-1", "may-1", "jul-2", "aug-2")]},
    "rutabaga":          {"category": "legume", "seasons": [("oct-1", "nov-1", "feb-1", "mar-1")]},
    "salsifis":          {"category": "legume", "seasons": [("oct-1", "nov-1", "feb-1", "mar-1")]},
    "scorsonere":        {"category": "legume", "seasons": [("oct-1", "nov-1", "feb-1", "mar-1")]},
    "tetragone":         {"category": "legume", "seasons": [("jun-1", "jul-1", "sep-1", "oct-1")]},
    "tomate cerise":     {"category": "legume", "seasons": [("jun-2", "jul-1", "sep-1", "oct-1")]},
    "tomates":           {"category": "legume", "seasons": [("jun-2", "jul-1", "sep-1", "oct-1")]},
    "topinambours":      {"category": "legume", "seasons": [("oct-1", "nov-1", "feb-1", "mar-1")]},
    "trevise":           {"category": "legume", "seasons": [("oct-1", "nov-1", "mar-1", "apr-1")]},

    # ============================================================
    # HERBES fraîches
    # ============================================================
    "aneth":       {"category": "herbe", "seasons": [("may-1", "jun-1", "aug-2", "sep-2")]},
    "basilic":     {"category": "herbe", "seasons": [("may-1", "may-2", "aug-2", "sep-2")]},
    "cerfeuil":    {"category": "herbe", "seasons": [("mar-1", "apr-1", "jun-2", "jul-1")]},
    "ciboulette":  {"category": "herbe", "seasons": [("mar-1", "apr-1", "sep-1", "oct-1")]},
    "coriandre":   {"category": "herbe", "seasons": [("may-1", "jun-1", "aug-2", "sep-1")]},
    "estragon":    {"category": "herbe", "seasons": [("apr-1", "may-1", "aug-2", "sep-1")]},
    "fenouil feuilles": {"category": "herbe", "seasons": [("apr-1", "may-1", "aug-2", "sep-2")]},
    "menthe":      {"category": "herbe", "seasons": [("apr-1", "may-1", "sep-1", "oct-1")]},
    "origan":      {"category": "herbe", "seasons": [("may-1", "jun-1", "aug-2", "sep-1")]},
    "oseille": {"category": "herbe", "seasons": [("apr-1", "may-1", "aug-2", "sep-1")]},
    "sarriette":   {"category": "herbe", "seasons": [("may-1", "jun-1", "aug-1", "sep-1")]},
    "shiso":       {"category": "herbe", "seasons": [("jun-1", "jul-1", "aug-2", "sep-1")]},
    "verveine":    {"category": "herbe", "seasons": [("jun-1", "jul-1", "aug-2", "sep-1")]},

    # ============================================================
    # CHAMPIGNONS sauvages (cultivés année-longue exclus)
    # ============================================================
    "bolets":         {"category": "champignon", "seasons": [("aug-2", "sep-1", "oct-2", "nov-1")]},
    "cepes":          {"category": "champignon", "seasons": [("aug-2", "sep-1", "oct-2", "nov-1")]},
    "chanterelles":   {"category": "champignon", "seasons": [("jun-1", "jul-1", "oct-1", "nov-1")]},
    "coulemelles":    {"category": "champignon", "seasons": [("aug-2", "sep-1", "oct-2", "nov-1")]},
    "girolles":       {"category": "champignon", "seasons": [("jun-1", "jul-1", "sep-2", "nov-1")]},
    "lactaires":      {"category": "champignon", "seasons": [("sep-1", "sep-2", "oct-2", "nov-1")]},
    "morilles":       {"category": "champignon", "seasons": [("mar-2", "apr-1", "may-1", "may-2")]},
    "mousserons":     {"category": "champignon", "seasons": [("apr-2", "may-1", "jun-1", "jun-2"),
                                                              ("sep-1", "sep-2", "oct-1", "oct-2")]},
    "pieds bleus":    {"category": "champignon", "seasons": [("oct-1", "oct-2", "dec-1", "dec-2")]},
    "pieds de mouton": {"category": "champignon", "seasons": [("sep-2", "oct-1", "dec-2", "jan-1")]},
    "pleurotes":      {"category": "champignon", "seasons": [("sep-1", "oct-1", "dec-2", "jan-1")]},
    "roses des pres": {"category": "champignon", "seasons": [("apr-2", "may-1", "oct-2", "nov-1")]},
    "trompettes de la mort": {"category": "champignon", "seasons": [("sep-2", "oct-1", "nov-2", "dec-1")]},

    # ============================================================
    # POISSONS
    # ============================================================
    "anchois":        {"category": "poisson", "seasons": [("apr-1", "may-1", "sep-2", "oct-2")]},
    "bar":            {"category": "poisson", "seasons": [("may-1", "jun-1", "oct-2", "nov-2")]},
    "barbue":         {"category": "poisson", "seasons": [("mar-1", "apr-1", "sep-2", "oct-2")]},
    "bonite":         {"category": "poisson", "seasons": [("aug-1", "sep-1", "oct-1", "nov-1")]},
    "cabillaud":      {"category": "poisson", "seasons": [("sep-1", "oct-1", "mar-2", "may-1")]},
    "congre":         {"category": "poisson", "seasons": [("apr-1", "may-1", "oct-1", "nov-1")]},
    "daurade royale": {"category": "poisson", "seasons": [("may-1", "jun-1", "sep-2", "oct-2")]},
    "dorade":         {"category": "poisson", "seasons": [("may-1", "jun-1", "sep-2", "oct-2")]},
    "eglefin":        {"category": "poisson", "seasons": [("sep-1", "oct-1", "feb-2", "mar-2")]},
    "eperlan":        {"category": "poisson", "seasons": [("nov-1", "dec-1", "feb-1", "mar-1")]},
    "espadon":        {"category": "poisson", "seasons": [("apr-2", "may-1", "sep-2", "oct-1")]},
    "hareng":         {"category": "poisson", "seasons": [("sep-1", "oct-1", "feb-1", "mar-1")]},
    "julienne":       {"category": "poisson", "seasons": [("apr-1", "may-1", "oct-1", "nov-1")]},
    "lieu jaune":     {"category": "poisson", "seasons": [("apr-1", "may-1", "oct-1", "nov-1")]},
    "lieu noir":      {"category": "poisson", "seasons": [("sep-1", "oct-1", "mar-2", "may-1")]},
    "limande":        {"category": "poisson", "seasons": [("apr-1", "may-1", "oct-1", "nov-1")]},
    "lotte":          {"category": "poisson", "seasons": [("oct-1", "nov-1", "mar-2", "may-1")]},
    "loup":           {"category": "poisson", "seasons": [("may-1", "jun-1", "oct-2", "nov-2")]},
    "maquereau":      {"category": "poisson", "seasons": [("apr-1", "may-1", "jul-2", "sep-1")]},
    "merlan":         {"category": "poisson", "seasons": [("sep-1", "oct-1", "mar-2", "may-1")]},
    "merlu":          {"category": "poisson", "seasons": [("apr-1", "may-1", "aug-2", "sep-2")]},
    "raie":           {"category": "poisson", "seasons": [("sep-1", "oct-1", "feb-2", "mar-2")]},
    "rouget":         {"category": "poisson", "seasons": [("may-1", "jun-1", "sep-2", "oct-2")]},
    "rouget grondin": {"category": "poisson", "seasons": [("apr-1", "may-1", "oct-1", "nov-1")]},
    "saint-pierre":   {"category": "poisson", "seasons": [("jun-1", "jul-1", "sep-2", "oct-2")]},
    "sardines":       {"category": "poisson", "seasons": [("may-1", "jun-1", "sep-1", "oct-1")]},
    "sole":           {"category": "poisson", "seasons": [("mar-1", "apr-1", "sep-2", "oct-2")]},
    "thon":           {"category": "poisson", "seasons": [("may-1", "jun-1", "sep-1", "oct-1")]},
    "thon blanc":     {"category": "poisson", "seasons": [("jun-1", "jul-1", "aug-2", "sep-2")]},
    "thon rouge":     {"category": "poisson", "seasons": [("jun-1", "jul-1", "sep-1", "oct-1")]},
    "turbot":         {"category": "poisson", "seasons": [("mar-1", "apr-1", "sep-2", "oct-2")]},

    # ============================================================
    # COQUILLAGES & CRUSTACÉS
    # ============================================================
    "bulots":              {"category": "coquillage", "seasons": [("mar-1", "apr-1", "oct-2", "nov-1")]},
    "calamar":             {"category": "coquillage", "seasons": [("sep-1", "oct-1", "feb-2", "mar-2")]},
    "coques":              {"category": "coquillage", "seasons": [("mar-1", "apr-1", "sep-2", "oct-2")]},
    "crabe":               {"category": "coquillage", "seasons": [("apr-1", "may-1", "sep-2", "oct-2")]},
    "crevette grise":      {"category": "coquillage", "seasons": [("apr-1", "may-1", "oct-2", "nov-1")]},
    "ecrevisse":           {"category": "coquillage", "seasons": [("jun-1", "jul-1", "oct-2", "nov-1")]},
    "etrille":             {"category": "coquillage", "seasons": [("apr-1", "may-1", "sep-2", "oct-2")]},
    "homard":              {"category": "coquillage", "seasons": [("may-1", "jun-1", "sep-2", "oct-2")]},
    "huitres":             {"category": "coquillage", "seasons": [("sep-1", "sep-2", "mar-2", "apr-1")]},
    "langouste":           {"category": "coquillage", "seasons": [("apr-2", "may-1", "aug-2", "sep-1")]},
    "langoustines":        {"category": "coquillage", "seasons": [("apr-1", "may-1", "jul-2", "aug-2")]},
    "moules":              {"category": "coquillage", "seasons": [("jul-1", "aug-1", "nov-2", "dec-1")]},
    "moules de bouchot":   {"category": "coquillage", "seasons": [("jul-1", "aug-1", "nov-2", "dec-1")]},
    "oursin":              {"category": "coquillage", "seasons": [("nov-1", "dec-1", "mar-2", "apr-1")]},
    "palourdes":           {"category": "coquillage", "seasons": [("sep-1", "oct-1", "mar-2", "apr-2")]},
    "petoncles":           {"category": "coquillage", "seasons": [("nov-1", "dec-1", "mar-2", "apr-1")]},
    "praires":             {"category": "coquillage", "seasons": [("sep-1", "oct-1", "feb-2", "mar-1")]},
    "saint-jacques":       {"category": "coquillage", "seasons": [("oct-1", "nov-1", "mar-1", "may-1")]},
    "seiche":              {"category": "coquillage", "seasons": [("mar-1", "apr-1", "sep-2", "oct-2")]},
    "tourteau":            {"category": "coquillage", "seasons": [("apr-1", "may-1", "sep-2", "oct-2")]},

    # ============================================================
    # VIANDES saisonnières (élevages saisonniers + gibier)
    # ============================================================
    "agneau":            {"category": "viande", "seasons": [("mar-1", "apr-1", "may-2", "jun-1")]},
    "agneau de lait":    {"category": "viande", "seasons": [("dec-2", "jan-1", "may-1", "may-2")]},
    "agneau de pauillac":   {"category": "viande", "seasons": [("mar-1", "apr-1", "jun-2", "jul-1")]},
    "agneau pre-sale":   {"category": "viande", "seasons": [("jul-1", "jul-2", "aug-2", "sep-2")]},
    "becasse":           {"category": "viande", "seasons": [("oct-2", "nov-1", "jan-1", "jan-2")]},
    "biche":             {"category": "viande", "seasons": [("oct-1", "oct-2", "dec-2", "jan-2")]},
    "cabri":             {"category": "viande", "seasons": [("mar-1", "apr-1", "apr-2", "may-1")]},
    "canard sauvage":    {"category": "viande", "seasons": [("aug-2", "sep-1", "dec-1", "dec-2")]},
    "cerf":              {"category": "viande", "seasons": [("sep-1", "oct-1", "dec-2", "jan-2")]},
    "chevreau":          {"category": "viande", "seasons": [("mar-1", "apr-1", "apr-2", "may-1")]},
    "chevreuil":         {"category": "viande", "seasons": [("sep-1", "oct-1", "dec-2", "jan-2")]},
    "faisan":            {"category": "viande", "seasons": [("oct-1", "oct-2", "jan-2", "feb-1")]},
    "foie gras":         {"category": "viande", "seasons": [("oct-1", "nov-1", "dec-2", "jan-1")]},
    "gibier":            {"category": "viande", "seasons": [("oct-1", "oct-2", "dec-2", "jan-2")]},
    "grive":             {"category": "viande", "seasons": [("oct-1", "nov-1", "jan-2", "feb-1")]},
    "lapin sauvage":     {"category": "viande", "seasons": [("sep-1", "oct-1", "jan-2", "feb-1")]},
    "lievre":            {"category": "viande", "seasons": [("sep-1", "oct-1", "nov-2", "dec-1")]},
    "marcassin":         {"category": "viande", "seasons": [("sep-1", "oct-1", "jan-2", "feb-1")]},
    "palombe":           {"category": "viande", "seasons": [("oct-1", "oct-2", "nov-1", "nov-2")]},
    "perdreau":          {"category": "viande", "seasons": [("sep-1", "sep-2", "oct-2", "nov-1")]},
    "perdrix":           {"category": "viande", "seasons": [("sep-1", "oct-1", "dec-2", "jan-1")]},
    "sanglier":          {"category": "viande", "seasons": [("sep-2", "oct-1", "jan-2", "feb-1")]},

    # ============================================================
    # FROMAGES saisonniers (lait de saison / AOP transhumance)
    # ============================================================
    "beaufort":              {"category": "fromage", "seasons": [("jul-1", "aug-1", "nov-1", "dec-1")]},
    "beaufort d'alpage":       {"category": "fromage", "seasons": [("aug-1", "sep-1", "oct-2", "nov-2")]},
    "bleu de termignon":        {"category": "fromage", "seasons": [("sep-1", "oct-1", "dec-2", "jan-1")]},
    "brebis des pyrenees":       {"category": "fromage", "seasons": [("mar-1", "apr-1", "oct-1", "nov-1")]},
    "brousse de brebis":     {"category": "fromage", "seasons": [("mar-1", "apr-1", "may-2", "jun-1")]},
    "chevre":                {"category": "fromage", "seasons": [("mar-1", "apr-1", "aug-2", "sep-1")]},
    "chevrotin":             {"category": "fromage", "seasons": [("apr-1", "may-1", "sep-2", "oct-1")]},
    "crottin de chavignol":     {"category": "fromage", "seasons": [("mar-1", "apr-1", "sep-1", "oct-1")]},
    "fourme de montbrison frais": {"category": "fromage", "seasons": [("mar-1", "apr-1", "sep-2", "oct-2")]},
    "mont d'or":             {"category": "fromage", "seasons": [("sep-2", "oct-1", "feb-2", "may-1")]},
    "reblochon":             {"category": "fromage", "seasons": [("jul-1", "aug-1", "sep-2", "oct-2")]},
    "rocamadour":            {"category": "fromage", "seasons": [("mar-1", "apr-1", "sep-1", "oct-1")]},
    "sainte-maure":          {"category": "fromage", "seasons": [("mar-1", "apr-1", "sep-1", "oct-1")]},
    "salers":                {"category": "fromage", "seasons": [("apr-2", "may-1", "sep-2", "nov-1")]},
    "selles-sur-cher":       {"category": "fromage", "seasons": [("mar-1", "apr-1", "sep-1", "oct-1")]},
    "tomme de savoie d'alpage":   {"category": "fromage", "seasons": [("jul-1", "aug-1", "sep-2", "oct-2")]},
    "vacherin des bauges":       {"category": "fromage", "seasons": [("nov-1", "dec-1", "feb-2", "mar-1")]},
    "valencay":              {"category": "fromage", "seasons": [("mar-1", "apr-1", "sep-1", "oct-1")]},
}

# ---------------------------------------------------------------------------
# Helpers — quinzaine arithmetic
# ---------------------------------------------------------------------------

def parse_q(s: str) -> int:
    """'may-1' -> 0..23 quinzaine index."""
    month, q = s.split("-")
    if month not in MONTHS:
        raise ValueError(f"unknown month: {month}")
    q = int(q)
    if q not in (1, 2):
        raise ValueError(f"quinzaine must be 1 or 2: {s}")
    return MONTHS.index(month) * 2 + (q - 1)


def idx_to_q(idx: int) -> str:
    """0..23 -> 'may-1'."""
    return f"{MONTHS[idx // 2]}-{idx % 2 + 1}"


def range_quinzaines(start: str, end: str) -> list[int]:
    """Inclusive range of quinzaine indices, wrapping around dec→jan if start>end."""
    s, e = parse_q(start), parse_q(end)
    if e >= s:
        return list(range(s, e + 1))
    return list(range(s, 24)) + list(range(0, e + 1))


def build_season(start: str, peak_start: str, peak_end: str, end: str) -> list[tuple[int, str]]:
    """Return the list of (quinzaine_idx, intensity) for one season window.

    Contiguous by construction — every slot from start to end is emitted."""
    all_slots = range_quinzaines(start, end)
    peak_slots = set(range_quinzaines(peak_start, peak_end))
    pairs: list[tuple[int, str]] = []
    seen_peak = False
    for slot in all_slots:
        if slot in peak_slots:
            pairs.append((slot, "peak"))
            seen_peak = True
        elif not seen_peak:
            pairs.append((slot, "start"))
        else:
            pairs.append((slot, "end"))
    return pairs


def format_season(pairs: list[tuple[int, str]]) -> str:
    return ", ".join(f"{idx_to_q(i)}:{intensity}" for i, intensity in pairs)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def load_tags(path: Path) -> dict[str, bool]:
    with path.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return {entry["id"]: bool(entry.get("ingredient", False)) for entry in data}


def build_entries(tags: dict[str, bool]) -> list[dict]:
    for iid, spec in INGREDIENTS.items():
        cat = spec["category"]
        if cat not in VALID_CATEGORIES:
            raise ValueError(f"{iid}: invalid category {cat}")
        if iid in tags and tags[iid] is not True:
            raise ValueError(f"{iid}: in recipe_tags.yml but not ingredient:true")

    entries: list[dict] = []
    for iid, spec in INGREDIENTS.items():
        season_pairs: list[tuple[int, str]] = []
        seen_slots: set[int] = set()
        for start, ps, pe, end in spec["seasons"]:
            pairs = build_season(start, ps, pe, end)
            for slot, intensity in pairs:
                if slot in seen_slots:
                    raise ValueError(f"{iid}: quinzaine {idx_to_q(slot)} listed twice across seasons")
                seen_slots.add(slot)
            season_pairs.extend(pairs)
        # Sort by natural quinzaine index for compact YAML output.
        season_pairs.sort(key=lambda p: p[0])
        entries.append({
            "id": iid,
            "category": spec["category"],
            "season": format_season(season_pairs),
        })
    entries.sort(key=lambda e: (e["category"], e["id"]))
    return entries


def write_yaml(entries: list[dict], path: Path) -> None:
    lines = [
        "# Ingredient seasonality (metropolitan France) — quinzaine granularity.",
        "# Regenerate with: uv run python scripts/generate_seasonality_seed.py",
        "# Validate with:   uv run python scripts/validate_seasonality.py",
        "",
    ]
    for e in entries:
        lines.append(f"- id: {e['id']}")
        lines.append(f"  category: {e['category']}")
        lines.append(f"  season: \"{e['season']}\"")
    lines.append("")
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
