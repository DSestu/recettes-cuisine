# Implementation Plan: Seasonal menu generator

Source spec: `SPEC-menu-generator.md` (approved 2026-11-26).
Approved mockups: `tasks/menu-mockups.html` (Surprise / Repas / Semaine,
1180 px and 390 px). Task list: `tasks/todo-menu-generator.md`.

`tasks/plan.md` / `tasks/todo.md` belong to the shipped "Recettes de saison" feature and
still hold unchecked boxes, so this plan lives in separate files rather than overwriting them.

## Overview

Add a third `/calendrier/` mode, `?affichage=menu`, that proposes in-season recipes as
photo cards in three layouts (Surprise 4, Repas 3 courses, Semaine 7 days + shopping
list), each slot rerollable and lockable, all state in the URL.

## Architecture decisions

- **Pure picker, injected scores.** `assets/js/menu-picker.js` holds eligibility,
  weighted pick, variety, no-repeat and lock logic with no DOM and no scoring of its own.
  `calendrier.js` calls the existing `scoreRecipe()` and hands the picker plain
  candidates `{ slug, score, nTemporal, courses, lead }`. This keeps `scoreRecipe` the
  single scoring source (spec §7) and makes the picker testable in Node.
- **Same module pattern as `servings-scaler.js`**: browser global plus
  `module.exports` guard, tested with `node tests/test_menu_picker.js` and `assert`.
- **Seeded RNG** (small mulberry32) passed into the picker, so tests are deterministic.
  The browser seeds from `Math.random()`; the URL stores picked slugs, not the seed.
- **UI lives in `calendrier.js`** (spec §5) as a new section `#calendrier-menu`, next to
  `#calendrier-recipes`. `renderMode()` and `setupModeToggle()` gain the third mode;
  the quinzaine picker is reused.
- **Data**: generator adds `courses`, `servings`, `ingredients` per recipe and strips
  slugs (one slug currently starts with a space, which would break `?menu=`).
- **Styles** go in the existing inline `<style>` of `calendrier.html`, ported from the
  mockup (container queries for the 390 px layouts).

## Dependency graph

    generator fields (T1) ──┐
                            ├─► Menu shell + Surprise (T3) ─► actions + URL (T4) ─► Repas (T5)
    picker + tests (T2) ────┘                                                    └─► Semaine (T6)
                                                                                        │
                                                                         polish + review (T7)

## Task list

### Phase 1: Foundation
- [x] T1: Generator adds `courses`, `servings`, `ingredients`; slugs stripped
- [x] T2: `menu-picker.js` with Node tests

### Checkpoint A
- [x] `node tests/test_menu_picker.js` passes; other `tests/*.js` and `uv run pytest` still pass
- [x] JSON regenerated, diff reviewed

### Phase 2: Surprise end to end
- [x] T3: Menu mode shell and Surprise cards (read-only)
- [x] T4: Relancer, Garder, Nouveau menu, quinzaine change, URL state

### Checkpoint B (review with you)
- [x] Surprise works in the browser at 1280 and 390 px; reload restores the menu
- [x] Ingrédients and Recettes de saison modes unchanged

### Phase 3: Other modes
- [x] T5: Repas (course slots, sparse-pool note)
- [x] T6: Semaine (7 days, shopping list, Copier)

### Phase 4: Finish
- [x] T7: States, accessibility, Impeccable review, spec close-out

### Checkpoint C
- [ ] All 8 success criteria of the spec met
- [ ] Ready for your review and commit

## Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| `calendrier.js` is already ~2,200 lines | Med | Keep all pick logic in `menu-picker.js`; menu UI in one contiguous block with its own render function |
| Thin pools (2 desserts at nov-2; some fortnights may have < 7 plats) | Med | Spec §3.4 fallback chain (≥0.4 → >0 → whole pool) unit-tested in T2; sweep all 24 fortnights in T2 |
| Local Jekyll build may not run on this machine | Med | Check `bundle exec jekyll build` at T3 start; fall back to `docker compose up` |
| URL length with 7 slugs | Low | Slugs average ~25 chars → ~200 chars; fine for QR and `replaceState` |
| Reusing the quinzaine picker across two modes | Low | Shared `state.quinzaineIdx`; menu re-render subscribes to the same change path |

## Open questions

None blocking. The spec's defaults apply: 4 Surprise cards, 7 days, soupe/salade count
as entrée, repas counts as plat, shopping list grouped per recipe without merging.
