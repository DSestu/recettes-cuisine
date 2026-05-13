# TODO — Fluid page transitions

Linked plan: `tasks/page-transitions-plan.md` · Spec: `SPEC.md`

Status legend: [ ] pending · [~] in progress · [x] done · [!] blocked · [s] skipped

## Pivot recorded in commit 470b36f

Skipped Swup. Native cross-document View Transitions (`@view-transition`
was already enabled in head.html) cover the whole goal on Chromium/Safari
with no navigation interception, no script re-init, no service-worker
risk. Firefox still gets plain navigation; Swup remains a future option
if Firefox parity becomes a requirement.

## Phase 1 — Plumbing

- [s] **A**  Vendor Swup v4 — skipped, native API used instead
- [s] **A**  Swup init / container wrap / link selectors — N/A
- [s] **A.1**  `page:ready` re-init contract — N/A (real page loads, scripts auto-init)
- [x] **A**  Serviceworker cache name — already auto-bumps from `site.time`

## Phase 2 — Animations

- [x] **B**  `assets/css/transitions.css` with default fade+slide for `root`
- [x] **B**  Wire from head.html via `<link rel="stylesheet">`
- [s] **B**  JS Web-Animations fallback for Firefox — deferred (clean cross-doc fallback is plain navigation; revisit if Firefox parity is required)
- [x] **C**  `view-transition-name: vt-<slug>` on card thumb in `home.js`
- [x] **C**  Matching name on hero `<canvas class="view">` in `_layouts/recipe.html` (first image only)
- [x] **C**  Clear non-target names at click time in `transitions.js`
- [x] **C**  Springier curve on named groups in CSS
- [ ] **C**  Visual check on mobile (recipe hero is `position: fixed` on < 768px)
- [x] **D**  `prefers-reduced-motion` CSS guard
- [s] **D**  Focus management — handled natively (real cross-document loads)
- [ ] **D**  Keyboard-only smoke (Tab/Enter on a card)

## Phase 3 — Search page

- [x] **E**  Card morph in both `search-page.js` render paths (ranked + all)
- [s] **E**  Back-nav state preservation — native back navigation already restores the page

## Phase 4 — QA & ship

- [ ] **F**  Browser smoke: Chrome / Firefox / Safari + mobile Chrome / mobile Safari
- [ ] **F**  Lighthouse before/after on a recipe page
- [ ] **F**  Record MP4/GIF of Home → recipe → back
- [s] **F**  Final SW cache bump — auto-bumps on every Jekyll build via `site.time`

## Deferred (only if asked)

- [ ] **C.2**  Convert card thumb + hero to real `<img>` for pixel-perfect morph (current background-image cross-fades pixels; box morphs correctly)
- [ ] Firefox parity via Swup or polyfill (only if needed)
- [ ] Hover prefetch
- [ ] Component-page morphs (works today since components share the recipe layout)
- [ ] Mobile gesture back-swipe
