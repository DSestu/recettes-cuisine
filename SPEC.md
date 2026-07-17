# SPEC — "Recettes de saison" mode on `/calendrier/`

Status: **DRAFT**, awaiting confirmation.

## 1. Objective

Add a second view mode to `/calendrier/`. Today the page renders a Gantt-style calendar
of *ingredients* over 24 quinzaines; this new mode renders a **ranked list of recipes**
for a chosen quinzaine, scored by how much of each recipe's produce is currently in
season. The mode toggle lives at the top of the page.

Target user: home cook browsing "what should I cook right now" — mobile-first. The list
format survives narrow viewports better than a heatmap alternative.

## 2. Core mechanic

For each (recipe, quinzaine) compute a score:

    score = n_temporal_in_season / n_temporal_total

where "temporal ingredients" are the recipe's canonical ingredient tags whose category
in `_data/seasonality.yml` is in the **temporal set**:

    TEMPORAL_CATEGORIES = { legume, fruit, champignon, coquillage }

- Ingredients from other categories (`viande`, `poisson`, `fromage`, `herbe`) and
  ingredients without a seasonality entry do **not** count in numerator or denominator —
  they are treated as always available and do not gate the score.
- **Phase weighting**: `peak` counts as `1.0`, `start` and `end` count as `0.5`. The
  numerator sums these weights; the denominator sums `1.0` per temporal ingredient
  regardless of when it's in season. So a recipe with two temporal ingredients — one
  at `peak`, one at `start` — scores `(1.0 + 0.5) / 2 = 0.75`.
- If an ingredient has *no* phase token at the selected quinzaine, its weight is `0`.
- A recipe with `n_temporal_total == 0` gets `score = null` and is pinned below the
  ranked list under "Sans contrainte de saison".

**Dynamic category exclusion.** The user can toggle any of the four temporal categories
off. When a category is excluded, its ingredients are removed from both numerator and
denominator (scope narrowing, not recipe filtering — a recipe containing an excluded
category still appears). If all four are off, the whole list collapses into "Sans
contrainte" and an empty-state message replaces the ranked section.

## 3. UX

**Mode toggle** at the top of `/calendrier/`:

    [ Ingrédients ]  [ Recettes de saison ]

**"Recettes de saison" mode layout:**

    ── Cette quinzaine (jul-2) ──   [ ‹ ] [ › ]
    Catégories comptées:  [x] légumes  [x] fruits  [x] champignons  [x] coquillages
    [ ] Inclure les composants (sauces, marinades, etc.)

    ★★★  Ratatouille                     score 1.00 · 5 pleine saison / 5
    ★★★  Tarte aux tomates               score 0.95 · 3 pleine, 1 début / 4
    ★★☆  Salade niçoise                  score 0.75 · 2 pleine, 1 début / 4 — hors saison: câpres
    ★☆☆  Velouté d'asperges              score 0.25 · 0 pleine, 1 fin / 3 — hors saison: petits pois, fèves
    ★☆☆  Tajine d'agneau                 score 0.25 · 1 pleine / 4 — hors saison: aubergine, courgette, poivron
    ─── Sans contrainte de saison ───
    ·    Aiguillettes de poulet
    ·    …

Details:
- **Quinzaine picker**: defaults to the current quinzaine (from `new Date()`).
  Left/right arrows step through 24 quinzaines; keyboard `←` / `→` when the section is
  focused. Displays the quinzaine as `mmm-N` (e.g. `jul-2`) with a French long-form
  tooltip ("Deuxième quinzaine de juillet").
- **Category toggles**: four checkboxes for the temporal categories, all on by default.
- **"Inclure les composants" toggle**: off by default. When on, sub-recipes from
  `_components/*.md` are added to the same ranked list, marked with a small "composant"
  badge. State persists via a URL parameter (see §5).
- **Row**: title (link to recipe), 0–3 stars (score binned at `< 0.33` = 0★,
  `< 0.66` = 1★, `< 1.0` = 2★, `= 1.0` = 3★), the numeric score to two decimals, a
  compact breakdown (`P pleine, S début, E fin / N`), then a muted inline list of the
  *out-of-season* temporal ingredients. Clicking the row = navigate to the recipe.
- **Sort**: score desc, then title asc for stable ordering. Recipes with `score = 0`
  still appear (0★) above the "Sans contrainte" pinned section.
