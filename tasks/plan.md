# Plan — recettes-cuisine improvement pass

Plan-mode artifact derived from SPEC.md and the five-axis code review.
Read-only at this stage: no code changes have been made; this document
proposes the sequence and acceptance criteria.

## Scope

Address the prioritized findings from the code review:

- Service worker is too aggressive and never versioned.
- `recherche.html` carries ~2800 lines of inline JS that has a near-duplicate
  in `assets/js/search-page.js` (unused).
- XSS risk: recipe titles + tag chips interpolated into `innerHTML`.
- Listener leaks and unbounded redraws in the D3 force-graph code.
- Dead code: `search.html`, `search.json`, `simple-jekyll-search`, jQuery,
  Hammer.js — none referenced by the active app.
- A handful of medium fixes: `manifest.json start_url`, OG image when
  `page.image` is an array, `_config.yml` placeholder email, Twitter
  `twitter:domain` still set to `chowdown.io`, unused `#include-components`
  control, `recipe.html` `querySelectorAll("ul li")` over-scoping.

Out of scope (would require explicit approval, see SPEC §6):
- Build tooling / bundler / TypeScript.
- Recipe content edits.
- Tag registry format or `home_categories.md` schema.
- URL / permalink changes.

## Dependency graph

```
                    ┌──────────────────────────────────┐
                    │ P1.a  escape-html helper module  │
                    │ P1.b  service-worker rewrite     │
                    └──────────────────────────────────┘
                                    │
            ┌───────────────────────┴───────────────────────┐
            ▼                                               ▼
  ┌────────────────────────┐                  ┌──────────────────────────────┐
  │ P2  extract recherche  │                  │ P3  apply escape-html        │
  │     inline script →    │                  │     to recipe.html sinks     │
  │     search-page.js     │                  │     (recommendations etc.)   │
  └────────────────────────┘                  └──────────────────────────────┘
            │
            ▼
  ┌────────────────────────────────────────────────────────┐
  │ P4  inside search-page.js:                             │
  │      - apply escape-html to every innerHTML sink       │
  │      - debounce pushControlsToUrl / refresh            │
  │      - fix listener leaks (resize, fullscreenchange,   │
  │        pointerdown) — register once, clean up          │
  │      - tag-state case-fold + URL roundtrip safety      │
  └────────────────────────────────────────────────────────┘
            │
            ▼
  ┌─────────────────────────────────────┐
  │ P5  audit & delete dead code        │
  │      - confirm no inbound /search/  │
  │      - drop search.html, search.json│
  │      - drop simple-jekyll-search    │
  │      - confirm no jQuery use, drop  │
  │      - confirm no Hammer use, drop  │
  └─────────────────────────────────────┘
            │
            ▼
  ┌─────────────────────────────────────┐
  │ P6  polish                          │
  │   - manifest.json start_url+scope   │
  │   - head.html OG image array safety │
  │   - head.html OG description trunc  │
  │   - _config.yml email + twitter dom │
  │   - recipe.html ul li scope fix     │
  │   - remove #include-components dead │
  └─────────────────────────────────────┘
```

Phases P1 → P6 are sequential at the boundaries marked, but P2 and P3 are
parallelizable after P1.

## Phases

### Phase 1 — Foundations (low risk, ship first)

**Goal:** isolated, independently-shippable safety fixes that don't touch
the heavy inline code yet.

- **P1.a** Add `assets/js/escape-html.js` exporting one function
  `escapeHtml(str)` (replaces `&`, `<`, `>`, `"`, `'`). Loaded site-wide
  via `_includes/head.html`.
- **P1.b** Rewrite `serviceworker.js`:
  - Version cache name with the Jekyll build time:
    `CACHE = 'rc-' + '{{ site.time | date: "%s" }}'`.
  - In `fetch`: skip cross-origin URLs, skip URLs with query strings, skip
    non-GET. Cache same-origin GETs only.
  - In `activate`: delete every cache whose name doesn't match the current.
  - Drop the upstream PWABuilder boilerplate strings.

**Checkpoint 1:** show diff, smoke-test locally (jekyll serve, install PWA,
verify cache name in DevTools → Application → Cache Storage, verify old
caches removed on update). Wait for user OK before P2.

### Phase 2 — Extract recherche.html

- **P2** Move the inline `<script>` block (recherche.html ~3072–3651) into
  `assets/js/search-page.js`. The file already exists as a near-duplicate;
  reconcile drift line-by-line, keep one canonical version. Reference it
  from `recherche.html` with `<script defer src="{{ site.baseurl }}/assets/js/search-page.js"></script>`.
  Leave the page-local data initializer (`window.__RECHERCHE_DATA = …`) in
  `recherche.html` so Jekyll can still emit recipes.

**Checkpoint 2:** load `/recherche/`, exercise: title search, tag mode,
ingredient mode, tolerance slider, infinite toggle, category chips, URL
roundtrip on reload, force-graph render, fullscreen overlay. Wait for OK.

### Phase 3 — Escape XSS sinks in recipe.html

- **P3** Apply `escapeHtml()` in `_layouts/recipe.html` everywhere a tag
  string or recipe title is interpolated into `innerHTML` (tag-pill
  rendering, recommendations grid). Identified sinks in the review: line
  ~936 and the recommendation block. Audit the file fully — there may be
  more.

**Checkpoint 3:** render a recipe page; confirm tags + recommendations
display identically. Wait for OK.

### Phase 4 — Hardening inside search-page.js

