import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { recipes } from '../data/recipes'
import { categories } from '../data/categories'
import { CategorySection } from '../components/CategorySection'
import { ColsSelector, useColsValue } from '../components/ColsSelector'
import { useHomeSearch } from '../hooks/useHomeSearch'
import type { HomeCategory, Recipe } from '../types'

function assignToCategories(
  allRecipes: Recipe[],
  cats: HomeCategory[]
): Map<string, Recipe[]> {
  const nonOther = cats.filter(c => c.mode !== 'other')
  const otherCat = cats.find(c => c.mode === 'other')
  const result = new Map<string, Recipe[]>(cats.map(c => [c.id, []]))

  for (const recipe of allRecipes) {
    const tagSet = new Set(recipe.tags)
    const match = nonOther.find(cat => cat.tags.some(t => tagSet.has(t)))
    const targetId = match?.id ?? otherCat?.id
    if (targetId) result.get(targetId)!.push(recipe)
  }

  return result
}

export function HomePage() {
  const cols = useColsValue()
  const { query, setQuery, filtered, clear } = useHomeSearch(recipes)
  const searchRef = useRef<HTMLInputElement>(null)
  const assigned = assignToCategories(filtered, categories)

  // Cmd/Ctrl+F focuses search input
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.key === 'f' || e.key === 'F') && (e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey) {
        e.preventDefault()
        searchRef.current?.focus()
        searchRef.current?.select()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="content w-full h-full overflow-y-auto bg-orange-50 pb-24 md:pb-6">
      {/* Advanced search banner */}
      <div className="px-6 pt-6">
        <div className="w-full rounded-2xl bg-gradient-to-r from-red-200 to-orange-100 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="font-gelica text-2xl md:text-3xl text-primary">
              Pas d&apos;idée ? Essayez la recherche avancée
            </h2>
            <p className="text-sm text-red-900/80">
              Filtrez par ingrédients disponibles, tags, et explorez visuellement le catalogue.
            </p>
          </div>
          <Link
            to="/recherche"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:scale-105 hover:rotate-1 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 4.2 12.06l3.245 3.245a.75.75 0 1 0 1.06-1.06l-3.245-3.245A6.75 6.75 0 0 0 10.5 3.75ZM5.25 10.5a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z" clipRule="evenodd" />
            </svg>
            Recherche avancée
          </Link>
        </div>
      </div>

      {/* Search bar */}
      <div className="px-6 mt-4">
        <div className="relative max-w-xl">
          <input
            ref={searchRef}
            id="home-search"
            type="search"
            inputMode="search"
            autoComplete="off"
            placeholder="Rechercher une recette…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full rounded-xl border border-red-200/60 bg-white/80 backdrop-blur px-4 py-2 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          {query && (
            <button
              type="button"
              onClick={clear}
              aria-label="Effacer la recherche"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 hover:text-primary"
            >
              ✕
            </button>
          )}
        </div>
        {query && (
          <p className="text-sm text-orange-700 mt-1">
            {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Toolbar: cols selector */}
      <div className="px-6 mt-4 flex items-center">
        <ColsSelector />
      </div>

      {/* Category sections */}
      <div id="recipes-by-category" className="mt-4">
        {categories.map(cat => {
          const catRecipes = assigned.get(cat.id) ?? []
          return (
            <CategorySection
              key={cat.id}
              label={cat.label}
              recipes={catRecipes}
              cols={cols}
            />
          )
        })}
      </div>
    </div>
  )
}
