# Plan — "Recettes de saison" mode on `/calendrier/`

Feature spec: `SPEC.md`. Design direction: see prior conversation turn (seasonality
strip signature, almanac typography, warm palette reused, tabular numerals, no stars).

Prior `tasks/plan.md` (En ce moment header) is shipped; this file supersedes it.

## Dependency graph

```
                       ┌───────────────────────────────┐
                       │  _data/seasonality.yml        │
                       │  _data/recipe_tags.yml        │
                       │  _recipes/*.md                │
                       │  _components/*.md             │
                       └──────────────┬────────────────┘
                                      │
                                      ▼
                       ┌───────────────────────────────┐
              T1       │ scripts/generate_recipe_      │
              (data)   │   seasonality.py              │
                       │      +                        │
                       │ .pre-commit-config.yaml hook  │
                       └──────────────┬────────────────┘
                                      │ writes
                                      ▼
                       ┌───────────────────────────────┐
                       │ assets/data/                  │
                       │   recipe-seasonality.json     │
                       └──────────────┬────────────────┘
                                      │ fetched by
                                      ▼
   ┌───────────────────┐    ┌───────────────────────────────┐
   │ calendrier.html   │    │ assets/js/calendrier.js       │
   │  · mode toggle    │◀──▶│  · URL param helpers          │
   │  · list mount     │    │  · state extension            │
   │  · CSS tokens     │    │  · scoring engine (pure fn)   │
   └───────────────────┘    │  · list renderer              │
                            │  · signature strip renderer   │
                            │  · quinzaine picker           │
                            │  · category-scope toggles     │
                            │  · components toggle          │
                            └───────────────────────────────┘

                             T2 → T3 → T4 → T5 → T6 → T7 → T8
```

**Hard dependency edges:**

- T1 (JSON generator) must ship first — nothing else can render without the data.
- T2 (mode shell) gates T3–T7; the URL param and mount points need to exist before
  we can render into them.
- T3 (list MVP with default state) must land before T5/T6/T7 (interactive controls
  operate on the rendered list).
- T4 (strip) is visually the signature but functionally independent of T5/T6/T7 — it
  reads the same scoring engine. Ordered here so the strip is reviewable before we
  invest in interactive controls.
- T8 (polish + verification) runs last.

## Vertical slicing

Each task delivers one shippable slice: the page keeps working end-to-end (ingredient
mode always intact), and after each task the new mode gets one more capability the
user can see. No task ships dead code that a later task activates.

Every task:
- Touches the minimum set of files needed for its slice.
- Preserves the existing ingredient calendar path (no regressions in `?vue=fit|wide`,
  `?ing=`, `?apercu=0`, `?explore=1`, `?cats=`).
- Uses existing constants (`MONTHS`, `CATEGORY_ORDER`, `CATEGORY_LABELS`,
  `CATEGORY_COLORS`, `TOKEN_RE`) — no duplication.
- Ships with acceptance checks the reviewer can run in a browser at
  `http://localhost:4000/calendrier/`.

---

## Task list

### T1 — JSON generator + pre-commit wiring

**Goal.** A committed `assets/data/recipe-seasonality.json` matching SPEC §4 exactly,
regenerated automatically on relevant file changes.

**Deliverables.**
- `scripts/generate_recipe_seasonality.py` (new). Uv PEP-723 header, `pyyaml` +
  stdlib only. Mirrors `scripts/generate_ingredient_index.py` — same frontmatter
  regex, deterministic sort, same OUT_DIR.
- `assets/data/recipe-seasonality.json` (new, committed).
- `.pre-commit-config.yaml` (modified): new hook `generate-recipe-seasonality`,
  `files:` covers
  `^(_recipes/.*\.md|_components/.*\.md|_data/(seasonality|recipe_tags)\.yml|scripts/generate_recipe_seasonality\.py)$`.

**Implementation notes.**
- Parse `season` via `TOKEN_RE` — mirror `validate_seasonality.py`.
- Emit `phases` as `dict[str, str]` keyed by fortnight index `"0".."23"`.
- Emit `_recipes/*.md` (`kind: "recipe"`) and `_components/*.md`
  (`kind: "component"`).
- URL derivation: recipes → `/{slug}/`; components → `/composants/{slug}/`
  (verify against the Jekyll permalink convention for `_components` before
  committing; if different, adjust here rather than in JS).
- Sort recipes by `slug` asc; sort `temporal_ingredients` by `id` asc; sort
  `phases` map by numeric key. Deterministic diffs.

**Acceptance criteria.**
- `uv run python scripts/generate_recipe_seasonality.py` exits 0.
- JSON validates against SPEC §4 schema. Spot-check three hand-picked recipes
  (e.g. `ratatouille`, one winter recipe, one component).
- Pre-commit picks up changes to `_recipes/*.md` and re-runs the generator.
- Other existing generators unaffected.

**Verification.**
```
uv run python scripts/generate_recipe_seasonality.py
python -c "import json; d=json.load(open('assets/data/recipe-seasonality.json')); \
           print(len(d['recipes']), d['recipes'][0])"
pre-commit run generate-recipe-seasonality --all-files
```

