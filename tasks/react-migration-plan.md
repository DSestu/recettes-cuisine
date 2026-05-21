# Implementation Plan: Migration Jekyll → React + TypeScript + Vite

## Overview

Full rewrite of the recipe site from Jekyll/Liquid/vanilla-JS to React 18 + TypeScript + Vite, deployed to GitHub Pages via GitHub Actions. The `.md` recipe files, `images/`, and the Python image pipeline are untouched. Feature parity with the current site is the exit criterion; Phase 2 features (cart, owned ingredients, etc.) are scaffolded at the end.

---

## Architecture Decisions

- **`app/` subfolder** — React app lives alongside Jekyll files during migration; Jekyll removed in a cleanup commit after parity validation.
- **HashRouter** — avoids GitHub Pages 404 SPA problem entirely (`/#/`, `/#/recette/:slug`, `/#/recherche`).
- **`import.meta.glob` + `gray-matter`** — recipes and components loaded at build time from `.md` files; zero content migration.
- **Zustand** over Redux — solo project, `localStorage` persistence built-in, Redux migration is mechanical if ever needed.
- **Framer Motion** over View Transitions API — solves the iOS/Android compatibility issues already discovered; CSS transitions.css replaced.
- **D3 owned subtree** — the force graph uses a `useRef` div that React never touches; D3 mounts/updates it imperatively inside a single `useEffect`.
- **No barrel exports** — components imported from their source path directly to avoid hidden circular dependencies.

---

## Dependency Graph

```
Vite config + Tailwind config
        │
        └── TypeScript types (Recipe, Component, Tag, Category)
                │
                └── Data loaders (recipes.ts, components.ts, tags.ts, categories.ts)
                        │
                        ├── App shell (main.tsx, HashRouter, AppLayout)
                        │       │
                        │       ├── Nav component (mobile bottom bar + desktop sidebar)
                        │       │
                        │       └── Framer Motion AnimatePresence wrapper
                        │
                        ├── RecipeCard component
                        │       │
                        │       └── HomePage (categories + CategorySection + ColsSelector + HomeSearch)
                        │
                        ├── RecipePage
                        │       ├── HeroImage (fixed mobile / sticky desktop)
                        │       ├── IngredientList
                        │       ├── MarkdownRenderer
                        │       ├── ComponentComposition (resolves _components/*.md)
                        │       └── QRModal + ImageZoom
                        │
                        ├── Search algorithms hook (port from search-page.js)
                        │       │
                        │       └── D3ForceGraph component
                        │               │
                        │               └── SearchPage (tag filter + tolerance + results grids)
                        │
                        ├── PWA (public/manifest.json + public/serviceworker.js)
                        │
                        └── Zustand stores (cart, owned, favorites)
```

---

## Phase 1 — Foundation

### Task 1: Scaffold `app/` with Vite + React + TypeScript + Tailwind

**Description:** Create the `app/` directory with a working Vite project. Tailwind configured with the existing palette (primary `#F53200`, `font-gelica`, Inter). Vite `base` set to `/recettes-cuisine/`. Empty `src/main.tsx` that renders `<div>hello</div>`. `npm run build` must produce a `dist/` that is deployable.

**Acceptance criteria:**
- [ ] `cd app && npm run build` exits 0, produces `dist/index.html`
- [ ] `npm run dev` serves at localhost with HMR
- [ ] Tailwind class `text-primary` resolves to `#F53200`
- [ ] Typekit font (`htf0jhw.css`) + Google Inter loaded in `index.html`
- [ ] TypeScript strict mode enabled (`tsconfig.json` `"strict": true`)

**Verification:**
- [ ] `npm run build` exits 0
- [ ] `npx tsc --noEmit` exits 0

**Dependencies:** None

**Files:**
- `app/package.json`, `app/vite.config.ts`, `app/tailwind.config.ts`
- `app/tsconfig.json`, `app/index.html`, `app/src/main.tsx`
- `app/src/index.css` (Tailwind directives + base font imports)

**Scope:** M

---

### Task 2: TypeScript types + data loaders

