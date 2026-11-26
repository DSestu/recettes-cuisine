# Spec Delta: Seasonal menu generator on `/calendrier/` — V1

Status: implemented (2026-11-26; approved the same day with the defaults written below)

Builds on `SPEC.md` ("Recettes de saison" mode). Everything not listed here inherits
from it: scoring formula, temporal categories, phase weights, URL-as-source-of-truth,
QR hook, code style, boundaries.

## 1. Objective

The ranked "Recettes de saison" list scores correctly but does not spark ideas: it reads
like a spreadsheet, and its top picks are flat (a recipe with a single in-season
ingredient at `peak` scores 1.00, same as a ratatouille built from five).

Add a **menu generator**: it proposes in-season recipes from the site's own corpus as
visual cards that can be rerolled and locked, in three modes.

Target user: the site owner, deciding what to cook. Desktop and mobile.

Success: open the page and leave with a dinner idea in under a minute; Repas and Semaine
produce menus you would actually cook.

## 2. Current behaviour

- `/calendrier/` has two modes via `?affichage=`: `ingredients` (Gantt, default) and
  `recettes-de-saison` (ranked list, `SPEC.md` §3).
- `scoreRecipe()` in `assets/js/calendrier.js` computes `weightedIn / n_temporal`.
- `assets/data/recipe-seasonality.json` per recipe: `slug, title, url, kind, image,
  temporal_ingredients[]`. No course tags, no servings, no ingredient lines.
- `_data/scaling.json` holds parsed quantities per ingredient-line index, keyed by
  source path, but not the line text.

## 3. New behaviour

### 3.1 Placement

A third mode in the existing toggle: `[ Ingrédients ] [ Recettes de saison ] [ Menu ]`,
selected by `?affichage=menu`. It reuses the existing quinzaine picker (defaults to
the current fortnight). The other two modes are unchanged.

### 3.2 Slot mechanism (shared by all modes)

- A menu is an ordered list of **slots**. Each slot holds one recipe card: photo
  (`images/<image>` card derivative), title (link to recipe), score badge (existing
  `scoreBadgeColor`), and the in-season ingredients at `peak`.
- Each slot has **Relancer** (reroll this slot) and **Garder** (lock toggle).
- A global **Nouveau menu** button rerolls every unlocked slot.
- Changing the quinzaine rerolls unlocked slots; locked slots stay even if now off-season
  (their badge reflects the new score).

### 3.3 Modes

| Mode | `?menu-mode=` | Slots | Eligible pool per slot |
|---|---|---|---|
| Surprise | `surprise` (default) | 4 | any recipe |
| Repas | `repas` | 3: Entrée, Plat, Dessert | by course tag, see §3.5 |
| Semaine | `semaine` | 7: Lundi…Dimanche | Plat pool |

Semaine adds a **Liste de courses** panel below the slots (§3.7).

### 3.4 Pick rule ("built around in-season produce")

For each candidate recipe at the selected quinzaine:

    pick_weight = score × min(n_temporal, 3) / 3

- `score` is the existing `scoreRecipe` value (all four temporal categories counted;
  the category toggles of the list mode do not apply here).
- The `min(n,3)/3` factor ranks a recipe built from 3+ seasonal ingredients above one
  with a single seasonal ingredient at the same ratio.
- Eligible: `pick_weight ≥ 0.4`. If a slot's pool has fewer than 3 eligible recipes,
  the threshold drops to `> 0`. If still empty, the slot shows « Rien de saison pour ce
  plat » with a Relancer that draws from the whole pool.
- Selection is weighted-random, proportional to `pick_weight`.
- Recipes with no temporal ingredient (`score = null`) are never picked.
- Components (`kind: component`) are never picked.

### 3.5 Course mapping (Repas, Semaine)

From canonical tags in `_data/recipe_tags.yml`:

- **Entrée**: `entree`, `soupe`, `salade`
- **Plat**: `plat`, `plat principal`, `repas`
- **Dessert**: `dessert`, `gateau`

A recipe can match several courses. Within one menu it fills at most one slot.

### 3.6 Variety and no-repeat

- No recipe appears twice in one menu.
- Two slots in one menu should not share the same top-weighted temporal ingredient
  (e.g. not two butternut dishes). This is a soft rule: drop it if it empties a pool.
- Each slot keeps a "seen" set: Relancer never returns a recipe already shown in that
  slot until the pool is exhausted, then the set resets.