- **Empty state**: if all four toggles are off, show "Aucune catégorie sélectionnée"
  and hide the ranked list; keep the pinned section visible.

Ingredient mode (existing calendar) is untouched.

## 4. Data flow

Build a static JSON blob at Jekyll build time:

    assets/data/recipe-seasonality.json

Shape:

    {
      "fortnights": ["jan-1","jan-2", …, "dec-2"],
      "temporal_categories": ["legume","fruit","champignon","coquillage"],
      "phase_weights": { "peak": 1.0, "start": 0.5, "end": 0.5 },
      "recipes": [
        {
          "slug": "ratatouille",
          "title": "Ratatouille",
          "url": "/ratatouille/",
          "kind": "recipe",
          "temporal_ingredients": [
            { "id": "tomates",   "category": "legume",
              "phases": { "10": "peak", "11": "peak", "12": "peak", "13": "peak" } },
            { "id": "aubergine", "category": "legume",
              "phases": { "12": "start", "13": "peak", "14": "peak", "15": "end" } },
            …
          ]
        },
        {
          "slug": "sauce_aromatique_karaage",
          "title": "Sauce aromatique pour Karaage",
          "url": "/composants/sauce_aromatique_karaage/",
          "kind": "component",
          "temporal_ingredients": []
        },
        …
      ]
    }

- `phases` is a map from fortnight index (0..23, string keys since JSON) to phase
  string (`start` | `peak` | `end`). Absence from the map = ingredient not in season
  that fortnight (weight = 0).
- `kind` is `recipe` (from `_recipes/*.md`) or `component` (from `_components/*.md`);
  the UI toggle in §3 filters on this.
- Every recipe / component with at least one canonical ingredient tag is included,
  regardless of whether any of its tags are temporal.

**Scoring lives client-side** so category toggles re-score instantly with no network.

Generator: `scripts/generate_recipe_seasonality.py`, uv-managed, `pyyaml` + stdlib
only. Mirrors the layout of the existing `scripts/generate_seasonality_seed.py`.
Reads `_recipes/*.md`, `_data/seasonality.yml`, `_data/recipe_tags.yml`. Writes the
JSON blob. Wired into `.pre-commit-config.yaml` alongside the other generators.

## 5. URL state

Piggyback on the existing URL-as-source-of-truth convention in `calendrier.js`. The
existing `vue=fit|wide` param is orthogonal (layout mode for the ingredient calendar)
and must not be repurposed. New parameters use verbose, self-explanatory names so a
shared / QR-encoded URL is legible.

Params introduced by this feature:

    ?affichage=recettes-de-saison
        Selects the new mode. When absent (or set to `ingredients`), the page renders
        the existing ingredient calendar exactly as today. Fully backwards-compatible.

    ?quinzaine=jul-2
        Selected quinzaine, encoded as `<month3>-<half>`. Valid values: `jan-1`,
        `jan-2`, `feb-1`, …, `dec-2` (24 total). Absent → current quinzaine derived
        client-side from `new Date()`. Only meaningful when
        `affichage=recettes-de-saison`.

    ?categories-saison=legumes,fruits,champignons,coquillages
        Comma-separated list of temporal categories currently enabled. Values map
        1:1 to the canonical seasonality categories in `_data/seasonality.yml`
        (URL uses plural French labels for readability; JS maps them to the canonical
        singular ASCII ids `legume`, `fruit`, `champignon`, `coquillage`).
        Absent → all four enabled. Empty string → none enabled (empty-state view).

    ?inclure-composants=1
        Include `_components/*.md` in the list alongside `_recipes/*.md`. Absent or
        `0` → only top-level recipes. Any other value → treated as absent.

Behaviour:

- Every state change (mode toggle, quinzaine step, category checkbox, components
  toggle) writes back to the URL via `history.replaceState` — no navigation, no
  reload.
- The existing QR-code regeneration hook fires on every URL write so the on-page
  QR always encodes the current view.
- Absent params fall through to sensible defaults; malformed values are ignored
  (fall back to default). Never throw on bad input.
- Back-button restores the previous URL and re-renders from URL state — do not
  cache in-memory state that diverges from the URL.

## 6. Commands

- `bundle exec jekyll serve` — dev server (existing).
- `docker compose up` — containerised dev (existing).
- `uv run python scripts/generate_recipe_seasonality.py` — build the JSON blob.
  Also runs via pre-commit.
- No new test runner (site has no JS test suite today).