**Description:** Define the full TypeScript type system for `Recipe`, `Component`, `Tag`, `Category`, and `HomeCategory`. Implement `src/data/recipes.ts`, `src/data/components.ts`, `src/data/tags.ts`, `src/data/categories.ts` using `import.meta.glob` + `gray-matter`. Handle both directions formats (YAML `directions:` list and Markdown body). All 85 recipes and 22 components must parse without error.

**Acceptance criteria:**
- [ ] `recipes` export contains all 85 recipes with correct slug, title, image, tags, ingredients
- [ ] `components` export contains all 22 components, correctly resolved
- [ ] Recipes with YAML `directions:` and those with Markdown body both parse correctly
- [ ] Recipes with `components:` list resolve to their component slugs
- [ ] `tags` export contains all entries from `_data/recipe_tags.yml`
- [ ] `categories` export contains all entries from `home_categories.md` frontmatter
- [ ] No TypeScript errors (`npx tsc --noEmit`)

**Verification:**
- [ ] `npm run build` exits 0
- [ ] Add a temporary `console.log(recipes.length)` — must print 85

**Dependencies:** Task 1

**Files:**
- `app/src/types/index.ts`
- `app/src/data/recipes.ts`, `components.ts`, `tags.ts`, `categories.ts`

**Scope:** M

---

### Checkpoint 1 — Foundation
- [ ] `npm run build` exits 0 from `app/`
- [ ] `npx tsc --noEmit` exits 0
- [ ] All 85 recipes and 22 components parsed without error
- [ ] Human review before proceeding

---

## Phase 2 — App Shell & Navigation

### Task 3: App shell + Nav component

**Description:** Wire up `HashRouter` with three route stubs (`/`, `/recette/:slug`, `/recherche`). Implement `Nav` with the exact current visual design: mobile bottom bar (fixed, hide-on-scroll-down, show-on-scroll-up, safe-area padding) and desktop sidebar strip (hover-to-expand panel, 14rem wide, edge strip affordance). Port the nav HTML and CSS from `_includes/head.html` and `_layouts/default.html` to a single `Nav.tsx` component and companion CSS-in-Tailwind.

**Acceptance criteria:**
- [ ] All three routes render their stub pages
- [ ] Mobile nav hides on scroll down, reappears on scroll up and at top
- [ ] Desktop sidebar expands on hover, collapses when mouse leaves
- [ ] Active route link highlighted (primary color)
- [ ] Nav appears identically to the current Jekyll site at 375px and 1280px viewports

**Verification:**
- [ ] `npm run build` exits 0
- [ ] Manual: open in browser at both viewports, compare to current site visually

**Dependencies:** Task 2

**Files:**
- `app/src/components/Nav.tsx`
- `app/src/components/AppLayout.tsx`
- `app/src/pages/HomePage.tsx` (stub), `RecipePage.tsx` (stub), `SearchPage.tsx` (stub)
- `app/src/main.tsx` (updated)

**Scope:** M

---

### Task 4: Framer Motion page transitions

**Description:** Wrap routes in `AnimatePresence`. Implement two transitions: home→recipe (hero image slides/expands, content fades in from right) and recipe→home (reverse). Other route changes: simple fade. Replaces `assets/js/transitions.js` + `assets/css/transitions.css` entirely.

**Acceptance criteria:**
- [ ] Home → recipe shows hero slide + content fade-in
- [ ] Recipe → home shows reverse transition
- [ ] Home → search / search → home: simple fade
- [ ] No flash of unstyled content on transition
- [ ] Transitions work on iOS Safari and Android WebView (Framer Motion fallback handles missing APIs)
- [ ] `prefers-reduced-motion` disables animations

**Verification:**
- [ ] Manual: navigate home→recipe→home, verify animation fires both ways
- [ ] Manual: verify no jank on mobile viewport

**Dependencies:** Task 3

**Files:**
- `app/src/components/PageTransition.tsx`
- `app/src/main.tsx` (AnimatePresence wrapper)

**Scope:** S

---

### Checkpoint 2 — Shell
- [ ] Can navigate between all three stub pages with transitions
- [ ] Nav renders correctly on mobile and desktop
- [ ] Human review before proceeding

---

## Phase 3 — Home Page

### Task 5: RecipeCard component

