# Plan — Desktop "recipes per row" selector

Implements SPEC.md. Read SPEC.md first; this plan assumes that contract.

## Architecture summary

Three concerns, vertically sliced into self-contained tasks:

1. **Style layer** — a CSS rule that lets a `--cols` custom property drive `grid-template-columns` at ≥768px on any element tagged `[data-cols-grid]`. Mobile (`<768px`) stays on the existing Tailwind `grid-cols-2`.
2. **Controller** — `assets/js/cols-selector.js`, a small standalone module: reads `?cols=` from the URL, renders the segmented control into a mount node, updates `--cols` on all matching grids, and writes back to the URL via `history.replaceState`.
3. **Page wiring** — minimal edits to `index.html`, `assets/js/home.js`, and `recherche.html` to (a) add the mount node, (b) tag the relevant grids with `data-cols-grid`, and (c) load + initialise the controller.

## Dependency graph

```
T1 CSS rule  ─┐
              ├─► T3 Homepage wiring (uses controller, expects CSS)
T2 Controller ┤
              └─► T4 Search-page wiring
                       │
                       └─► T5 Manual QA + acceptance pass
```

T1 and T2 are independent and can land in either order, but both must precede T3/T4. T3 and T4 are independent of each other.

## Tasks (vertical slices)

### T1 — Add `[data-cols-grid]` CSS rule

- **Files:** `assets/css/tailwind.css` (or `_tailwind.css` — pick the file that survives the build; verify by grepping for existing custom rules).
- **Change:** append

  ```css
  @media (min-width: 768px) {
    [data-cols-grid] {
      grid-template-columns: repeat(var(--cols, 4), minmax(0, 1fr));
    }
  }
  ```

- **Acceptance:** After a rebuild, manually setting `data-cols-grid style="--cols:5"` on any `.grid` element produces a 5-column layout at desktop widths and is ignored below 768px.
- **Verify:** open a recipe grid in the browser, edit the attribute via DevTools, confirm layout flips. Resize below 768px → falls back to mobile `grid-cols-2`.

### T2 — Build the `cols-selector.js` controller

- **Files:** new `assets/js/cols-selector.js`.
- **Public API:**

  ```js
  initColsSelector({
    mount,           // HTMLElement to render the segmented control into
    gridSelector,    // CSS selector matching grids to control (e.g. "[data-cols-grid]")
    defaultCols = 4,
    allowed = [2, 3, 4, 5],
  });
  ```

- **Responsibilities:**
  - Parse `?cols=` from `location.search`, validate against `allowed`, fall back to `defaultCols`.
  - Render a segmented `<div class="hidden md:flex …">` of buttons with `aria-pressed`, `data-cols`, `aria-label="Afficher N colonnes"`, styling per SPEC §4.
  - Apply `--cols` immediately to every element matching `gridSelector` and update active button state.
  - On button click: update grids, update active state, `history.replaceState` with the new `?cols=`.
  - Expose `setCols(n)` and `refresh()` (the latter re-applies `--cols` to grids that appeared after init — needed for the homepage).
- **Acceptance:**
  - Calling `initColsSelector` against a static grid + mount node renders 4 buttons, active = 4 by default.
  - `?cols=2` makes the "2" button active and sets `--cols:2` on all matching grids.
  - Clicking "5" updates the URL to `?cols=5` and grids' `--cols`.
  - Bad value (`?cols=99`) falls back to 4; URL is not rewritten on init unless a click happens.
- **Verify:** ad-hoc HTML harness or test on `/recherche/` after T4 lands.

### T3 — Wire homepage

- **Files:** `index.html`, `assets/js/home.js`.
- **Changes:**
  - `index.html`:
    - Add `<div id="cols-selector-mount"></div>` inside the toolbar row near line 72 (after the components-toggle button, in the same `flex-wrap items-center gap-3` row).
    - Add `<script src="{{ site.baseurl }}/assets/js/cols-selector.js"></script>` before `home.js`.
  - `home.js`:
    - On each grid created (lines 70 and 93), add `grid.setAttribute('data-cols-grid', '')` and **remove** the `md:grid-cols-3` Tailwind class from the className string. Keep `grid-cols-2` for mobile and the `gap-*` classes.
    - After the loop that builds categories (and after `othersSection` is created), call `initColsSelector({ mount: document.getElementById('cols-selector-mount'), gridSelector: '[data-cols-grid]', defaultCols: 4 })`.
- **Acceptance:** All homepage category grids respond to the segmented control; URL updates; reload preserves the choice; mobile still shows 2 columns.
- **Verify:** Build + open `/`, click through {2,3,4,5}, reload with `?cols=5`, resize to mobile, ensure no console errors.

### T4 — Wire advanced search page

- **Files:** `recherche.html`.
- **Changes:**
  - Add `<div id="cols-selector-mount"></div>` inside the "Résultats" header row (around line 827 — same flex row as `<h2>Résultats</h2>` and the count).
  - On `#results-grid` (line 835) and `#reco-grid` (line 843):
    - Add `data-cols-grid` attribute.
    - Remove `md:grid-cols-3` from `class=`. Keep `grid grid-cols-2 gap-4 md:gap-6`.
  - Add `<script src="{{ site.baseurl }}/assets/js/cols-selector.js"></script>` before `search-page.js`.
  - In `recherche.html` (small inline `<script>` after `search-page.js`), call `initColsSelector({ mount: document.getElementById('cols-selector-mount'), gridSelector: '[data-cols-grid]', defaultCols: 4 })` on `DOMContentLoaded`.
- **Acceptance:** Both `#results-grid` and `#reco-grid` respect the chosen column count on desktop; URL syncs; mobile untouched; D3 graph and filters unaffected.
- **Verify:** Build + open `/recherche/`, change cols, run a search to populate `#reco-grid`, verify both grids share the same column count, reload with `?cols=2`.

### T5 — Acceptance pass

- Walk through every acceptance criterion in SPEC §8.
- Spot-check keyboard a11y on the segmented control (tab + enter).
- Confirm no regressions: tag filters, search input, category sections, D3 force graph.
- Confirm the segmented control is visually invisible below 768px.

## Checkpoints (human review gates)

- **CP-A** after T1 + T2: stop and let the user verify the CSS rule + the controller in isolation before wiring pages.
- **CP-B** after T3: stop and let the user click through the homepage on desktop + mobile before touching `recherche.html`.
- **CP-C** after T5: present manual test results; await commit approval.

## Risks / open questions

- **Tailwind source file:** confirm the CSS edit lands in the file the build actually serves (`tailwind.css` vs `_tailwind.css`). If `_tailwind.css` is a source compiled into `tailwind.css`, edit the source.
- **`home.js` grid timing:** the controller's `refresh()` only matters if grids are added *after* init. The plan calls `initColsSelector` *after* the build loop, so a single pass suffices. `refresh()` is the escape hatch for future refactors.
- **Tailwind purge:** we deliberately avoid `md:grid-cols-{2..5}` classes, so no safelisting is required.
