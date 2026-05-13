# Todo — Page Transitions Redesign

Plan: `tasks/transitions-v2-plan.md`. Spec: `SPEC.md`.

## S1 — Handshake infrastructure
- [ ] Add `data-page-kind` to `<html>` via Liquid in `_includes/head.html` (or `_layouts/default.html`).
- [ ] Add inline `<script>` at top of `<head>` that reads `sessionStorage.fromKind`, sets `<html data-from-kind>`, clears storage.
- [ ] In `assets/js/transitions.js`, replace docs; add `pageswap`/`pagehide` listener writing `sessionStorage.fromKind` from current `<html data-page-kind>`.
- [ ] Manual: verify attributes on each page kind after every route transition.
- [ ] Commit: "feat(transitions): page-kind handshake via sessionStorage".

## S2 — Region naming
- [ ] In `_layouts/recipe.html`: rename hero's `vt-<slug>` to `vt-hero`; add `view-transition-name: vt-content` on `article.post-content`.
- [ ] In `_layouts/default.html` or `index.html`: wrap home content with an element carrying `style="view-transition-name: vt-home"` (Liquid-conditional on home page).
- [ ] Remove `window.recipeViewTransitionName` helper and hover-preload's dependency on canvas slug from `transitions.js` (keep preload, drop name helper).
- [ ] In `assets/js/home.js`: remove the vtName stamping block on the card canvas.
- [ ] In `assets/js/search-page.js`: remove the two vtName stamping blocks.
- [ ] Manual: navigate home → recipe; old morph no longer plays; no console warnings.
- [ ] Commit: "refactor(transitions): switch to region-based vt names".

## S3 — Home ↔ Recipe curtains
- [ ] In `assets/css/transitions.css`, add keyframes + selectors for `[data-page-kind="recipe"][data-from-kind="home"]` (closing) and inverse (opening).
- [ ] Verify: home → recipe → back. Curve and duration match SPEC.
- [ ] Commit: "feat(transitions): home↔recipe closing/opening curtains".

## S4 — Recipe ↔ Recipe scanner
- [ ] Add scanner mask animation for `vt-hero` and content crossfade for `vt-content` under `[data-from-kind="recipe"][data-page-kind="recipe"]`.
- [ ] Verify scanner visually moves top→bottom; right column crossfades simultaneously.
- [ ] If `mask-image` does not animate on `::view-transition-*`, fall back to a stacked-element solution or document the limitation.
- [ ] Commit: "feat(transitions): recipe↔recipe scanner crossfade".

## S5 — Home ↔ Search single curtain
- [ ] Add CSS for `[data-page-kind="search"][data-from-kind="home"]` (home slides left out) and inverse (home slides in from left).
- [ ] Verify Home ↔ Search toggle.
- [ ] Commit: "feat(transitions): home↔search single curtain".

## S6 — Search ↔ Recipe
- [ ] Extend S3's selectors with `[data-from-kind="search"]` (CSS-only change).
- [ ] Verify search → recipe → back.
- [ ] Commit: "feat(transitions): search↔recipe curtains (alias of home↔recipe)".

## S7 — Reduced motion + direct-load fallback
- [ ] Add `@media (prefers-reduced-motion: reduce)` override forcing 1ms on named groups (extend existing rule).
- [ ] Add direct-load fallback: when `data-from-kind` is absent, suppress named-group animations and run root fade only.
- [ ] Verify: DevTools reduced-motion toggle; hard-reload directly into a recipe URL.
- [ ] Commit: "feat(transitions): reduced-motion and direct-load fallback".

## Checkpoint gates
- CP-α (after S1+S2): user confirms attributes set, old morph gone.
- CP-β (after S3): user validates feel of marquee transition.
- CP-γ (after S4): user validates scanner.
- CP-δ (after S5+S6): user validates remaining pairs.
- CP-ε (after S7): final review.