**Description:** Implement `RecipeCard` displaying the card thumbnail (`images/card/<slug>.webp`), recipe title, and first 3 tags as pills. Match current card design exactly (rounded corners, shadow, hover scale, orange-50 background, primary color accents). Also implement the `RecipeCardSkeleton` for loading states.

**Acceptance criteria:**
- [ ] Card shows thumbnail, title, and up to 3 tag pills
- [ ] Hover: subtle scale transform
- [ ] Clicking navigates to `/#/recette/:slug`
- [ ] Missing image (no WebP file) degrades gracefully (placeholder color)
- [ ] `view-transition-name: vt-hero-<slug>` set on the image for Framer Motion coordination

**Verification:**
- [ ] `npm run build` exits 0
- [ ] Visual: render a RecipeCard in isolation with a known recipe

**Dependencies:** Task 3

**Files:**
- `app/src/components/RecipeCard.tsx`

**Scope:** S

---

### Task 6: HomePage with categories and ColsSelector

**Description:** Implement `HomePage` rendering all categories from `home_categories.md` each as a `CategorySection` with a grid of `RecipeCard`s. Recipes are assigned to categories using the same tag-matching logic as the current `home.js`. The `others` category shows recipes not matched by any other. Implement `ColsSelector` (2-5 cols, desktop only, URL `?cols=N` parameter) using CSS custom property `--cols`, matching the current `cols-selector.js` behavior.

**Acceptance criteria:**
- [ ] All categories render with correct recipes in each
- [ ] `others` section contains all unmatched recipes
- [ ] ColsSelector changes grid columns live, persists in URL hash query (`/#/?cols=3`)
- [ ] Mobile always shows 2 columns regardless of selector
- [ ] Category order matches `home_categories.md` exactly

**Verification:**
- [ ] Count recipes per category, compare to current Jekyll site
- [ ] Manual: verify ColsSelector at desktop viewport

**Dependencies:** Task 5

**Files:**
- `app/src/pages/HomePage.tsx`
- `app/src/components/CategorySection.tsx`
- `app/src/components/ColsSelector.tsx`

**Scope:** M

---

### Task 7: HomeSearch

**Description:** Port the home search from `home.js` to a `useHomeSearch` hook. Implements: title fuzzy match (`fuzzyContains`), subsequence match, search result highlighting, clear button, result count. The search filters recipe cards in-place across all category sections. Bonus: the orange gradient banner linking to advanced search.

**Acceptance criteria:**
- [ ] Typing in the search box filters recipe cards in real time
- [ ] Fuzzy match and subsequence match work (matches "carbo" → "Carbonara")
- [ ] Clear button empties search and restores all cards
- [ ] Result count updates correctly
- [ ] Cmd/Ctrl+F focuses the search input
- [ ] Banner with link to `/#/recherche` renders at top of page

**Verification:**
- [ ] Search "poulet" → only chicken recipes visible
- [ ] Search "xyzqwerty" → zero results shown

**Dependencies:** Task 6

**Files:**
- `app/src/hooks/useHomeSearch.ts`
- `app/src/pages/HomePage.tsx` (updated)

**Scope:** M

---

### Checkpoint 3 — Home Page
- [ ] Homepage renders all 85 recipes in correct categories
- [ ] HomeSearch filters correctly
- [ ] ColsSelector works on desktop
- [ ] Lighthouse mobile performance ≥ current score
- [ ] Human review before proceeding

---

## Phase 4 — Recipe Detail Page

### Task 8: RecipePage — layout, hero, ingredients, Markdown

**Description:** Implement `RecipePage` as a two-panel layout: left panel = hero image (aspect-video on mobile with fixed positioning + scroll-over effect; sticky full-height on desktop), right panel = scrollable article. Port the complex CSS from `recipe.html` for both breakpoints. Render the `MarkdownRenderer` for the body (Markdown body recipes) or ordered steps list (legacy YAML `directions:` recipes). Render `IngredientList`.

