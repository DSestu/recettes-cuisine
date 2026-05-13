# TODO — Fluid page transitions

Linked plan: `tasks/page-transitions-plan.md` · Spec: `SPEC.md`

Status legend: [ ] pending · [~] in progress · [x] done · [!] blocked

## Phase 1 — Plumbing

- [ ] **A**  Vendor Swup v4 to `assets/js/vendor/swup.min.js` (pin version, verify integrity)
- [ ] **A**  Create `assets/js/transitions.js` with Swup init + link/container selectors
- [ ] **A**  Wrap content area of `_layouts/default.html` in `<div id="swup">`
- [ ] **A**  Load Swup + transitions in `_includes/head.html` (defer)
- [ ] **A**  Bump cache name in `serviceworker.js`
- [ ] **A.1**  Define `page:ready` event contract; refactor `home.js`, `search-page.js`, `qr.js`, recipe image zoom, `nav.js` to re-boot idempotently
- [ ] **A.1**  Smoke pass: 3 consecutive Swup nav cycles, no duplicate listeners

⏸ **Checkpoint 1 — show working plumbing to user**

## Phase 2 — Animations (parallelisable)

- [ ] **B**  Create `assets/css/transitions.css` with default fade+slide
- [ ] **B**  Link CSS from head; wire `document.startViewTransition` in `transitions.js`
- [ ] **B**  Add JS Web-Animations fallback for Firefox
- [ ] **C**  Add `view-transition-name: recipe-<slug>` to card thumb in `home.js`
- [ ] **C**  Add matching name to hero `.image` div in `_layouts/recipe.html`
- [ ] **C**  Clear stale names around navigation in `transitions.js`
- [ ] **C**  Tune `::view-transition-group(recipe-*)` timing in CSS
- [ ] **C**  Verify mobile (fixed hero) renders the morph correctly; adjust wrapper if needed
- [ ] **D**  `prefers-reduced-motion` CSS + JS guards
- [ ] **D**  Move focus to `<h1>` / `<main>` after `content:replace`
- [ ] **D**  Keyboard-only smoke pass

## Phase 3 — Search page

- [ ] **E**  Apply card morph in `recherche.html` (card render only, leave D3 alone)
- [ ] **E**  Verify back nav restores search state + scroll

⏸ **Checkpoint 2 — show full effect to user**

## Phase 4 — QA & ship

- [ ] **F**  Matrix smoke: Chrome / Firefox / Safari + mobile Chrome / mobile Safari
- [ ] **F**  Lighthouse before/after on a recipe page; record JS-bytes delta
- [ ] **F**  Record MP4/GIF of Home → recipe → back
- [ ] **F**  Final service-worker cache bump if needed
- [ ] **F**  Update `CLAUDE-patterns.md` / auto memory if new conventions emerged

## Deferred (only if asked)

- [ ] **C.2**  Convert card thumb + hero to real `<img>` for pixel-perfect morph
- [ ] Hover prefetch via Swup preload plugin
- [ ] Component page morphs
- [ ] Mobile gesture back-swipe
