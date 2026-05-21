# SPEC — Migration Jekyll → React + TypeScript + Vite

## 1. Objective

Migrate the recipe site from Jekyll/Liquid/vanilla-JS to a React + TypeScript + Vite stack, hosted on GitHub Pages via GitHub Actions. The migration must preserve the existing content model (`.md` files with YAML frontmatter), the visual design, and the Python image pipeline. It unlocks richer interactive features: shopping cart, owned-ingredient tracking, batch cooking suggestions, and improved search UX.

**Target users:** Solo owner (David). Personal recipe site.

---

## 2. Core features — scope of this migration

### Must ship with migration (feature parity)
- [ ] Homepage with category sections and per-recipe cards, home search, cols selector
- [ ] Recipe detail page (hero image, ingredients, Markdown directions, component composition)
- [ ] Advanced search page (D3 force-graph, tag filter, tolerance slider, ingredient mode)
- [ ] Navigation (mobile bottom bar, desktop sidebar strip)
- [ ] View Transitions between pages (Framer Motion, replacing `transitions.js`)
- [ ] QR code modal
- [ ] PWA / service worker
- [ ] OG / Twitter meta tags per recipe

### Phase 2 features (after parity)
- [ ] Shopping cart (add/remove ingredients across recipes)
- [ ] Owned-ingredients list with favorites (persisted to `localStorage`)
- [ ] Cart delta: what I have vs. what I need to buy
- [ ] Batch cooking feature
- [ ] Constraint optimization / recipe planning
- [ ] Seasonal ingredient suggestions
- [ ] Home search: tag-mode toggle + priority distinction (title match vs tag match)
- [ ] Advanced search: show-all-tags toggle in tag suggestion list
- [ ] Search page: smooth tag add/remove animations (Framer Motion)

---

## 3. Tech stack

| Concern | Choice | Rationale |
|---|---|---|
| Framework | React 18 + TypeScript | Component model needed for stateful features |
| Build | Vite | Fast HMR, `import.meta.glob` for `.md` loading |
| Styling | Tailwind CSS v3 | Already in use, zero visual change |
| State | Zustand + `persist` middleware | Cart/favorites/owned; simple, `localStorage`-backed, migration to Redux is mechanical if needed |
| Routing | React Router v6 (`HashRouter`) | GitHub Pages SPA compatible without 404 redirect hack |
| Animations | Framer Motion | Replaces `transitions.js` + `transitions.css`; handles iOS/Android edge cases |
| Data visualization | D3 (keep as-is) | Force graph in search; wrap in a React ref-based component |
| Markdown parsing | `gray-matter` + `marked` (or `remark`) | Parse `.md` frontmatter + body at build time via Vite glob |
| Testing | Vitest + React Testing Library | Co-located with Vite, no separate jest config |
| Fonts | Keep Typekit `htf0jhw.css` + Google Inter | No change |
| Hosting | GitHub Pages via GitHub Actions | Free, same as today |

---

## 4. Project structure

```
/                          ← repo root (Jekyll files stay during transition)
├── app/                   ← new React app (Vite root)
│   ├── src/
│   │   ├── components/    ← shared UI (RecipeCard, Nav, HeroImage, …)
│   │   ├── pages/         ← route-level components (Home, Recipe, Search, …)
│   │   ├── store/         ← Zustand stores (cart.ts, owned.ts, favorites.ts)
│   │   ├── data/          ← Vite glob loaders for recipes & components
│   │   │   ├── recipes.ts ← import.meta.glob('../../_recipes/*.md')
│   │   │   └── tags.ts    ← import ../../_data/recipe_tags.yml
│   │   ├── types/         ← Recipe, Component, Tag, Category TypeScript types
│   │   ├── hooks/         ← useRecipes, useSearch, useCart, …
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── _recipes/              ← unchanged .md source files
├── _components/           ← unchanged .md source files
├── _data/                 ← unchanged YAML (recipe_tags.yml, etc.)
├── images/                ← unchanged WebP derivatives
├── scripts/               ← unchanged Python image pipeline
├── .pre-commit-config.yaml ← unchanged
└── .github/
    └── workflows/
        └── deploy.yml     ← build app/ and push dist/ to gh-pages branch
```

The Jekyll files (`_config.yml`, `_layouts/`, `_includes/`, `Gemfile`) stay in place during the migration and are removed in a cleanup commit once the React app is shipped and validated.

---

## 5. Content model (unchanged)

