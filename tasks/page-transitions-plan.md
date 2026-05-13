# PLAN — Fluid page transitions with morphing shared elements

Companion to `SPEC.md`. Read-only investigation phase complete; no code touched yet.

> Namespaced filename (`page-transitions-*`) because `tasks/plan.md` and `tasks/todo.md` already belong to a previous feature (implement-recipe-from-image skill).

## 0. Current state (verified by reading the code)

- `_includes/head.html:91–93` already declares `@view-transition { navigation: auto; }`. Native MPA View Transitions are therefore **already enabled** on Chromium/Safari — the site is just falling back to the default root cross-fade, with no shared-element pairings and no fallback on Firefox.
- Recipe cards on `/` are rendered by `assets/js/home.js` in `createRecipeCard()` (line 100) — an `<a>` containing a `<canvas>` styled with `background-image: url(/images/cards/<file>)`. The thumbnail is a CSS background, not an `<img>`. That matters: `view-transition-name` works on any element, but only the element's box is animated; background-image won't morph into a real `<img>` cleanly. **Decision point** in Task C.
- Recipe page hero is `_layouts/recipe.html:10–14` — a `<div class="image">` with `data-hero-image` and a child `.view` element with `background-size: cover`. Also a background-image, not `<img>`.
- Cards on `/recherche/` are rendered in `recherche.html` (separate code path). Same morph mechanism needs to apply there too, but tag-graph interactions are out of scope.
- Header nav lives in `_includes/head.html:339–450` (desktop strip + mobile bottom bar). Standard `<a href>` links.
- No build step. Vanilla JS, CDN Tailwind. A service worker is registered in head.html — must be considered for cache busting of new assets.

## 1. Dependency graph

```
              ┌───────────────────────────────────────┐
              │ A. Library bootstrap (Swup vendored)  │
              │    + transitions.css + transitions.js │
              └───────────────┬───────────────────────┘
                              │
        ┌─────────────────────┼──────────────────────┐
        ▼                     ▼                      ▼
 B. Default site-wide   C. Shared-element       D. Reduced-motion
    transition (fade/    morph: card ↔ hero      + a11y + reduced
    slide on every       (home → recipe          fallbacks
    non-recipe nav)      → back)
        │                     │                      │
        └──────────┬──────────┴──────────┬───────────┘
                   ▼                     ▼
            E. Search page card    F. Cross-browser
               morph (recherche)      smoke + Lighthouse
                                      + visual capture
```

A blocks everything. B, C, D can proceed in parallel after A. E depends on C. F is the final checkpoint.

## 2. Vertical slices (each ships one user-visible improvement end-to-end)

### Task A — Wire up Swup + a no-op transition baseline

**Goal:** Swup intercepts all internal navigations, swaps a content container, fires hooks. No animation yet — prove the plumbing works on every page without breaking JS.

**Files**
- `assets/js/vendor/swup.min.js` (NEW — vendored from a pinned Swup v4 release; verify integrity).
- `assets/js/transitions.js` (NEW — Swup init, container selector, link selector excludes external/blank/anchor/QR triggers).
- `_layouts/default.html` — wrap the content area in `<div id="swup" class="transition-main">…</div>`.
- `_includes/head.html` — load `swup.min.js` then `transitions.js` (defer). Bump service worker cache version.
- `serviceworker.js` — bump cache name so the new JS is fetched fresh.

**Acceptance**
- Clicking any internal `<a>` does *not* trigger a full page reload (DevTools Network shows only the HTML doc, no CSS/JS re-fetch).
- After navigation, page-specific JS re-runs: home search works on `/`, recipe image zoom works, QR modal still opens.
- External / `target="_blank"` / anchor links behave normally.
- Browser back/forward restore the page and scroll position.
- JS-disabled browser still navigates with full reloads.

**Verify** — `bundle exec jekyll serve`; in Chrome, Firefox, Safari smoke navigate Home → recipe → back → recherche → recipe → external → anchor.

### Task A.1 — Page-specific JS re-initialisation contract

**Goal:** Establish how existing per-page scripts (`home.js`, `search-page.js`, `qr.js`, the recipe image zoom in `_layouts/recipe.html`, `nav.js`) re-run after a Swup content swap.

**Approach** — `transitions.js` dispatches a `page:ready` event on the new content root on every `content:replace`. Each per-page script is refactored to listen to both `DOMContentLoaded` *and* `page:ready`, guarding against double-binding (use a single `dataset.booted` flag on the root).

**Acceptance**
- After 3 consecutive Swup navigations the home search still works, the recipe zoom still works, no duplicate event listeners (DevTools `getEventListeners`).

**Verify** — Home → recipe → Home → recipe → Home; on each Home visit type in the search box.

**Checkpoint 1 — human review.** Show me the running site with plumbing in place; confirm nothing broke before adding animations.

---

### Task B — Site-wide default transition

**Goal:** Tasteful default for navigations with no shared element (Home ↔ Recherche, About, header links, Components index). Soft cross-fade + 12 px slide-up of the incoming content; ~220 ms `cubic-bezier(0.2, 0.8, 0.2, 1)`.

**Files**
- `assets/css/transitions.css` (NEW) — keyframes and `::view-transition-old(root)` / `::view-transition-new(root)` rules.
- `_includes/head.html` — `<link rel="stylesheet" href="…/transitions.css">`.
- `transitions.js` — wrap Swup's `content:replace` in `document.startViewTransition()` where supported; fall back to a JS-driven fade using Web Animations API otherwise.

