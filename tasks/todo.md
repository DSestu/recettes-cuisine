# Todo — "Recettes de saison" mode

Feature spec: `SPEC.md`. Detailed plan: `tasks/plan.md`.
Prior todo (En ce moment header) is shipped; this file supersedes it.

## Phase A — Data foundation

- [ ] **T1** — JSON generator + pre-commit wiring
  - [ ] Write `scripts/generate_recipe_seasonality.py` (uv PEP-723, pyyaml + stdlib)
  - [ ] Emit `assets/data/recipe-seasonality.json` matching SPEC §4
  - [ ] Include both `_recipes/*.md` (kind=recipe) and `_components/*.md` (kind=component)
  - [ ] Verify Jekyll permalink for `_components` before locking URL format
  - [ ] Deterministic sort (slug, ingredient id, phase-key numeric)
  - [ ] Add `generate-recipe-seasonality` hook to `.pre-commit-config.yaml`
  - [ ] Commit generated JSON

## Phase B — Mode shell

- [ ] **T2** — Mode toggle + placeholder
  - [ ] `#calendrier-recipes` mount + `#calendrier-mode-toggle` markup in `calendrier.html`
  - [ ] Inline CSS for toggle (site palette)
  - [ ] `AFFICHAGE_URL_PARAM`, `initialAffichage()`, `writeAffichageToUrl()`, `state.affichage`
  - [ ] `renderMode()` swaps `hidden` on the three sections
  - [ ] Toggle click handlers
  - [ ] Bogus `affichage=xyz` falls back to ingredient mode
  - [ ] Back button restores prior mode
  - [ ] QR updates on toggle
- [ ] **⏸ Checkpoint 1** — Human review of mode-toggle UX + URL contract

## Phase C — List rendering

- [ ] **T3** — Recipe list MVP
  - [ ] `data-url-recipe-seasonality` on `#calendrier-root`
  - [ ] Fetch JSON in init path
  - [ ] Pure `scoreRecipe(recipe, fortnightIdx, activeCategories)`
  - [ ] `currentFortnightIdx()` helper
  - [ ] `renderRecipesList()` with sort + "Sans contrainte" pinned section
  - [ ] Row template: title | tabular score | breakdown | out-of-season inline
  - [ ] Row link → recipe URL
  - [ ] Mobile: no horizontal scroll
  - [ ] Hand-verify one `P/S/E/N` breakdown

## Phase D — Signature strip

- [ ] **T4** — Seasonality strip
  - [ ] `buildAggregateStrip(recipe, activeCategories)` → 24 values
  - [ ] `renderStrip(container, values, currentIdx)` with phase colors
  - [ ] Marker above current quinzaine
  - [ ] Tap → unfold per-ingredient sub-strips (single-open)
  - [ ] Inline CSS for cells, marker, unfold animation
  - [ ] `prefers-reduced-motion: reduce` → instant
  - [ ] Keyboard focus ring
- [ ] **⏸ Checkpoint 2** — Human review of the visual signature

## Phase E — Interactive controls

- [ ] **T5** — Quinzaine picker
  - [ ] `QUINZAINE_URL_PARAM` + init/write helpers, `parseQuinzaine`, `formatQuinzaine`
  - [ ] `state.quinzaineIdx`
  - [ ] Eyebrow: long-form label + `mmm-N` + `‹` / `›`
  - [ ] Keyboard `←`/`→` scoped to recipes section focus
  - [ ] Wrap-around Dec-2 ↔ Jan-1
  - [ ] Malformed URL → current quinzaine, no error
  - [ ] QR updates on each step

- [ ] **T6** — Category-scope toggles
  - [ ] `CATS_SAISON_URL_PARAM` + init/write helpers
  - [ ] `state.activeSeasonCategories` Set (default: all four temporal cats)
  - [ ] Plural↔singular URL mapping
  - [ ] Pill row in recipes header; toggle → re-score → re-render
  - [ ] Empty-state branch (all four off)
  - [ ] URL canonical order (`legumes,fruits,champignons,coquillages`)
  - [ ] QR updates

- [ ] **T7** — Components toggle
  - [ ] `COMPOSANTS_URL_PARAM` + init/write helpers
  - [ ] `state.includeComponents`
  - [ ] Filter in `renderRecipesList`
  - [ ] "composant" badge on component rows
  - [ ] `?inclure-composants=0` and absent both behave as off
  - [ ] QR updates
- [ ] **⏸ Checkpoint 3** — Human review of full functional page before polish

## Phase F — Polish

- [ ] **T8** — Polish + verification
  - [ ] Motion tuning (row hover, strip cross-fade on toggle, reduced-motion paths)
  - [ ] Focus rings + tab order across all controls
  - [ ] Empty-state copy review (French, active voice)
  - [ ] QR wiring end-to-end verified
  - [ ] Malformed-URL fallback verified for all four new params
  - [ ] SPEC §9 checklist run at 2026-07-17:
    - [ ] Desktop wide + mobile narrow
    - [ ] Quinzaine arrows + keyboard + wrap
    - [ ] All 16 category-toggle combos load
    - [ ] Components toggle adds/removes without reload
    - [ ] Zero-temporal recipe pinned
    - [ ] Mixed-phase recipe score matches 1.0/0.5 weighting
    - [ ] ≥1 recipe per star bucket (0★, 1★, 2★, 3★) at current quinzaine
    - [ ] Mode toggle preserves other URL params; back restores mode
    - [ ] Malformed params (`quinzaine=xxx`, `categories-saison=bogus`) silent fallback
    - [ ] QR encodes currently-visible URL
  - [ ] Record verification checklist in commit message
