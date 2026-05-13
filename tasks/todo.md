# TODO — recettes-cuisine improvement pass

Derived from `tasks/plan.md`. Each task lists acceptance criteria + how to
verify. Checkpoints are explicit user gates; do not cross them silently.

## Phase 1 — Foundations

- [x] **P1.a — Add escape-html helper.**
  - File: `assets/js/escape-html.js`.
  - Exports `window.escapeHtml(str)` replacing `& < > " '`.
  - Loaded from `_includes/head.html` before `home.js` / search code.
  - Accept: helper available in `window`; `escapeHtml('<img src=x onerror=1>')` returns the entity-encoded string.
  - Verify: `jekyll serve`; DevTools console: `escapeHtml('<a>')` → `&lt;a&gt;`.

- [x] **P1.b — Rewrite service worker.**
  - File: `serviceworker.js` (templated through Jekyll if not already).
  - Cache name: `'rc-' + '{{ site.time | date: "%s" }}'`.
  - `fetch`: same-origin GET only, skip URLs with `?`/`#` query, cache-first with network fallback.
  - `activate`: delete every cache whose name ≠ current.
  - Remove PWABuilder boilerplate (`ToDo-replace-this-name.html`).
  - Accept: previous cache evicted on next visit; cross-origin (`cdn.tailwindcss.com`, `code.jquery.com`) responses are NOT cached; `/recherche/?tags=foo` is fetched fresh.
  - Verify: DevTools → Application → Cache Storage; reload, confirm old cache gone, new cache contains only same-origin no-query URLs.

- [ ] **Checkpoint 1** — user reviews P1 diff and smoke test, OKs before P2.

## Phase 2 — Extract recherche.html script

- [x] **P2 — Move inline script to `assets/js/search-page.js`.**
  - Reconcile against the existing near-duplicate file; produce one canonical source.
  - Replace the `<script>` block in `recherche.html` (~lines 3072–3651) with `<script defer src="{{ site.baseurl }}/assets/js/search-page.js"></script>`.
  - Keep page-local Liquid-emitted data as `window.__RECHERCHE_DATA = {…}` inline in `recherche.html`; reference it from the JS file.
  - Audit: no `{{ … }}` or `{% … %}` left inside the extracted file.
  - Accept: `recherche.html` ≤ 1000 lines; behavior identical to before.
  - Verify: title search, tag mode, ingredient mode, tolerance slider, infinite toggle, category chips, URL roundtrip on reload, force-graph render, fullscreen overlay.

- [ ] **Checkpoint 2** — user smoke-tests `/recherche/`, OKs before P3.

## Phase 3 — Escape XSS sinks in recipe.html

- [x] **P3 — Apply `escapeHtml()` in `_layouts/recipe.html`.**
  - Identified sink: ~line 936 (recommendations block); recipe titles + tag chips interpolated into `innerHTML` template literals.
  - Audit the whole file with `rg "innerHTML" _layouts/recipe.html` and patch every sink that interpolates a recipe-derived string.
  - Accept: test recipe with `title: "<img src=x onerror=alert(1)>"` renders the title as text, no alert.
  - Verify: load a normal recipe (no visual regression on tags / recommendations); temporarily set a malicious title in a scratch file, confirm it renders escaped.

- [ ] **Checkpoint 3** — user reviews, OKs before P4.

## Phase 4 — Hardening inside search-page.js

- [x] **P4.a — Escape all `innerHTML` sinks in `search-page.js`.**
  - Recipe card builder, chip builder, tooltip renderer (formerly recherche.html:1402, 1422, 1523).
  - Replace `${title}` / `${tag}` interpolations with `escapeHtml()` or build via `textContent`.
  - Accept: same XSS test recipe renders escaped on `/recherche/`.

