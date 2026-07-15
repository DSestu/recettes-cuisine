# SPEC — "En ce moment" & "Ça arrive / Dernière chance"

Feature spec for a new header section on `/calendrier/`. Extends the existing project spec (`SPEC.md`); does not replace it.

## 1. Objective

Add a header above the ingredient calendar that surfaces what's actionable *right now* and *very soon*, so a visitor lands on the page and immediately sees what to cook this fortnight and what to plan for.

Target user: a home cook browsing to pick a recipe. They already know how to click ingredients to reach the advanced search; this section shortens the path for the two most common intents — "what's peak now?" and "what should I use up / try next?".

## 2. Scope

Three-part header, rendered above `#calendrier-controls-mount`:

1. **Ça arrive** — ingredients whose season starts within the next 1–2 quinzaines (~1 month) and are not currently in season.
2. **En ce moment** — ingredients whose current quinzaine token is `start`, `peak`, or `end`.
3. **Dernière chance** — ingredients currently at `end` that will exit within the next 1–2 quinzaines.

An ingredient in `end` state appears in **both** "En ce moment" and "Dernière chance"; the overlap is intentional (peak visibility right before it disappears).

## 3. Data model

Reuse `assets/data/seasonality.json`. Compute the current quinzaine from `new Date()` (month index + `1` if day ≤ 15 else `2`). Parse each entry's `season` string into a `{ monthIdx, half, intensity }` list, then evaluate:

- **En ce moment**: entry has a token matching the current quinzaine.
- **Ça arrive**: no token at the current quinzaine, and a `start` token exists at current+1 or current+2 (wrap Dec→Jan).
- **Dernière chance**: `end` token at current, current+1, or current+2.

Store distance-to-next-state per item so lists sort by proximity ("dans 2 semaines" before "dans 1 mois").

## 4. UI

Markup mount:

```
<section id="calendrier-now">
  <header>
    <h2>Cette quinzaine</h2>
    <div class="now-filters">…category toggles…</div>
    <button data-collapse-toggle aria-expanded="true">…</button>
  </header>
  <div class="now-body" data-collapsed="false">
    <div class="now-bucket" data-bucket="incoming">…</div>
    <div class="now-bucket" data-bucket="current">…</div>
    <div class="now-bucket" data-bucket="leaving">…</div>
  </div>
</section>
```

- Three columns on desktop (`md:grid-cols-3`); stacked on mobile.
- Each bucket has a title, a short subtitle ("Nouveaux arrivages", "En pleine saison", "Dernière chance avant l'année prochaine"), then a flat list of ingredient chips.
- Chip: category dot (reuses `CATEGORY_COLORS`) + ingredient name + small proximity tag ("dans 2 sem.", "encore 1 mois"). Inside "En ce moment", `peak` chips are filled; `start`/`end` are outlined with a hatched category dot.
- **Show everything** — no per-bucket cap.
- **Category filters** — compact toolbar in the section header with one toggle per category present in the data (reuses `CATEGORY_ORDER` / `CATEGORY_LABELS`). Toggling hides chips of that category across all three buckets. Filter state persists to `localStorage` under `calendrier.now.categoryFilters`. Does not touch the URL. Does not affect the main calendar below.
- **Collapse** — the whole section is collapsible on both desktop and mobile. Collapsed state persists to `localStorage` under `calendrier.now.collapsed`. Default: expanded. Animate `max-height`; respect `prefers-reduced-motion`.

## 5. Interaction

- **Chip click** → `/{{ site.baseurl }}/recherche/?tags=<ingredient-id>&tol=0` (same as clicking an ingredient row in the calendar, zero tolerance).
- **Keyboard** — chips are focusable, `Enter` activates, visible focus ring.
- **Collapse toggle** — `aria-expanded` and `aria-controls` on the button.

## 6. Files touched

- `calendrier.html` — mount point `<section id="calendrier-now">` above `#calendrier-controls-mount`.
- `assets/js/calendrier.js` — new module section: quinzaine math + `renderNowSection(seasonality, ingredientIndex, mountEl)`. Called from the same init path that renders the calendar, so it reuses already-loaded data.
- `assets/css/*` (or inline `<style>` in `calendrier.html`) — styles for the section, chips, bucket columns, collapse animation.

No changes to `_data/`, `scripts/`, or the main calendar rendering path.

## 7. Code style

- Vanilla JS, no new dependencies. Match the IIFE + `"use strict"` pattern in `calendrier.js`.
- Reuse existing constants (`MONTHS`, `CATEGORY_ORDER`, `CATEGORY_LABELS`, `CATEGORY_COLORS`, `TOKEN_RE`) — do not duplicate.
- Tailwind utility classes for layout where the rest of the page uses them; custom CSS only for chip visuals and the collapse animation.
- French user-facing strings; ASCII canonical ingredient ids in URL params.

## 8. Testing / verification

- Manual, `bundle exec jekyll serve`, open `/calendrier/`. At 2026-07-15 (quinzaine `jul-2`) verify:
  - "En ce moment" contains e.g. `abricot`, `anchois`, `ail nouveau` (all `jul-2:peak`).
  - "Ça arrive" contains ingredients whose first `start` token is `aug-1` or `aug-2`.
  - "Dernière chance" contains ingredients with `end` at `jul-2`, `aug-1`, or `aug-2`.
- Test wrap-around by temporarily overriding "now" via a dev-only `?now=YYYY-MM-DD` query param (not documented in the UI). Verify Dec→Jan works for both incoming and leaving buckets.
- Chip click lands on `/recherche/?tags=<id>&tol=0` with the correct ingredient tag applied.
- Collapse state persists across reload.
- Category filter persists across reload; does not affect the calendar grid below.
- `prefers-reduced-motion`: collapse is instant.
- Mobile (<768px): stacks vertically, chips wrap, no horizontal scroll.

## 9. Boundaries

**Always:**
- Compute "now" from `new Date()` client-side; no build-time snapshot.
- Reuse existing category tokens/colors and the `/recherche/` URL contract (`tags`, `tol`).
- Keep the section purely additive — no changes to existing calendar behavior.

**Ask first:**
- Any change to `seasonality.json` schema or the quinzaine encoding.
- Adding a new URL parameter to `/calendrier/` or `/recherche/`.
- Introducing a JS dependency.

**Never:**
- Duplicate the seasonality data or category constants.
- Cap or truncate the lists silently (user chose "show everything").
- Write collapse or filter state to the URL (localStorage only).
- Modify the main calendar rendering path.
