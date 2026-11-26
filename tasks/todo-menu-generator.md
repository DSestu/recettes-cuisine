# Todo: Seasonal menu generator

Spec: `SPEC-menu-generator.md`. Plan: `tasks/plan-menu-generator.md`.

## Task 1: Generator adds course, servings and ingredient lines

**Description:** Extend `scripts/generate_recipe_seasonality.py` so each recipe entry
carries `courses` (derived from tags per spec §3.5), `servings`, and raw `ingredients`
lines; strip whitespace from slugs. Regenerate the JSON.

**Acceptance criteria:**
- [ ] Every recipe has `courses` ⊆ {entree, plat, dessert}, `servings` (int), `ingredients` (list of str)
- [ ] No slug or URL contains leading/trailing whitespace
- [ ] Existing fields unchanged; "Recettes de saison" mode still renders

**Verification:**
- [ ] `uv run python scripts/generate_recipe_seasonality.py` succeeds
- [ ] Spot check: `soupe_au_chou` → courses [entree, plat], servings 6, 13 ingredient lines
- [ ] Course counts roughly match tags (entree ≈ 32+, plat ≈ 100+, dessert ≈ 28+)

**Dependencies:** None
**Files:** `scripts/generate_recipe_seasonality.py`, `assets/data/recipe-seasonality.json`
**Scope:** S

## Task 2: Pure menu picker with tests

**Description:** Create `assets/js/menu-picker.js`: `pickWeight`, eligibility with the
§3.4 fallback chain, seeded weighted pick, menu fill respecting locks, no duplicates,
soft "different lead ingredient" rule, and per-slot seen sets. Candidates come in
pre-scored; no DOM.

**Acceptance criteria:**
- [ ] Same seed → same menu; locked slots never change on reroll or full refill
- [ ] Reroll never repeats a slot's seen recipe until its pool is exhausted, then resets
- [ ] Course filter, `score = null` exclusion and empty-pool fallback behave per spec

**Verification:**
- [ ] `node tests/test_menu_picker.js` passes
- [ ] 200 seeded Surprise rolls on the real nov-2 data: ≥ 70 % of picks have `nTemporal ≥ 2`
- [ ] Sweep of 24 fortnights × 3 modes: every slot filled, no duplicate in a menu

**Dependencies:** None (uses T1 data only for the realistic test)
**Files:** `assets/js/menu-picker.js`, `tests/test_menu_picker.js`
**Scope:** S

## Checkpoint A
- [ ] `node tests/test_menu_picker.js`, `node tests/test_scaler_dom.js`, `node tests/test_scaler_rendering.js`, `uv run pytest` all pass
- [ ] JSON diff reviewed

## Task 3: Menu mode shell and Surprise cards

**Description:** Add the "Menu" button to the mode toggle, a `#calendrier-menu`
section, the Surprise/Repas/Semaine switch, the "Nouveau menu" button, and render 4
Surprise cards (photo, score pill, time, difficulty, in-season peak ingredients) for
the selected quinzaine. Styles ported from the mockup. Buttons visible but not wired yet.

**Acceptance criteria:**
- [ ] `?affichage=menu` shows 4 Surprise cards matching the mockup at 1280 and 390 px
- [ ] Mode toggle switches between all three modes; others render exactly as before
- [ ] Quinzaine arrows re-render the cards for the new fortnight

**Verification:**
- [ ] Jekyll build succeeds; page loads with no console errors
- [ ] `impeccable shot` of `/calendrier/?affichage=menu` at 1280x900 and 390x844 compared to mockup

**Dependencies:** T1, T2
**Files:** `calendrier.html`, `assets/js/calendrier.js`
**Scope:** M

## Task 4: Slot actions and URL state

**Description:** Wire Relancer, Garder and Nouveau menu; quinzaine change rerolls
unlocked slots; write `menu-mode`, `menu`, `menu-garde` with `replaceState`, fire the
QR hook, restore on load and on popstate; fall back silently on bad params.

**Acceptance criteria:**
- [ ] Reload with the URL restores the same cards and locks
- [ ] Locked cards survive Relancer elsewhere, Nouveau menu and quinzaine change
- [ ] `?menu=bogus,…` or `?menu-mode=xyz` → fresh picks / Surprise, no error

**Verification:**
- [ ] Manual browser pass of the 3 criteria above
- [ ] Back button after a mode switch restores the previous view

**Dependencies:** T3
**Files:** `assets/js/calendrier.js`
**Scope:** S

## Checkpoint B (review with you)
- [ ] Surprise works end to end at 1280 and 390 px
- [ ] Ingrédients and Recettes de saison unchanged

## Task 5: Repas mode

**Description:** Three typed slots (Entrée, Plat, Dessert) in the menu-card layout,
filled from course pools; the sparse-pool note appears when a course fell back below
the 0.4 threshold.

**Acceptance criteria:**
- [ ] Each slot only ever holds a recipe of its course; no recipe twice
- [ ] Note shows on the dessert slot at nov-2 (2 eligible desserts) and not on entrée/plat
- [ ] Layout matches the mockup at 1280 and 390 px

**Verification:**
- [ ] Manual: 20 Nouveau menu clicks at nov-2, no course mismatch
- [ ] Screenshots at both widths

**Dependencies:** T4
**Files:** `assets/js/calendrier.js`, `calendrier.html`
**Scope:** S

## Task 6: Semaine mode and shopping list

**Description:** Seven day slots (Lundi…Dimanche) from the plat pool, plus the
shopping list: ingredient lines grouped per recipe with servings and count, checkboxes
(in-page only), collapsible groups, and Copier (plain text to clipboard, with a
"Copié" confirmation).

**Acceptance criteria:**
- [ ] 7 distinct plats; list shows every line of each recipe, grouped, in day order
- [ ] Rerolling a day updates its list group; checked state resets for that group only
- [ ] Copier puts the full list on the clipboard as plain text

**Verification:**
- [ ] Manual: copy, paste into a text editor, line count matches the header count
- [ ] Screenshots at both widths (list below days on mobile)

**Dependencies:** T4 (T1 for ingredient lines)
**Files:** `assets/js/calendrier.js`, `calendrier.html`
**Scope:** M

## Task 7: States, accessibility, review and close-out

**Description:** Empty-pool state, focus rings, 44 px targets, `aria-pressed` on
Garder, alt text, reduced motion; run Impeccable detector and finish review; mark the
spec delta implemented and fold it into `SPEC.md`.

**Acceptance criteria:**
- [ ] Keyboard-only: every action reachable and visibly focused
- [ ] `impeccable detect` clean or findings resolved; finish reviewer verdict "ship"
- [ ] `SPEC-menu-generator.md` status `implemented`; `SPEC.md` mentions the Menu mode

**Verification:**
- [ ] `impeccable detect --json --changed`
- [ ] Spec success criteria 1–8 checked one by one

**Dependencies:** T5, T6
**Files:** `calendrier.html`, `assets/js/calendrier.js`, `SPEC-menu-generator.md`, `SPEC.md`
**Scope:** M

## Checkpoint C
- [ ] All spec success criteria met
- [ ] Diff shown to you; commit only when you say "commit"