- [x] **P4.b — Debounce URL state and QR sync.**
  - Wrap `pushControlsToUrl` in a ~250 ms debounce for `input` events (title search, sliders).
  - Skip `updateQrCode()` until the debounce settles.
  - Accept: dragging the tolerance slider produces ≤ 1 URL write per 250 ms.
  - Verify: DevTools Network / Performance recorder during a slider drag.

- [x] **P4.c — Fix listener leaks in `renderForceGraph`.**
  - Move `window.resize`, `document.fullscreenchange`, `document.pointerdown` listeners out of the render function; register once at module init; use a module-level state ref so handlers always see current state.
  - Move fullscreen overlay creation out of `renderForceGraph` (so closures don't capture stale `simulation`/`width`/`height`).
  - Accept: after 20 filter changes, `getEventListeners(window).resize.length === 1`.
  - Verify: DevTools console `getEventListeners(window).resize` before/after.

- [x] **P4.d — Tag-state URL-roundtrip safety.**
  - Lowercase tags on add to `state.selectedTags`.
  - URL param uses `tags.map(encodeURIComponent).join('+')` and decodes symmetrically.
  - Accept: a tag containing a comma roundtrips correctly through the URL.

- [ ] **Checkpoint 4** — user smoke-tests, listener count audit, OKs before P5.

## Phase 5 — Dead-code audit + removal

Gate each step on its `rg` audit. **Stop and ask if any match appears.**

- [x] **P5.a — Drop `search.html` + `search.json` + simple-jekyll-search.**
  - Audit: `rg -n "/search/?\"|/search\\.html|href=\"search" --type html --type md --type yaml`.
  - If clean: delete `search.html`, `search.json`, `plugins/simple-jekyll-search.min.js`.
  - Accept: jekyll build still succeeds; homepage + recherche unaffected.

- [x] **P5.b — Drop jQuery.**
  - Audit: `rg -n "jQuery|\\$\\(" --type html --type js --type md` excluding `plugins/`, `js/` (minified libs).
  - If clean: remove the `<script src=".../jquery-2.1.4.min.js">` tag from `_includes/head.html`.
  - Accept: pages load without console errors.

- [x] **P5.c — Drop Hammer.js.**
  - Audit: `rg -n "Hammer|hammer\\.js" --type html --type js`.
  - If clean: remove the `<script>` tag.
  - Accept: pages load without console errors.

- [ ] **Checkpoint 5** — user OK before P6.

## Phase 6 — Polish

- [x] **P6.a — manifest.json fixes.**
  - Templatize as Jekyll file if needed (`---\nlayout: null\n---`).
  - `start_url: "{{ site.baseurl }}/"`.
  - Add `scope: "{{ site.baseurl }}/"`.
  - Verify: Lighthouse PWA audit passes manifest checks.

- [x] **P6.b — `_includes/head.html` fixes.**
  - OG image: `{{ page.image | first | default: page.image }}` (handles list).
  - OG description: append `| truncate: 200`.
  - `twitter:domain` → `dsestu.github.io`.
  - Remove `crockpot-buffalo-chicken.jpg` fallback.
  - Verify: opengraph.xyz preview for a recipe page.

- [x] **P6.c — `_config.yml` placeholder email.**
  - Replace `email: nope@gmail.com` with the user's real address, or drop the key.
  - (Ask user before guessing.)

- [x] **P6.d — `_layouts/recipe.html` `ul li` scoping.**
  - Scope `querySelectorAll("ul li")` to the ingredients / directions containers only.
  - Verify: checkbox / fill animation still works on ingredients and direction steps; no animation on recommendation list items.

- [x] **P6.e — Remove dead `#include-components` control.**
  - Remove the hidden element, its CSS, and the URL param read/write in `search-page.js`.
  - Verify: `/recherche/` behaves identically.

- [ ] **Checkpoint 6** — full manual smoke test, user OK to commit/push.

## Tracking note

When starting a task, switch the leading `[ ]` to `[~]`; mark `[x]` only
after the verification step in that task has passed.
