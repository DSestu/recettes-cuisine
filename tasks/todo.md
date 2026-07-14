# TODO — Calendrier des ingrédients

Companion to `plan.md`. Check items off as they land. Do not skip checkpoints.

## Phase 0 — Data foundation

- [ ] **T1** Generate `_data/seasonality.yml` seed
  - [ ] Write `scripts/generate_seasonality_seed.py` (with embedded FR mapping)
  - [ ] Write `scripts/validate_seasonality.py`
  - [ ] Run seed generator, hand-review, flag ambiguities for user
  - [ ] Add validator to `.pre-commit-config.yaml`
  - [ ] **Checkpoint:** user reviews `_data/seasonality.yml`, approves before continuing
- [ ] **T2** Ingredient → recipes index
  - [ ] Write `scripts/generate_ingredient_index.py`
  - [ ] Emit `assets/data/ingredient_index.json` + `assets/data/seasonality.json`
  - [ ] Wire into pre-commit
  - [ ] Verify idempotency
  - [ ] **Checkpoint:** Phase 0 done — data layer complete

## Phase 1 — Page ships

- [ ] **T3** Page skeleton + nav wiring
  - [ ] Create `calendrier.html` (permalink `/calendrier/`)
  - [ ] Extend `data-page-kind` switch in `_layouts/default.html`
  - [ ] Ask user: floating button vs sidebar entry for nav
  - [ ] Create `assets/js/calendrier.js` (fetch data, log counts)
  - [ ] Include script in the page
  - [ ] **Checkpoint:** `/calendrier/` returns 200, console logs data counts

## Phase 2 — Gantt + interactions

- [ ] **T4** D3 Gantt render
  - [ ] Layout: 24 columns, rows by category
  - [ ] Bars with intensity → opacity, per-category color
  - [ ] Current-quinzaine highlight
  - [ ] Wrap handling (rotate axis so current is leftmost)
- [ ] **T5** Clic ingrédient → panneau recettes
  - [ ] Side panel markup + styles
  - [ ] Click handler → render recipe cards from index
  - [ ] Close controls (button, click-outside, Escape)
- [ ] **T6** Filtres
  - [ ] Multi-select catégories
  - [ ] Toggle "de saison maintenant"
  - [ ] Toggle vue mois courant / année
  - [ ] URL query-param state
  - [ ] **Checkpoint:** Phase 2 done — main UX validated by user

## Phase 3 — Bonus features

- [ ] **T7** Vue inverse "Que cuisiner en [mois]?"
  - [ ] Compute peak ingredients + 100%-in-season recipes
  - [ ] Two-panel render
  - [ ] Mode toggle at top of page
- [ ] **T8** Export .ics
  - [ ] Client-side .ics generation with yearly RRULE
  - [ ] Test import into a calendar app

## Phase 4 — Polish

- [ ] **T9** Responsive, a11y, cross-page checks
  - [ ] Mobile layout (375px) with sticky ingredient column
  - [ ] `aria-label` on bars, keyboard nav
  - [ ] Full `jekyll build` clean
  - [ ] Pre-commit green
  - [ ] Zero regression on `/recherche/` and `/`

## Post-MVP (not tracked here)

- Extend tag-management skill to prompt for seasonality when adding an ingredient
- "De saison" bonus score in advanced search
- Homepage "sort de saison bientôt" hints