---

### T2 — Mode shell (HTML mount + URL param + toggle)

**Goal.** `?affichage=recettes-de-saison` swaps the ingredient calendar for an empty
placeholder panel; a visible toggle at the top of the page switches modes. No list
yet. Ingredient mode fully intact.

**Deliverables.**
- `calendrier.html` (modified):
  - New mount `<section id="calendrier-recipes" hidden>…</section>` above
    `#calendrier-controls-mount`.
  - Segmented toggle `<div id="calendrier-mode-toggle">` with two buttons.
  - Inline styles matching the site's warm palette.
- `assets/js/calendrier.js` (modified):
  - `AFFICHAGE_URL_PARAM = "affichage"`, `MODE_INGREDIENTS`, `MODE_RECETTES`.
  - `initialAffichage()` / `writeAffichageToUrl()` mirroring
    `initialLayoutMode()` / `writeLayoutModeToUrl()`.
  - `state.affichage` field.
  - `renderMode()` swaps `hidden` on `#calendrier-root` / `#calendrier-now` /
    `#calendrier-recipes`.
  - Toggle click handlers.

**Acceptance criteria.**
- `/calendrier/` renders exactly as today.
- `/calendrier/?affichage=recettes-de-saison` hides the ingredient Gantt and the
  "Cette quinzaine" section; shows an empty placeholder panel.
- Toggle click updates URL via `replaceState`; no reload.
- Back button restores prior mode.
- QR code updates on toggle.
- `affichage=xyz` (bogus) falls back to `MODE_INGREDIENTS`.

**Verification.** Load both URLs, click toggle, hit back, confirm no console
errors and QR updates.

**⏸ Checkpoint.** Human review of mode-toggle UX, styling, and URL contract before
investing in T3+.

---

### T3 — Recipe list MVP (default quinzaine, no controls)

**Goal.** In `affichage=recettes-de-saison`, render a sorted list of recipes for the
*current* quinzaine (from `new Date()`), with numeric score, phase breakdown,
out-of-season inline list, and the "Sans contrainte de saison" pinned section. All
four temporal categories active. No components, no picker, no toggles.

**Deliverables.**
- `assets/js/calendrier.js` (modified):
  - Extend init to fetch `recipe-seasonality.json` alongside the existing indices
    (`data-url-recipe-seasonality` on `#calendrier-root`).
  - Pure `scoreRecipe(recipe, fortnightIdx, activeCategories)` →
    `{ score, weightedIn, peakCount, startCount, endCount, total, outOfSeason }`
    or `null`.
  - `currentFortnightIdx()` — `(month - 1) * 2 + (day <= 15 ? 0 : 1)`.
  - `renderRecipesList(recipesData, state)` — sorts (`score desc, title asc`),
    groups into ranked + "Sans contrainte" pinned, renders rows.
- `calendrier.html` (modified):
  - `data-url-recipe-seasonality="{{ '/assets/data/recipe-seasonality.json' | relative_url }}"`
    on `#calendrier-root`.
  - Row template CSS: title | tabular score | breakdown | out-of-season inline;
    muted "Sans contrainte" section below.

**Acceptance criteria.**
- List shows all `kind: "recipe"` entries, sorted `score desc, title asc`.
- Recipes with `score === null` land in "Sans contrainte de saison".
- Score displayed to two decimals; breakdown `P pleine, S début, E fin / N`.
- Out-of-season list shows only temporal ingredients with weight 0 that quinzaine.
- Row is a link to the recipe URL.
- No horizontal scroll on mobile; no console errors.
- Ingredient mode still untouched.

**Verification.** On 2026-07-17: `ratatouille` scores high; a winter recipe scores
low; one recipe's `P/S/E/N` matches `_data/seasonality.yml` by hand.

---

### T4 — Signature: seasonality strip

**Goal.** Under each recipe title, a 24-cell horizontal strip showing the recipe's
aggregate phase weight per quinzaine, with a marker on the current quinzaine. Tap
expands per-ingredient strips.

**Deliverables.**
- `assets/js/calendrier.js` (modified):
  - `buildAggregateStrip(recipe, activeCategories)` → `Float32Array(24)`.
  - `renderStrip(container, values, currentIdx, opts)` — inline SVG or divs;
    fills use phase colors (`#2F8F3F` peak, `#F6C667` start, `#C8794D` end,
    `#EADDD0` parchment).
  - Row tap unfolds a per-ingredient sub-strip block; second tap collapses; only
    one row expanded at a time.
- `calendrier.html` (modified): inline CSS for cells, marker tick, unfold
  animation (`prefers-reduced-motion: reduce` → instant).

**Acceptance criteria.**
- Strip renders under every ranked row (not "Sans contrainte" entries).
- Marker sits above the current-quinzaine cell.
- 3★-equivalent recipe has a mostly-green strip.
- Tap unfolds/collapses per-ingredient strips (each labelled).
- Reduced-motion → instant.
- Keyboard focus ring visible when strip is the target.