**Acceptance** — All non-recipe page-to-page navigations produce a smooth 200–250 ms cross-fade in Chrome, Firefox (via JS fallback), and Safari. No content flash, no scrollbar jump.

**Verify** — 60 fps screen capture across the three browsers.

---

### Task C — Shared-element morph: recipe card ↔ recipe hero

**Goal:** Clicking a recipe card on the homepage morphs its thumbnail into the recipe page's hero image; back navigation reverses the morph.

**Decision — background-image vs `<img>`**

Current state: card thumbnail uses CSS `background-image` on a `<canvas>`; hero is a `<div>` with `background-image`. View Transitions snapshot the element's painted box, so:

- **C.1 (preferred first):** keep `background-image`, share a `view-transition-name`. The browser snapshots both painted boxes and tweens position/size + cross-fades pixels. Cheap, no DOM change. Quality is "good enough for most users" but not a true pixel-perfect morph because card and hero use *different* image files (`/images/cards/…` vs `/images/…`).
- **C.2 (deferred):** convert card thumb and recipe hero to real `<img>` elements with `srcset` so the *same image* is loaded at different sizes and the browser snapshots/morphs identical content. Higher fidelity, more DOM/CSS surgery. Defer until C.1 ships and we evaluate.

Start with C.1.

**Files**
- `assets/js/home.js` — in `createRecipeCard()`, derive `slug` from `recipe.url`, set `canvas.style.viewTransitionName = "recipe-" + slug`.
- `_layouts/recipe.html` — set inline `style="view-transition-name: recipe-{{ page.url | … | slugify }}"` on the `.image` div.
- `transitions.js` — before/after navigation, clear stale `view-transition-name` values so two pages never present duplicates simultaneously.
- `assets/css/transitions.css` — `::view-transition-group(recipe-*) { animation-duration: 380ms; animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1); }`.

**Acceptance**
- Chromium/Safari: clicking a card morphs the card box to the hero position/size; the rest of the page cross-fades.
- Browser back morphs the hero back into the originating card position.
- Slug guarantees uniqueness (no two recipes share a name).
- Off-screen / filtered-out cards don't interfere.

**Verify** — Chrome and Safari smoke pass; screen-record for the spec's visual review. Firefox: graceful default cross-fade with no console errors.

---

### Task D — Reduced motion, a11y, edge cases

**Files**
- `assets/css/transitions.css` — `@media (prefers-reduced-motion: reduce) { ::view-transition-group(*) { animation-duration: 0.001ms !important; } }` plus equivalent for the JS fallback.
- `transitions.js` — short-circuit on `matchMedia("(prefers-reduced-motion: reduce)").matches`.

**Acceptance**
- Reduced-motion ON ⇒ near-instant content swap, no morph.
- Keyboard nav (Tab/Enter on a card link) animates identically to a click.
- After navigation, focus moves to `<main>` or the new page's `<h1>` so screen readers announce it.

**Verify** — Toggle OS reduced-motion; keyboard-only run; VoiceOver/Orca check that the new page title is announced.

---

### Task E — Apply morph on `/recherche/`

**Files**
- `recherche.html` — only the card-render path. Do not touch D3 graph rendering.
- Same `view-transition-name` slug rule as Task C.

**Acceptance**
- Click a recipe from `/recherche/` produces the same morph as from Home.
- Back navigation returns to `/recherche/` with search state and scroll position preserved (Swup handles this).

**Verify** — filter by a tag, click a result, hit back; state intact.

**Checkpoint 2 — human review before final QA.**

---

### Task F — Cross-browser smoke + Lighthouse + capture

- Run the §6 matrix from SPEC.md.
- Lighthouse before/after on a recipe page; note JS-bytes delta.
- Capture a short MP4/GIF of Home → recipe → back for the PR description.
- Bump service-worker cache name if any asset URLs changed during impl.

**Acceptance** — no regression in any browser; new JS ≤ 30 KB gzipped (Swup ≈ 9 KB gzipped, `transitions.js` < 3 KB); visual capture shows the morph.

---

## 3. Risks & mitigations

- **Service-worker caches stale `default.html` / `head.html`** ⇒ users miss Swup. Mitigation: bump cache name in `serviceworker.js` in Task A.
- **Re-init bugs (double-bound listeners) after Swup swap.** Mitigation: `dataset.booted` flag + `page:ready` event from A.1; smoke test 3+ consecutive navigations on every page.
- **D3 force simulation on `/recherche/`** may misbehave on re-visit. Mitigation: `search-page.js` already gates on a root element; verify and add explicit gate if needed.
- **Background-image morph fidelity** lower than a real-image morph. Mitigation: C.1 first; review with user; consider C.2 follow-up.
- **Mobile recipe page hero is `position: fixed`** (recipe.html ~line 53) — participates oddly in transitions. Mitigation: test mobile early in Task C; if broken, move `view-transition-name` to an in-flow wrapper before the snapshot.

## 4. Out of scope

Hover prefetch. Search graph animation changes. Mobile gesture back-swipe. Replacing CSS background-images with `<img>` everywhere (deferred Task C.2). Component pages morph (only if asked).