### 3.7 Shopping list (Semaine)

- Lists the raw ingredient lines of the 7 recipes, grouped by recipe, at each recipe's
  own `servings`.
- Each line has a checkbox (in-page state only, not persisted).
- A **Copier** button copies the list as plain text.
- Merging identical ingredients across recipes is **deferred** (see §7).

### 3.8 URL state

New params, in the existing verbose style, written via `history.replaceState`:

    ?affichage=menu
    ?menu-mode=surprise|repas|semaine
    ?menu=slug1,slug2,…        current slot contents, in slot order
    ?menu-garde=0,2            indexes of locked slots

A reload or shared URL restores the same menu. Unknown slugs or modes fall back
silently: empty slot gets a fresh pick, bad mode → `surprise`.

## 4. Data changes

Extend each entry of `assets/data/recipe-seasonality.json` with:

    "courses":     ["entree" | "plat" | "dessert", …]   // derived from tags per §3.5
    "servings":    4
    "ingredients": ["600 g d'asperges vertes", …]       // raw frontmatter lines
    "time":        95                                   // prep + cook + rest, minutes (added in T3: cards show it)
    "difficulty":  1                                    // 1 | 2 | 3 (added in T3: cards show it)

Generated by `scripts/generate_recipe_seasonality.py` (already wired into pre-commit).
`SPEC.md` §10 lists any schema change as "ask first"; approving this spec approves
these three fields.

## 5. Project structure

    assets/js/menu-picker.js            # new: pure pick/variety/no-repeat logic, no DOM
    assets/js/calendrier.js             # modified: Menu mode, slot rendering, URL sync
    calendrier.html                     # modified: mode button, mount, styles
    scripts/generate_recipe_seasonality.py   # modified: 3 new fields
    assets/data/recipe-seasonality.json      # regenerated
    tests/test_menu_picker.js           # new

## 6. Process gate and success criteria

**Gate: design mockups first.** Before any code, produce mockups of Surprise, Repas
and Semaine (with shopping list) at desktop (1280 px) and mobile (390 px) widths,
through `/impeccable shape`. Implementation starts only after you approve them.

Success criteria:

1. `?affichage=menu` shows 4 Surprise cards for the current quinzaine; the other two
   modes render exactly as before.
2. Across 200 seeded Surprise rolls at `nov-2`, ≥ 70 % of picks have
   `n_temporal ≥ 2` (the "built around produce" rule is measurable).
3. Repas always fills Entrée/Plat/Dessert from the matching course pool, with no
   duplicate recipe.
4. Relancer on one slot never repeats a recipe until that slot's pool is exhausted;
   locked slots never change on Relancer, Nouveau menu or a quinzaine change.
5. Reloading the page with the URL restores the same menu and locks.
6. Semaine shopping list shows all 7 recipes' lines; Copier puts them on the clipboard.
7. Mobile 390 px: no horizontal scroll, Relancer/Garder targets ≥ 44 px.
8. `node tests/test_menu_picker.js` passes (seeded RNG: eligibility, weighting,
   no-repeat, locks, course filtering, empty-pool fallback).

## 7. Boundaries (deltas only)

- **Always**: keep `scoreRecipe` as the single scoring source; picking wraps it,
  never re-implements it. French UI copy.
- **Ask first**: changing the pick formula or thresholds in §3.4 after mockups are
  approved; adding course tags to recipes.
- **Never**: change the Ingrédients Gantt or the Recettes de saison list; edit recipe
  frontmatter.

## 8. Out of scope (deferred)

- Merging identical ingredients across recipes in the shopping list (needs a
  line → canonical-ingredient parser; current data can't do it reliably).
- Scaling the shopping list to a chosen number of people.
- Saving menus, history, or cross-device sync (the URL is the only memory).
- Recipes from outside the site; nutrition or budget balancing.
- Removing or redesigning the existing ranked list.

## 9. Open questions

1. **Shopping list**: is "lines grouped per recipe" (§3.7) good enough for V1, or is
   real merging (« 3 poireaux » from two recipes → « 6 poireaux ») a must-have?
   Merging adds about a day of parser work.
2. **Course mapping** (§3.5): should `soupe` count as Entrée, and `repas` as Plat?
3. **Surprise size**: 4 cards, or 3?
4. **Semaine days**: 7 named days, or 5 weekdays?
