# PLAN — Calendrier des ingrédients (Gantt)

Reference: `SPEC.md` in repo root.

## Codebase observations (validated by reading)

- **Jekyll site**, D3 v7 already loaded on `recherche.html` (`assets/js/search-page.js` uses `d3.scale*`, `d3.forceSimulation`, `d3.zoom`, etc.).
- **Nav wiring**: `_layouts/default.html` sets `data-page-kind` per URL (line 2–6). A floating action button linking to `/recherche/` sits bottom-right (line 81–100). No permanent nav bar — links are contextual. Sidebar (`nav.js` `desktop-sidebar-wrap`) exists but its markup isn't in `default.html` (loaded elsewhere — investigate if we need a persistent link).
- **Per-page JS pattern**: IIFEs with `DOMContentLoaded` (see `nav.js`), scripts included via `<script>` tag at end of `default.html` or per-page.
- **Data files**: only `_data/recipe_tags.yml` (canonical id + `ingredient: true|false`) and `_data/nutrients.yml`. Recipes are `.md` files in `_recipes/` (104 recipes) with YAML `tags:` list using canonical ids.
- **Existing recipes.json**: only `{title, image}` — insufficient. We need a fatter index for ingredient→recipes clicks and card rendering.
- **Scripts stack**: Python via `uv` (`pyproject.toml`), pre-commit hooks call scripts under `scripts/`. Same pattern for new generators.
- **Styling**: Tailwind (`tailwind.config.js` + `scripts/build_tailwind.py`), `bg-orange-50 text-orange-950` theme.

## Dependency graph

```
T1 seasonality data ──┐
                      ├──► T4 Gantt render ──► T5 clic→recettes ──► T7 vue inverse ──► T8 export .ics
T2 ingredient index ──┤                    └► T6 filtres
                      │
T3 page + nav ────────┘  (T3 can start in parallel with T1/T2 — needs no data)
                                                                                    T9 polish
```

T1 and T2 are independent (both data). T3 (page skeleton + nav) has no data dep. T4 needs T1+T3. T5 needs T2+T4. T6 needs T4. T7 needs T1+T2+T4. T8 needs T1+T4. T9 spans everything.

## Vertical slicing principle

Each task ships **one working slice through the stack**, not a horizontal layer. Even T1 produces a validated YAML file + a validation script that runs at pre-commit. T3 ships a live page (even if content is `<div>calendrier</div>`) so we can `jekyll serve` and see progression.

---

## Phase 0 — Data foundation

### T1 — `_data/seasonality.yml` seed + validator

**What ships:** a populated `_data/seasonality.yml` file covering all seasonal ingredients from `_data/recipe_tags.yml`, plus `scripts/validate_seasonality.py` running in pre-commit.