Recipe `.md` files are the single source of truth. At build time, Vite loads them via `import.meta.glob` + `gray-matter`:

```ts
// src/data/recipes.ts
import matter from 'gray-matter'

const modules = import.meta.glob('../../_recipes/*.md', { as: 'raw', eager: true })

export const recipes: Recipe[] = Object.entries(modules).map(([path, raw]) => {
  const { data, content } = matter(raw)
  const slug = path.split('/').pop()!.replace('.md', '')
  return { slug, ...data, content } as Recipe
})
```

No migration of recipe files. YAML frontmatter and Markdown body are consumed as-is.

---

## 6. Routing

Using `HashRouter` to avoid the GitHub Pages SPA 404 problem:

| URL | Page |
|---|---|
| `/#/` | Home |
| `/#/recette/:slug` | Recipe detail |
| `/#/recherche` | Advanced search |

**`baseurl`:** Vite `base: '/recettes-cuisine/'` in `vite.config.ts`.

---

## 7. State management

```ts
// store/cart.ts
interface CartStore {
  items: { recipeSlug: string; ingredient: string }[]
  add: (recipeSlug: string, ingredient: string) => void
  remove: (recipeSlug: string, ingredient: string) => void
  clear: () => void
}
```

All stores use `persist` middleware → `localStorage`. No backend, no auth. Multi-device sync is out of scope.

Stores to implement:
- `cart` — ingredients added from recipe pages
- `owned` — ingredients the user always has (favorites baseline)
- `favorites` — bookmarked recipes

---

## 8. Image pipeline (unchanged)

The Python pre-commit scripts (`generate_card_thumbnails.py`, `generate_hero_images.py`, `generate_full_images.py`) run exactly as today. The React app references the same `images/` folder:

```tsx
<img src={`${base}/images/card/${recipe.slug}.webp`} />
<img src={`${base}/images/hero/${recipe.slug}.webp`} />
```

No change to the ComfyUI workflow, WebP encoding, or pre-commit hooks.

---

## 9. GitHub Actions deployment

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: cd app && npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: app/dist
```

The `images/`, `icons/`, `manifest.json`, `serviceworker.js` assets are copied into `app/public/` (or symlinked) so Vite includes them in `dist/`.

---

## 10. Code style

- TypeScript strict mode (`"strict": true`)
- No `any` — use proper types or `unknown`
- Tailwind classes only (no inline styles except dynamic values like `style={{ '--cols': n }}`)
- Components: function components only, no class components
- File naming: `PascalCase` for components, `camelCase` for hooks/utils
- No barrel `index.ts` re-exports (import directly from source file)
- Comments only when the WHY is non-obvious

---

## 11. Testing strategy

- **Unit:** Vitest for pure functions (tag normalization, recipe filtering, cart store)
- **Component:** React Testing Library for RecipeCard, Nav, search filter logic
- **E2E:** Playwright for the two critical paths: home → recipe navigation, search page tag filter
- No snapshot tests

Run: `npm test` (Vitest) and `npm run test:e2e` (Playwright)

---

## 12. Boundaries

**Always:**
- Keep all `.md` recipe files, YAML frontmatter, and `_data/` unchanged
- Keep the Python image pipeline and pre-commit hooks unchanged
- Keep the existing visual design (colors: `primary: #F53200`, `bg-orange-50`, Inter + Gelica fonts)
- Keep all user-visible text in French
- GitHub Pages compatible at every commit on the branch

**Ask first:**
- Before changing URL structure (even hash-based)
- Before adding a backend or external API dependency
- Before changing the Tailwind config's color palette
- Before removing any feature from the parity checklist

**Never:**
- Commit recipe content changes as part of this migration
- Use `any` in TypeScript
- Add server-side rendering (incompatible with GitHub Pages)
- Break the pre-commit image pipeline

---

## 13. Acceptance criteria — feature parity

- [ ] All 85 recipes render correctly (title, image, ingredients, Markdown body, components)
- [ ] Home page categories match current site exactly
- [ ] Search page D3 force graph renders and filters correctly
- [ ] Navigation works on mobile (bottom bar) and desktop (sidebar strip)
- [ ] Framer Motion transitions fire between home → recipe and recipe → home
- [ ] PWA installable (manifest + service worker)
- [ ] OG/Twitter meta tags present on recipe pages
- [ ] Site deploys from `main` via GitHub Actions to GitHub Pages
- [ ] All Zustand stores persist across page reloads
- [ ] Lighthouse performance ≥ current site score on mobile
