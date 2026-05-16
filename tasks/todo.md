# TODO — Desktop "recipes per row" selector

See `tasks/plan.md` for context and `SPEC.md` for acceptance criteria.

## T1 — CSS rule for `[data-cols-grid]`
- [ ] Identify the right Tailwind source (`assets/css/tailwind.css` vs `_tailwind.css`)
- [ ] Append `@media (min-width:768px)` rule driving `grid-template-columns` from `var(--cols, 4)`
- [ ] Manually verify in DevTools on an existing grid

## T2 — Controller `assets/js/cols-selector.js`
- [ ] Create file with `initColsSelector({ mount, gridSelector, defaultCols, allowed })`
- [ ] Parse + validate `?cols=` (fallback 4 on miss/invalid)
- [ ] Render segmented control (hidden md:flex, primary palette, aria-pressed, aria-label)
- [ ] Apply `--cols` to all `gridSelector` matches
- [ ] On click: update grids, active state, `history.replaceState`
- [ ] Expose `setCols` and `refresh`

### Checkpoint CP-A — user verifies T1+T2 in isolation

## T3 — Wire homepage
- [ ] Add `<div id="cols-selector-mount">` in `index.html` toolbar row (~line 72)
- [ ] Load `cols-selector.js` before `home.js`
- [ ] In `home.js`, add `data-cols-grid` and drop `md:grid-cols-3` on both grid creations (lines 70, 93)
- [ ] Call `initColsSelector` after grids are built
- [ ] Verify desktop {2,3,4,5}, URL sync, reload, mobile fallback, no console errors

### Checkpoint CP-B — user verifies homepage behaviour

## T4 — Wire advanced search
- [ ] Add `<div id="cols-selector-mount">` in `recherche.html` "Résultats" header row (~line 827)
- [ ] Add `data-cols-grid` + drop `md:grid-cols-3` on `#results-grid` (line 835) and `#reco-grid` (line 843)
- [ ] Load `cols-selector.js` before `search-page.js`
- [ ] Call `initColsSelector` on `DOMContentLoaded`
- [ ] Verify both grids share the column count; D3 graph + filters unaffected

## T5 — Acceptance pass
- [ ] Walk every SPEC §8 criterion
- [ ] Keyboard a11y check on the segmented control
- [ ] Regression check: tag filters, search input, category sections, D3 graph
- [ ] Confirm control invisible <768px

### Checkpoint CP-C — present results, await commit approval