## 7. Project structure

    scripts/generate_recipe_seasonality.py     # new: build-time JSON generator
    assets/data/recipe-seasonality.json        # new: generated artefact, committed to git
    calendrier.html                            # modified: mount + inline styles for new mode
    assets/js/calendrier.js                    # modified: mode switch, list renderer,
                                               #   category toggles, components toggle,
                                               #   quinzaine picker, URL sync
    .pre-commit-config.yaml                    # modified: add hook for the new generator

    _data/seasonality.yml                      # unchanged
    _data/recipe_tags.yml                      # unchanged
    _recipes/*.md                              # unchanged

## 8. Code style

- **HTML/CSS in `calendrier.html`**: reuse the existing inline `<style>` conventions
  and colour tokens already present (`rgb(60 20 5)`, `rgb(245 50 0 / …)`, orange
  palette). No new CSS framework.
- **JS in `calendrier.js`**: IIFE + `"use strict"`, vanilla ES, D3 already imported.
  Reuse existing helpers:
  - Quinzaine parsing / `TOKEN_RE` / `MONTHS`.
  - `CATEGORY_ORDER` / `CATEGORY_LABELS` / `CATEGORY_COLORS`.
  - URL param helpers and QR-regeneration hook already in the file.
- **Python generator**: Python 3.12, uv PEP-723 script header, `pyyaml` + stdlib only.
- French user-facing text; canonical ASCII ids in URL params.
- No JSDoc; no TS.

## 9. Testing strategy

**Python generator**: manual smoke test — run it, spot-check a hand-picked recipe's
`temporal_ingredients` against `_data/seasonality.yml`. No unit tests unless requested.

**JS (manual browser)** on `/calendrier/?affichage=recettes-de-saison`:

- Desktop wide + mobile narrow.
- Quinzaine arrows and keyboard `←`/`→`; wrap-around at Dec-2 ↔ Jan-1.
- Each of the 16 category-toggle combinations at least loads without error; spot-check
  a few for correct re-scoring.
- `inclure-composants=1` adds components to the list with the "composant" badge;
  toggling off removes them without a reload.
- Recipe with 0 temporal ingredients lands in "Sans contrainte" pinned section.
- Recipe with mixed phases (some `peak`, some `start`/`end`): score reflects the
  1.0/0.5 weighting, breakdown shows the correct `P pleine, S début, E fin / N`.
- At least one recipe per star bucket (0★, 1★, 2★, 3★) appears in the current
  quinzaine at 2026-07-17.
- Mode toggle preserves other URL params; back button restores mode.
- Malformed URL params (`quinzaine=xxx`, `categories-saison=bogus`) fall back to
  defaults silently.
- QR code on page updates on every state change and encodes the currently-visible URL.

## 10. Boundaries

**Always:**
- Reuse canonical tag ids (`_data/recipe_tags.yml`); never introduce variant spellings.
- Keep ingredient mode fully backwards-compatible; all existing URL params and behaviour
  untouched.
- Regenerate `assets/data/recipe-seasonality.json` via pre-commit so it can't go stale;
  the file is committed to git and expected to appear in review diffs when recipes,
  tags, or seasonality data change.
- Reuse existing category constants (`CATEGORY_ORDER`, `CATEGORY_LABELS`,
  `CATEGORY_COLORS`) — do not duplicate.
- Weight phases as `peak = 1.0`, `start = 0.5`, `end = 0.5`.

**Ask first:**
- Any change to the JSON schema in §4 (new fields, renamed fields, phase weight
  changes).
- Any change to the URL parameter names in §5 once implementation has begun.
- Introducing a JS dependency.
- Changing where the mode toggle sits on the page or how it looks.

**Never:**
- Change recipe frontmatter (`tags`, `ingredients`, `image`).
- Add heavyweight JS dependencies; D3 + vanilla only.
- Add a server component; everything static.
- Auto-filter out recipes containing an excluded category — exclusion is scoring-scope
  only.
- Duplicate seasonality data or category constants (share with the ingredient calendar).
- Modify the existing ingredient-calendar rendering path.
- Gitignore `assets/data/recipe-seasonality.json` — it is a committed artefact.

---

**Next step:** confirm this spec (or edit inline). On confirmation, break into tasks:
generator → JSON blob → mode toggle in HTML + JS → list renderer → category toggles
→ URL sync → QR regeneration → manual test pass.