**Verification.** Visual pass desktop + mobile; motion preference toggled via
DevTools emulation.

**⏸ Checkpoint.** Human review of the visual signature. The strip is the design
risk; sign-off gates T5–T8.

---

### T5 — Quinzaine picker

**Goal.** `‹` / `›` buttons and keyboard `←` / `→` step through 24 quinzaines with
wrap-around (Dec-2 ↔ Jan-1). URL sync via `?quinzaine=jul-2`.

**Deliverables.**
- `assets/js/calendrier.js` (modified):
  - `QUINZAINE_URL_PARAM = "quinzaine"`, `initialQuinzaine()`,
    `writeQuinzaineToUrl()`, `parseQuinzaine(str)`, `formatQuinzaine(idx)`.
  - `state.quinzaineIdx`.
  - Picker element in the eyebrow area: long-form label
    (`Première/Deuxième quinzaine de <mois>`) + `mmm-N` short code + `‹` / `›`.
  - Keyboard listener active only when `state.affichage === MODE_RECETTES`.

**Acceptance criteria.**
- `?quinzaine=dec-2` loads the Dec-2 view.
- `›` on Dec-2 wraps to Jan-1; URL updates.
- Keyboard `←`/`→` stepping when recipes section is focused; ignored elsewhere.
- Long-form label correct for each quinzaine.
- Malformed `?quinzaine=bogus` → current quinzaine, no error.
- QR updates on every change.

**Verification.** Step all 24; wrap both directions; refresh from a shared URL.

---

### T6 — Category-scope toggles

**Goal.** Four pill toggles for `{legumes, fruits, champignons, coquillages}` narrow
the scoring scope. URL sync via `?categories-saison=…`. Empty state when all off.

**Deliverables.**
- `assets/js/calendrier.js` (modified):
  - `CATS_SAISON_URL_PARAM = "categories-saison"`, `initialCategoriesSaison()`,
    `writeCategoriesSaisonToUrl()`.
  - `state.activeSeasonCategories: Set<string>` (default = all four temporal cats).
  - Plural-to-singular URL mapping (`legumes → legume`, etc.).
  - Pill row in recipes section header; toggle → state → URL → re-render.
  - Empty-state branch in `renderRecipesList` when set is empty.

**Acceptance criteria.**
- Default: all four active; URL param absent.
- Turning off `legumes` re-scores instantly; a legume-only recipe drops into "Sans
  contrainte".
- URL becomes `?categories-saison=fruits,champignons,coquillages` (canonical order).
- Empty string → empty-state message; "Sans contrainte" still visible.
- Malformed values ignored silently.
- QR updates on every toggle.

**Verification.** Toggle combinations; verify one recipe's score changes as
expected.

---

### T7 — Components toggle

**Goal.** `Inclure les composants` checkbox (off by default) adds `kind: "component"`
entries to the list with a small "composant" badge. URL sync via
`?inclure-composants=1`.

**Deliverables.**
- `assets/js/calendrier.js` (modified):
  - `COMPOSANTS_URL_PARAM = "inclure-composants"`, initial + write helpers.
  - `state.includeComponents` boolean.
  - `renderRecipesList` filters `kind` based on the flag.
  - Component-row badge markup (small pill, muted color).

**Acceptance criteria.**
- Default: components hidden.
- Toggling on adds them with a "composant" badge, sorted correctly.
- URL becomes `?inclure-composants=1`; `?inclure-composants=0` and absent both
  behave as off.
- QR updates.

**Verification.** Toggle on/off; confirm a component (e.g.
`sauce_aromatique_karaage`) appears with badge and disappears cleanly.

---

### T8 — Polish + verification pass

**Goal.** Meet SPEC §9 acceptance criteria; motion respects
`prefers-reduced-motion`; mobile and desktop both good.

**Deliverables.**
- Motion tuning per design plan (row hover, strip cross-fade on category toggle,
  reduced-motion instant paths).
- Focus rings + tab order (mode toggle → picker → category pills → components
  toggle → list rows).
- Empty-state polish + copy review.
- QR wiring end-to-end verification.
- Malformed-URL fallback verification across all four new params.

**Acceptance criteria.** Full SPEC §9 checklist passes (desktop + mobile,
picker/wrap, all 16 category combos, components toggle, zero-temporal recipe pinned,
mixed-phase weighting, one recipe per star bucket at 2026-07-17, back button, bogus
URL fallback, QR).

**Verification.** Manual pass documented in the commit message.

---

## Checkpoints (human review gates)

- **After T2** — mode-toggle UX and URL contract.
- **After T4** — visual signature (the strip). Design risk; needs sign-off.
- **After T7** — full functional behaviour before polish.

## Out of scope

- Any change to the ingredient calendar rendering path.
- New JS dependencies.
- Server-side computation.
- Recipe frontmatter changes.
- Auto-filtering recipes by excluded category (SPEC §10 forbids).
- Percentage display of scores (design plan mandates tabular decimals).
- Star ratings in the final UI (design plan supersedes the star language in SPEC §3).