**Steps:**
1. Write `scripts/generate_seasonality_seed.py`: reads `_data/recipe_tags.yml`, iterates over `ingredient: true` entries, applies an embedded FR seasonality mapping (fruits, légumes, viandes, poissons, coquillages, fromages, herbes, champignons — sourced from public FR "calendrier de saison" data, hardcoded as a Python dict in the script). Ingredients not in the mapping are skipped (year-round). Writes `_data/seasonality.yml` sorted by `category` then `id`.
2. Write `scripts/validate_seasonality.py`: loads `_data/seasonality.yml`, checks each entry: `id` exists in `recipe_tags.yml` with `ingredient: true`; `category` in fermé set; `season` string tokens match `^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)-[12]:(start|peak|end)$`; no duplicate quinzaines; each id appears once. Exit non-zero on error.
3. Run seed script, hand-review output for obvious misses (I'll flag anything ambiguous for user review before commit).
4. Add `validate_seasonality.py` to `.pre-commit-config.yaml`.

**Acceptance criteria:**
- `_data/seasonality.yml` exists with ≥ 30 entries (rough guess of seasonal ingredients present in registry).
- `uv run python scripts/validate_seasonality.py` exits 0.
- Every `id` in the file cross-references a valid `ingredient: true` tag.
- File is git-diff-friendly: one line per ingredient's `season:` field.

**Verification:**
- `uv run python scripts/validate_seasonality.py && echo OK`
- Grep count: `grep -c '^- id:' _data/seasonality.yml`
- Spot-check 5 ingredients against known FR calendars (fraise, asperges, huitre, gibier, potiron).

**Checkpoint:** user reviews the generated file, flags corrections, we commit T1 before starting T2.

---

### T2 — Ingredient → recipes index

**What ships:** a JSON file at `assets/data/ingredient_index.json` regenerated at pre-commit, plus `scripts/generate_ingredient_index.py`.

**Steps:**
1. Write `scripts/generate_ingredient_index.py`: walks `_recipes/*.md`, parses YAML frontmatter, for each recipe collects `tags` that are `ingredient: true` in the registry AND appear in `_data/seasonality.yml`. Emits:
   ```json
   {
     "ingredients": {
       "fraise": {"category": "fruit", "recipes": ["tarte_fraise", "..."]}
     },
     "recipes": {
       "tarte_fraise": {"title": "Tarte aux fraises", "image": "tarte_fraise", "ingredients": ["fraise", "creme", ...]}
     }
   }
   ```
   **Filter:** only include recipes that use ≥ 1 seasonal ingredient (confirmed by user). Year-round-only recipes are excluded from `recipes` map.
2. Add to pre-commit hooks.
3. Verify JSON is minified but stable-ordered (sort keys) for clean git diffs.

**Acceptance criteria:**
- `assets/data/ingredient_index.json` exists, valid JSON.
- Every ingredient key exists in `_data/seasonality.yml`.
- `recipes.*.ingredients` are subsets of `_data/seasonality.yml` ids.
- Regeneration is idempotent (running twice = same file).

**Verification:**
- `python -c "import json; d=json.load(open('assets/data/ingredient_index.json')); print(len(d['ingredients']), len(d['recipes']))"`
- Cross-check one recipe manually: open `_recipes/blanquette_de_veau.md`, verify its seasonal-only tags appear in `recipes.blanquette_de_veau.ingredients`.

**Checkpoint:** end of Phase 0 — data layer is complete and validated.

---

## Phase 1 — Page ships

### T3 — Page skeleton, nav wiring, module bootstrap

**What ships:** `/calendrier/` is a live URL rendering an empty page with a title. Nav shows a link.

**Steps:**
1. Create `calendrier.html` at repo root, mirroring `recherche.html` structure: frontmatter `layout: default`, `permalink: /calendrier/`, page kind meta.
2. Add case in `_layouts/default.html` line 2–6: `{% elsif page.url == "/calendrier/" %}{% assign rc_page_kind = "calendrier" %}`.
3. Add a **sidebar desktop entry, placed above the "repository" link**. Locate the sidebar markup (likely an include or a partial referenced by `desktop-sidebar-wrap` in `nav.js`) and insert the link with a calendar icon. Mobile nav: match whatever pattern exists there.
4. Create `assets/js/calendrier.js`, IIFE + `DOMContentLoaded`, currently just: fetch `assets/data/ingredient_index.json` and `_data/seasonality.yml` (or JSON'd equivalent), console.log counts.
5. Emit `_data/seasonality.yml` as JSON at build too (`assets/data/seasonality.json`) via a small Liquid include or a Python step in T2 — YAML parsing client-side is a pain; do it once at build.
6. Include `<script src="/assets/js/calendrier.js">` in the page.

**Acceptance criteria:**
- `bundle exec jekyll serve` → visiting `/calendrier/` returns 200 with a titled page.
- Browser console shows `[calendrier] ingredients=N recipes=M` with N,M > 0.
- Other pages render unchanged (recherche, home, a recipe page).

**Verification:**
- Manual: `jekyll serve` (delegate to subagent to keep noise out of my context), open browser, check console.
- Diff surface: only new files + minimal edits to `_layouts/default.html`.

**Checkpoint:** page ships even without any Gantt — proves plumbing works.

---

## Phase 2 — Gantt + interactions

### T4 — D3 Gantt render

**What ships:** static Gantt on `/calendrier/`, no interactivity yet.

**Steps:**
1. In `calendrier.js`, after data load, compute layout: 24 columns (quinzaines), rows grouped by category (alpha within group).
2. Build SVG with D3: axis header (month labels spanning 2 columns each), row labels (ingredient FR name — pulled from `id` or a display map), rectangles per quinzaine with intensity→opacity (`start`/`end` = 0.4, `peak` = 1.0) and per-category color.
3. Highlight current-quinzaine column with a subtle background band.
4. **Decision locked:** rotate the X-axis so the **current quinzaine is at the leftmost column**. Cross-year seasons (huîtres, gibier) render as one continuous band. Column headers show month labels in rotated order (e.g. "jul → jun" reading left to right).
5. Style with Tailwind + inline SVG attrs. Use same warm palette as the rest of the site (`orange-*`).

**Acceptance criteria:**
- All ingredients from `_data/seasonality.yml` visible as rows.
- Categories are labeled section headers, ingredients sorted alpha within.
- Current quinzaine visually highlighted.
- Barres réalistes : ex. fraise a des barres uniquement de may-1 à jul-2, avec opacité correcte.
- No console errors.

**Verification:**
- Visual check: open `/calendrier/`, cross-check 3 ingredients (short season, long season, wrapping season).
- Responsive check: resize window to 375px width, ensure it degrades gracefully (columns narrower, labels still readable).

---

### T5 — Clic ingrédient → panneau recettes

**What ships:** clicking a bar or ingredient name opens a side panel listing recipes using that ingredient.

**Steps:**
1. Add a side panel `<aside id="calendrier-recipe-panel">`, hidden by default, styled with Tailwind (fixed right side desktop, bottom sheet mobile).
2. Click handler on ingredient row / bar: look up in `ingredient_index.json`, render recipe cards. Reuse the card component visually — extract card HTML from wherever it's built (likely inside a Jekyll include or `search-page.js` render function). If reuse is heavy, inline a minimal card template.
3. Close button + click-outside-to-dismiss.
4. Escape key closes.

**Acceptance criteria:**
- Clicking "fraise" row shows all recipes using fraise, with title + thumbnail linking to the recipe.
- Panel closes cleanly, no scroll lock issues.
- Works on mobile as a bottom sheet.

**Verification:**
- Click 3 different ingredients, verify recipe count matches manual grep (`grep -l 'fraise' _recipes/*.md | wc -l`).

---

### T6 — Filtres

**What ships:** filter bar above the Gantt.

**Steps:**
1. Multi-select catégories (chips): clicking toggles category visibility.
2. Toggle "Seulement de saison maintenant" (hides ingredients with empty current quinzaine).
3. Toggle "Vue mois courant / année entière" — the "current month" mode narrows X-axis to a 3-month window centered on now.
4. State: URL query params (`?cat=fruit,legume&now=1`) so filters are shareable and survive refresh.

**Acceptance criteria:**
- Each filter affects rendered rows/columns.
- URL updates on filter change; loading with query params restores state.

**Verification:**
- Set filters, copy URL, paste in new tab → same view.

**Checkpoint:** end of Phase 2 — main UX complete.

---

## Phase 3 — Bonus features

### T7 — Vue inverse "Que cuisiner en [mois]?"

**What ships:** a toggle at page top switching between Gantt and a reverse view.

**Steps:**
1. Compute for current quinzaine: list of ingredients where intensity is `peak` (and `start`/`end` shown separately).
2. List of recipes where every ingredient in `recipes.<slug>.ingredients` is currently in-season.
3. Render as two panels: "Au pic ce mois-ci" (ingredient chips) + "Recettes 100% de saison" (recipe cards).
4. Toggle via segmented control at top of page.

**Acceptance criteria:**
- Switching modes doesn't reload the page.
- Recipe list is non-empty for a typical month (validate with July or October).
- Chips link back to the Gantt view scrolled to the ingredient.

---

### T8 — Export .ics

**What ships:** a small "Ajouter au calendrier" action per ingredient (in the recipe panel from T5).

**Steps:**
1. On click, generate an `.ics` blob client-side with a yearly `RRULE` covering the season window. Trigger download.
2. UID stable per ingredient. Description mentions the site.

**Acceptance criteria:**
- Downloaded `.ics` imports cleanly into a calendar app (test with Google Calendar or macOS Calendar).
- Recurring event, one per year, correct month range.

---

## Phase 4 — Polish

### T9 — Responsive, a11y, cross-page checks

**Steps:**
1. Mobile: verify Gantt is usable at 375px (horizontal scroll if needed, sticky first column with ingredient names).
2. A11y: `aria-label` on bars ("Fraise, de saison de mi-mai à mi-juillet, actuellement au pic"), keyboard nav (Tab through rows, Enter to open panel).
3. Ensure `/calendrier/` build is included in `_config.yml` if a specific `include:` list exists (check).
4. Test that `bundle exec jekyll build` succeeds with no warnings.
5. Run full pre-commit suite.

**Acceptance criteria:**
- Lighthouse a11y score ≥ 90 on `/calendrier/`.
- No layout breakage on 375px, 768px, 1440px.

---

## Global boundaries

- **Never commit without explicit user consent.** Stage changes and show diff at each checkpoint.
- **Never touch `_data/recipe_tags.yml` schema** — read-only in this feature.
- **Never touch existing recipe `.md` files.**
- **Ask before** modifying navigation UI (`default.html` beyond the `data-page-kind` line) or adding JS dependencies beyond D3.
- **Always** run `validate_seasonality.py` after any edit to `_data/seasonality.yml`.
- **Always** delegate `jekyll serve` and heavy build commands to a temporary subagent (per user memory `feedback_noisy_commands.md`).

## Global verification (end of feature)

- `bundle exec jekyll build` succeeds.
- All pre-commit hooks green.
- Manual browse: home → click calendar button → filter fruits → click fraise → open a recipe → back to /calendrier/.
- Zero regression on `/recherche/` (open it and verify search still works).