Now that the script lives in a real file, apply the harder fixes.

- **P4.a** Replace every `innerHTML` template-literal-with-`${title}` with
  a builder that uses `textContent` or `escapeHtml()`. Specifically the
  recipe card builder (`recherche.html:1402`, `1523` originally), the
  chip builder (`recherche.html:1422`), and the tooltip renderer.
- **P4.b** Debounce `pushControlsToUrl` to ~250 ms on `input` events
  (slider, title search). Don't call `updateQrCode()` on every keystroke;
  only after the debounce fires.
- **P4.c** Fix listener leaks in `renderForceGraph`:
  - Move the `window.addEventListener('resize', …)`,
    `document.addEventListener('fullscreenchange', …)`, and
    `document.addEventListener('pointerdown', …)` registrations out of
    the function. Register once at module init; the handler reads current
    state from a module-level variable.
  - Move the fullscreen overlay element creation out of `renderForceGraph`
    so its closures don't capture stale `simulation`/`width`/`height`.
- **P4.d** Tag-state safety: lowercase on add; URL param uses
  `encodeURIComponent` + `+` separator instead of raw `,`-join.

**Checkpoint 4:** repeat Phase-2 smoke test plus DevTools listener count
audit (open `/recherche/`, change filters 20 times, assert that
`getEventListeners(window).resize.length` stays at 1). Wait for OK.

### Phase 5 — Dead-code audit + removal

Each step is gated by a verification command. **Stop and ask if any
verification produces a match.**

- **P5.a** Audit `/search/` inbound usage:
  - `rg -n "/search/?\"|/search\\.html|href=\"search" --type html`
  - Check `_includes/head.html`, layouts, `_config.yml`, `manifest.json`,
    `serviceworker.js` offline-precache list. If clean → delete
    `search.html`, `search.json`, `plugins/simple-jekyll-search.min.js`.
- **P5.b** Audit jQuery usage: `rg -n "jQuery|\\$\\(" --type html --type js`
  excluding minified libs. If only the `<script>` tag in `head.html`
  remains → drop the tag.
- **P5.c** Audit Hammer.js: `rg -n "Hammer|hammer.js" --type html --type js`.
  If only the script tag → drop it.

**Checkpoint 5:** rebuild, smoke-test homepage + recipe + recherche +
PWA. Wait for OK before P6.

### Phase 6 — Polish

Small, independently-revertable fixes. Can be a single commit.

- **P6.a** `manifest.json`: set `start_url` to `"{{ site.baseurl }}/"` and
  add `scope: "{{ site.baseurl }}/"`. Convert to a Jekyll-templated file
  if it isn't already (`---\nlayout: null\n---\n…`).
- **P6.b** `_includes/head.html`:
  - Replace `{{ page.image }}` with `{{ page.image | first | default: page.image }}` (handles list-typed `image:`).
  - Add `truncate: 200` to OG description (`{{ page.content | strip_html | truncate: 200 }}`).
  - Update `twitter:domain` from `chowdown.io` to `dsestu.github.io`.
  - Remove the `crockpot-buffalo-chicken.jpg` fallback (upstream relic).
- **P6.c** `_config.yml`: replace `email: nope@gmail.com` (drop or set real).
- **P6.d** `_layouts/recipe.html`: scope `querySelectorAll("ul li")` to the
  ingredients/directions containers only.
- **P6.e** Remove the hidden, unused `#include-components` control and its
  URL parameter in `recherche.html` / `search-page.js`.

**Checkpoint 6:** full manual smoke test (homepage, recipe page,
recherche, PWA install, social-share preview via opengraph.xyz). Wait
for OK.

## Risk register

| Risk | Mitigation |
|---|---|
| Service-worker cache version change wipes installed PWAs' offline content. | Acceptable cost; SPEC §5 already warns "clear cache on schema changes". Announce in commit message. |
| Extracting `recherche.html` script could break Liquid templating that's interleaved with the JS. | Audit for `{{ }}` / `{% %}` tags inside the script block before extracting; keep those Liquid bits in `recherche.html` as `window.__RECHERCHE_DATA = {…}`. |
| `/search/` is bookmarked externally. | P5.a audit is path-scoped; if any match, keep the file and just remove the redundant plugin. |
| jQuery removal breaks something we missed (e.g. inline `$(...)` inside a recipe body). | P5.b scope includes `--type md`. Stop if a single match. |
| `manifest.json` is currently static and may be served by a cache. | After P6.a + P1.b changes, force-refresh service worker manifest. |

## Verification matrix

For every phase, the verification story is the same — there is no test
suite (SPEC §5):

1. `jekyll serve` (delegate to a noisy-commands subagent per memory note).
2. Visit homepage, click a recipe, click "Recherche", exercise filters.
3. DevTools console clean (no new errors / warnings).
4. For SW changes: Application → Service Workers + Cache Storage tabs.
5. After P5: GitHub Pages build succeeds (push to a branch, watch the
   Pages build status).

## Commit / PR shape

One commit per phase, suitable for cherry-pick or revert. PR titles:

1. `chore: harden service worker + add escape-html helper`
2. `refactor(recherche): extract inline script to assets/js/search-page.js`
3. `fix(xss): escape recipe titles + tags in recipe.html`
4. `fix(recherche): escape sinks, debounce URL sync, kill listener leaks`
5. `chore: drop unused search.html / jQuery / Hammer.js`
6. `chore: PWA manifest, OG meta, _config polish`