**Acceptance criteria:**
- [ ] Desktop: left panel sticky, right panel scrolls independently
- [ ] Mobile: hero image fixed at top, article scrolls over it (current scroll behavior, iOS fixed)
- [ ] Image zoom (fullscreen overlay) triggered by tap on mobile hero
- [ ] Markdown body renders with correct Tailwind prose styling
- [ ] Legacy `directions:` YAML list renders as a `<ul>` of steps
- [ ] Inline images in Markdown body work (`../images/<slug>/<step>.webp`)
- [ ] Back button navigates to `/#/`
- [ ] Schema.org `itemscope itemtype="Recipe"` attributes present

**Verification:**
- [ ] Navigate to 3 different recipes (one with Markdown body, one with YAML directions, one with inline images)
- [ ] Test on mobile viewport: scroll behavior matches current site

**Dependencies:** Task 4, Task 2

**Files:**
- `app/src/pages/RecipePage.tsx`
- `app/src/components/HeroImage.tsx`
- `app/src/components/IngredientList.tsx`
- `app/src/components/MarkdownRenderer.tsx`

**Scope:** L

---

### Task 9: ComponentComposition

**Description:** When a recipe has a `components:` list, resolve each component title to a `_components/*.md` file (match by `title` frontmatter field). Render each resolved component inline in the recipe page: its own ingredient list + directions, with a visual separator and the component title as a sub-heading. Port behavior from `recipe.html` Liquid template.

**Acceptance criteria:**
- [ ] Recipe with `components:` list shows each sub-recipe inline
- [ ] Each component's ingredients and directions render correctly
- [ ] Component with YAML `directions:` and with Markdown body both work
- [ ] Unresolved component names (no matching file) show a warning but don't crash

**Verification:**
- [ ] Navigate to a recipe with components (e.g., `ankake_sauce` references `Dashi`)
- [ ] Component renders inline with its own ingredient list

**Dependencies:** Task 8

**Files:**
- `app/src/components/ComponentComposition.tsx`
- `app/src/pages/RecipePage.tsx` (updated)

**Scope:** S

---

### Task 10: QR Modal + Image Zoom lightbox

**Description:** Port `qr.js` and the QR modal HTML from `default.html` to a `QRModal` React component. The modal shows a QR code for the current page URL. On mobile recipe pages, tapping the hero image opens a fullscreen `ImageZoom` overlay (the lens-button behavior from `recipe.html`). Both use Framer Motion for open/close animation.

**Acceptance criteria:**
- [ ] QR button visible on all pages (top-right on mobile, sidebar on desktop)
- [ ] QR modal opens/closes with fade animation
- [ ] QR code renders correctly for the current page URL
- [ ] Mobile recipe page: tapping hero opens fullscreen image overlay
- [ ] Overlay closes on tap or Escape key

**Verification:**
- [ ] Open QR modal, scan code with phone — should navigate to the recipe

**Dependencies:** Task 8

**Files:**
- `app/src/components/QRModal.tsx`
- `app/src/components/ImageZoom.tsx`

**Scope:** S

---

### Checkpoint 4 — Recipe Flow
- [ ] Can navigate home → recipe → home with transitions
- [ ] All 85 recipes render without error (automated: iterate all slugs)
- [ ] Mobile scroll behavior correct on at least one iOS device/emulator
- [ ] Human review before proceeding

---

## Phase 5 — Search Page

### Task 11: Search algorithm hooks

**Description:** Extract all pure search logic from `search-page.js` (2889 lines) into typed TypeScript hooks and utilities. Functions to port: `normalizeBasic`, `normalize`, `isSubsequence`, `singularize`, `levenshtein`, `fuzzyContains`, `buildCanonicalMap`, the ingredient tokenizer, and the main recipe scoring function. Write Vitest unit tests for each function with edge cases.

**Acceptance criteria:**
- [ ] All ported functions are TypeScript with no `any`
- [ ] Vitest tests cover: exact match, fuzzy match, no match, French diacritics, singular/plural, stopword filtering
- [ ] `normalizeBasic('Épaisse')` returns `'epaisse'`
- [ ] `levenshtein('chat', 'chats')` returns `1`
- [ ] `buildCanonicalMap` produces the same deduplicated vocabulary as the current JS

**Verification:**
- [ ] `npm test` passes all search algorithm tests

**Dependencies:** Task 2

**Files:**
- `app/src/utils/search.ts`
- `app/src/hooks/useSearch.ts`
- `app/src/utils/search.test.ts`

