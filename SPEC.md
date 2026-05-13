# SPEC — Fluid page-to-page transitions

## 1. Objective

Replace the current raw, full-reload navigation between pages of the recipe site with smooth, animated transitions that include **morphing of shared elements** (most notably: a recipe card thumbnail morphs into the recipe page's hero image). The result should feel native-app-grade on a static Jekyll/GitHub Pages site.

**Out of scope for this iteration:** in-page micro-interactions, search graph animations, scroll behaviour, mobile gesture nav, prefetch heuristics beyond what the library gives for free.

**Target users:** end visitors of the recipe site, on modern mobile and desktop browsers. The site owner (you) maintains it locally with Jekyll.

## 2. Acceptance criteria

A change is "done" when:

1. Clicking a recipe card on the homepage (`/`) or on the advanced search (`/recherche/`) animates the thumbnail into the recipe page's hero image (shared-element morph), while the rest of the page fades/slides in around it.
2. Clicking the back-link or browser back navigates from a recipe page back to the originating list with the **reverse** morph.
3. All other page-to-page navigations (header links, footer, About, Components index, etc.) use a soft default transition (cross-fade + slight scale or slide — TBD during impl, but consistent site-wide).
4. Navigation interception does not break:
   - Anchor links within a page (no fetch, native scroll).
   - External links (open normally).
   - `target="_blank"` links.
   - The QR modal, search overlays, and any existing JS that runs on `DOMContentLoaded`.
5. On unsupported browsers or when JS fails, navigation falls back to a normal full page load with no broken UI.
6. No measurable Lighthouse regression on the recipe page beyond what the new library adds (target: < +30 KB JS gzipped total).
7. `prefers-reduced-motion: reduce` disables non-essential animations (shared-element morph becomes a simple instant swap or short cross-fade).

## 3. Tech stack

- **Existing:** Jekyll, GitHub Pages, Tailwind, vanilla JS, D3 (search page only).
- **New:** [**Swup**](https://swup.js.org/) v4 as the navigation router (intercepts links, fetches HTML, swaps a content container, fires lifecycle hooks). Loaded from a pinned CDN URL (no Node build step) or vendored under `assets/js/vendor/` to stay GitHub-Pages-native.
- **Shared-element morph:** use the **native View Transitions API** (`document.startViewTransition`) inside Swup's `visit:start` / `content:replace` hooks where supported. Pair recipe card thumbnails and recipe hero images with matching `view-transition-name: recipe-<slug>` set dynamically before navigation.
- **Fallback (no View Transitions API):** Swup's built-in fade theme (`@swup/fade-theme`) — universal, no morph but still smooth.

**Rationale:** Swup handles the hard MPA-routing parts (history, scroll restoration, head merging, script re-execution) across all browsers. View Transitions API gives the cinematic morph on Chromium/Safari for free. The combination degrades gracefully without polyfills.

## 4. Project structure

Files added or touched:

```
SPEC.md                              # this file
assets/js/transitions.js             # NEW — Swup init, hooks, view-transition naming
assets/js/vendor/swup.min.js         # NEW — vendored Swup (or CDN <script> in head)
assets/css/transitions.css           # NEW — @view-transition rules, fallback keyframes
_includes/head.html                  # load Swup + transitions.css
_layouts/default.html                # wrap {{ content }} in <div id="swup" class="transition-main">
_layouts/recipe.html                 # add view-transition-name on hero image element
assets/js/*                          # recipe-card renderers: set view-transition-name on thumb before click
```

No build step. Tailwind classes stay; new CSS is plain.

## 5. Code style

- Vanilla ES modules or a single IIFE in `transitions.js`. No bundler.
- Follow existing project conventions: 2-space indent, double quotes in JS strings, kebab-case CSS classes, French in user-visible strings (none expected here).
- Feature-detect everything: `if ('startViewTransition' in document) { ... } else { ... }`.
- No inline JS in templates beyond a single `data-*` attribute hook if needed.
- Keep `view-transition-name` values URL-safe and unique per recipe (`recipe-<slug>` derived from the page URL).

## 6. Testing strategy

Manual, browser-driven (this is a visual feature):

1. **Smoke matrix** — Chromium (latest), Safari (latest), Firefox (latest), mobile Safari, mobile Chrome. For each:
   - Home → recipe → back → recipe (different card).
   - `/recherche/` → recipe → back.
   - Header nav links between top-level pages.
   - External link, anchor link, `target="_blank"` link still behave normally.
   - QR modal still opens after a Swup navigation.
2. **Reduced motion** — toggle OS setting, confirm morph is suppressed.
3. **Offline / JS disabled** — confirm site still navigates with full reloads.
4. **Lighthouse** — run on a recipe page before/after; record JS size delta.
5. **Visual review** — record a short screen capture of home→recipe→back and confirm the morph is continuous (no flash, no jump).

No automated tests added. The existing repo has no JS test harness; introducing one is out of scope.

## 7. Boundaries

**Always:**
- Keep navigation working with JS disabled (graceful degradation).
- Respect `prefers-reduced-motion`.
- Use canonical Jekyll URLs (`{{ site.baseurl }}`) so the site keeps working under a project-page path.
- Pin the Swup version explicitly.

**Ask first:**
- Before adding any build step (npm, esbuild, Vite).
- Before changing the URL structure or permalinks.
- Before touching `recherche.html`'s D3 logic — only the card click path is in scope.
- Before adding prefetch-on-hover (can be a follow-up; affects bandwidth).

**Never:**
- Convert the site into a true SPA (no client-side routing beyond Swup's HTML-swap).
- Break deep links, sharing, or scroll-to-anchor.
- Animate on every DOM event — only on navigation.
- Use a heavy framework (React, Vue, Astro runtime, Turbo, Barba) for this.
- Commit without a manual cross-browser smoke pass.

## 8. Open questions to resolve during implementation

- Exact default transition for non-recipe pages: cross-fade vs short slide. Decide after a first prototype.
- Whether to add hover-prefetch (Swup has a `preload` plugin); leave off by default to keep bandwidth predictable.
- How to handle the `recipe.image` being a list vs a string when computing the morph target (the recipe layout already normalises this — reuse that logic).