**Scope:** M

---

### Task 12: D3ForceGraph React component

**Description:** Wrap the D3 force graph from `recherche.html` / `search-page.js` in a `D3ForceGraph` React component. D3 owns a `ref` div; React never touches its children. The component receives recipes and selected tags as props and calls back `onTagSelect`. Port all current force graph behaviors: node colors, link strengths, drag, zoom, fullscreen toggle, mobile touch support.

**Acceptance criteria:**
- [ ] Force graph renders with recipe nodes and tag nodes
- [ ] Clicking a tag node selects/deselects it (callback fires)
- [ ] Dragging nodes works on desktop and mobile
- [ ] Zoom in/out works
- [ ] Fullscreen toggle works
- [ ] Graph updates when selected tags change (re-highlights, doesn't re-mount)
- [ ] No React warnings about DOM mutations

**Verification:**
- [ ] Open search page, interact with graph at desktop and mobile viewport

**Dependencies:** Task 11

**Files:**
- `app/src/components/D3ForceGraph.tsx`

**Scope:** M

---

### Task 13: SearchPage UI

**Description:** Implement `SearchPage` with the full three-panel layout: tag suggestion list (left), D3 force graph (center), results grid + reco grid (right). Port all state from `search-page.js`: selected tags, tolerance slider, ingredient mode toggle, title search, tag-based search, recipe scoring, recommendation logic. All UI text stays in French.

**Acceptance criteria:**
- [ ] Tag suggestion input filters available tags in real time
- [ ] Selected tags shown as removable pills
- [ ] Tolerance slider (0-3) changes fuzzy match threshold
- [ ] Ingredient mode toggle switches between tag mode and ingredient mode
- [ ] Results grid shows matching recipes with score indicator
- [ ] Reco grid shows similar recipes
- [ ] ColsSelector applies to both grids
- [ ] Mobile back button with scroll-hide behavior

**Verification:**
- [ ] Select "poulet" + "creme" → recipe results update correctly
- [ ] Compare results to current Jekyll site for same tag combination

**Dependencies:** Task 12, Task 5

**Files:**
- `app/src/pages/SearchPage.tsx`
- `app/src/components/TagFilter.tsx`
- `app/src/components/ToleranceSlider.tsx`

**Scope:** L

---

### Checkpoint 5 — Search Page
- [ ] Search page fully functional (tag filter, force graph, results)
- [ ] Results match current site for identical inputs
- [ ] All Vitest tests pass (`npm test`)
- [ ] Human review before proceeding

---

## Phase 6 — PWA, Meta, Deployment

### Task 14: PWA — service worker + manifest

**Description:** Copy `manifest.json` and `serviceworker.js` from repo root into `app/public/`. Register the service worker in `main.tsx` with the same logic as the current `head.html`. Verify the app is installable as a PWA.

**Acceptance criteria:**
- [ ] `manifest.json` accessible at `/recettes-cuisine/manifest.json`
- [ ] Service worker registers without errors
- [ ] Chrome DevTools → Application → PWA: "Installable" green check
- [ ] Offline: previously visited pages load from cache

**Verification:**
- [ ] `npm run build` and serve `dist/` locally; check PWA installability in DevTools

**Dependencies:** Task 3

**Files:**
- `app/public/manifest.json` (copy)
- `app/public/serviceworker.js` (copy)
- `app/src/main.tsx` (service worker registration)

**Scope:** S

---

### Task 15: Per-recipe OG / Twitter meta tags

**Description:** Inject OG and Twitter meta tags per route using a `useDocumentMeta` hook (or React Helmet). Recipe pages set: `og:title`, `og:description` (first 160 chars of content), `og:image` (`/images/hero/<slug>.webp`), `twitter:card: summary_large_image`. Home and search pages get site-level defaults.

**Acceptance criteria:**
- [ ] `<meta property="og:image">` on recipe page resolves to the correct hero image
- [ ] `<title>` updates when navigating between recipes
- [ ] No duplicate meta tags

**Verification:**
- [ ] Open a recipe, inspect `<head>` in DevTools — all OG tags present with correct values

**Dependencies:** Task 8

**Files:**
- `app/src/hooks/useDocumentMeta.ts`
- `app/src/pages/RecipePage.tsx` (updated), `HomePage.tsx` (updated), `SearchPage.tsx` (updated)

**Scope:** S

---

### Task 16: GitHub Actions deployment

**Description:** Create `.github/workflows/deploy.yml`. On push to `main`: checkout, `npm ci` in `app/`, `npm run build`, publish `app/dist/` to the `gh-pages` branch using `peaceiris/actions-gh-pages@v4`. Copy `images/`, `icons/`, and `CNAME` into `app/public/` (or symlink) so they end up in `dist/`.

**Acceptance criteria:**
- [ ] Push to `main` triggers the workflow
- [ ] `app/dist/` is deployed to `gh-pages` branch
- [ ] `https://dsestu.github.io/recettes-cuisine/` serves the React app
- [ ] `CNAME` present in `dist/` so custom domain is preserved
- [ ] `images/` accessible at `/recettes-cuisine/images/card/*.webp`

**Verification:**
- [ ] Push a trivial change to `main`, watch Actions run green, visit live URL

**Dependencies:** Task 1

**Files:**
- `.github/workflows/deploy.yml`
- `app/public/` (symlinks or copies of `images/`, `icons/`, `CNAME`, `manifest.json`)

**Scope:** S

---

### Checkpoint 6 — Live on GitHub Pages
- [ ] Site live at `https://dsestu.github.io/recettes-cuisine/`
- [ ] All 85 recipes accessible
- [ ] Search page functional
- [ ] PWA installable
- [ ] All Lighthouse scores ≥ current site
- [ ] Human sign-off: parity confirmed → Jekyll cleanup commit

---

## Phase 7 — Zustand Stores (Phase 2 preparation)

### Task 17: Cart, owned, and favorites stores

**Description:** Implement three Zustand stores with `persist` middleware → `localStorage`. `cartStore`: list of `{ recipeSlug, ingredient }`. `ownedStore`: list of ingredient strings (user always has these). `favoritesStore`: list of recipe slugs. No UI yet — just the stores, their TypeScript types, and Vitest unit tests covering add/remove/clear/persistence.

**Acceptance criteria:**
- [ ] All three stores persist across page reload
- [ ] Cart: add, remove by (slug+ingredient), remove all for a recipe, clear
- [ ] Owned: add, remove, toggle
- [ ] Favorites: add, remove, toggle, `isFavorite(slug)` selector
- [ ] No TypeScript errors
- [ ] Vitest tests cover all store actions and persistence

**Verification:**
- [ ] `npm test` passes all store tests
- [ ] Manual: add a favorite, reload page, verify it persists

**Dependencies:** Task 2

**Files:**
- `app/src/store/cart.ts`
- `app/src/store/owned.ts`
- `app/src/store/favorites.ts`
- `app/src/store/*.test.ts`

**Scope:** M

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| `gray-matter` YAML parsing failure on some recipes (special chars, multi-line values) | High | Validate all 85+22 files in Task 2; fix edge cases before proceeding |
| D3 + React DOM conflict (React reconciler vs D3 imperartive mutations) | High | D3 owns its `ref` div entirely; React never renders children into it |
| Recipe page CSS complexity (1225 lines, fixed/sticky split-pane) | High | Port CSS directly from `recipe.html`; test on both breakpoints before Checkpoint 4 |
| `search-page.js` port scope (2889 lines) | Medium | Split into Task 11 (algorithms, unit-tested) and Task 13 (UI); algorithms are pure functions that are easy to test |
| GitHub Pages `base` URL mismatch (`/recettes-cuisine/`) | Medium | Set `base: '/recettes-cuisine/'` in `vite.config.ts` from Task 1; test with `vite preview` |
| Framer Motion + HashRouter interaction (AnimatePresence key strategy) | Low | Use `location.hash` as key; well-documented pattern |

## Open Questions

- Should `images/` be symlinked into `app/public/` (avoids duplication but requires CI to dereference symlinks) or copied in the CI step? Recommend: copy in CI (`cp -r images app/public/images`), symlink in dev.
- Service worker caching strategy: does the current `serviceworker.js` use a cache-first or network-first strategy? Read before Task 14 to preserve behavior.
