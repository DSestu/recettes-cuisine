import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { recipes } from '../data/recipes'
import { components } from '../data/components'
import { tags as allTags } from '../data/tags'
import { categories } from '../data/categories'
import {
  filterByTitle,
  scoreRecipe,
  buildGraphData,
  normalize,
} from '../utils/search'
import type { LinkMode, WeightMode, SearchItem } from '../utils/search'
import { D3ForceGraph } from '../components/D3ForceGraph'
import type { LayoutMode, GraphNode, GraphLink } from '../components/D3ForceGraph'

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

function ingMatchPct(recipe: SearchItem, selectedTags: Set<string>, ingredientTagIds: Set<string>): number {
  const ingSelected = Array.from(selectedTags).filter(t => ingredientTagIds.has(t))
  if (ingSelected.length === 0) return 0
  const tagSet = new Set(recipe.tags)
  return ingSelected.filter(t => tagSet.has(t)).length / ingSelected.length
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  // State — initialized from URL once
  const [selectedTags, setSelectedTags] = useState<Set<string>>(() => {
    const t = searchParams.get('tags')
    return t ? new Set(t.split(',').map(s => s.trim()).filter(Boolean)) : new Set()
  })
  const [tolerance, setTolerance] = useState(() => Number(searchParams.get('mt') ?? 0))
  const [infiniteTolerance, setInfiniteTolerance] = useState(() => searchParams.get('inf') === '1')
  const [mode, setMode] = useState<'tag' | 'what_i_have'>(() =>
    searchParams.get('mode') === 'what_i_have' ? 'what_i_have' : 'tag'
  )
  const [titleQuery, setTitleQuery] = useState(() => searchParams.get('q') ?? '')
  const [activeCategoryIds, setActiveCategoryIds] = useState<Set<string>>(() => {
    const c = searchParams.get('cat')
    return c ? new Set(c.split(',').filter(Boolean)) : new Set()
  })
  const [includeComponents, setIncludeComponents] = useState(() => searchParams.get('components') !== '0')
  const [tagInput, setTagInput] = useState('')
  const [showAutocomplete, setShowAutocomplete] = useState(false)

  // Viz state
  const [showViz, setShowViz] = useState(() => searchParams.get('viz') === '1')
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(() =>
    (searchParams.get('layout') as LayoutMode) ?? 'force'
  )
  const [linkMode, setLinkMode] = useState<LinkMode>(() =>
    (searchParams.get('links') as LinkMode) ?? 'auto'
  )
  const [weightMode, setWeightMode] = useState<WeightMode>(() =>
    (searchParams.get('edge') as WeightMode) ?? 'uniform'
  )
  const [impact, setImpact] = useState(() => Number(searchParams.get('impact') ?? 1))
  const [maxRecipes, setMaxRecipes] = useState(() => Number(searchParams.get('mr') ?? 60))
  const [maxIngredients] = useState(() => Number(searchParams.get('mi') ?? 60))
  const [showTokens, setShowTokens] = useState(() => searchParams.get('st') !== '0')
  const [showGraphRecipes, setShowGraphRecipes] = useState(() => searchParams.get('sr') !== '0')
  const [showGraphComponents, setShowGraphComponents] = useState(() => searchParams.get('sc') !== '0')

  const resultsRef = useRef<HTMLDivElement>(null)

  // Auto-scroll on mount
  useEffect(() => {
    if (searchParams.get('autoScroll') === '1' && resultsRef.current) {
      const el = resultsRef.current
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 300)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync state → URL
  useEffect(() => {
    const p: Record<string, string> = {}
    if (selectedTags.size) p.tags = Array.from(selectedTags).join(',')
    if (titleQuery) p.q = titleQuery
    if (tolerance > 0) p.mt = String(tolerance)
    if (infiniteTolerance) p.inf = '1'
    if (mode !== 'tag') p.mode = mode
    if (activeCategoryIds.size) p.cat = Array.from(activeCategoryIds).join(',')
    if (!includeComponents) p.components = '0'
    if (showViz) p.viz = '1'
    if (layoutMode !== 'force') p.layout = layoutMode
    if (linkMode !== 'auto') p.links = linkMode
    if (weightMode !== 'uniform') p.edge = weightMode
    if (impact !== 1) p.impact = String(impact)
    if (maxRecipes !== 60) p.mr = String(maxRecipes)
    if (maxIngredients !== 60) p.mi = String(maxIngredients)
    if (!showTokens) p.st = '0'
    if (!showGraphRecipes) p.sr = '0'
    if (!showGraphComponents) p.sc = '0'
    setSearchParams(p, { replace: true })
  }, [
    selectedTags, tolerance, infiniteTolerance, mode, titleQuery, activeCategoryIds,
    includeComponents, showViz, layoutMode, linkMode, weightMode, impact,
    maxRecipes, maxIngredients, showTokens, showGraphRecipes, showGraphComponents,
    setSearchParams,
  ])

  // All items
  const allItems = useMemo<SearchItem[]>(() => [
    ...recipes.map(r => ({ ...r, itemType: 'recipe' as const })),
    ...components.map(c => ({ ...c, itemType: 'component' as const })),
  ], [])

  const ingredientTagIds = useMemo(
    () => new Set(allTags.filter(t => t.ingredient).map(t => t.id)),
    []
  )

  // Filtered + sorted items
  const filteredItems = useMemo<SearchItem[]>(() => {
    let items: SearchItem[] = includeComponents
      ? allItems
      : allItems.filter(r => r.itemType === 'recipe')

    if (titleQuery.trim()) items = filterByTitle(items, titleQuery) as SearchItem[]

    if (activeCategoryIds.size > 0) {
      items = items.filter(r =>
        categories.some(cat => activeCategoryIds.has(cat.id) && r.tags.some(t => cat.tags.includes(t)))
      )
    }

    if (selectedTags.size > 0 && mode === 'tag' && !infiniteTolerance) {
      items = items.filter(r => scoreRecipe(r, selectedTags, tolerance).included)
    }

    if (selectedTags.size > 0) {
      items = [...items].sort((a, b) => {
        if (mode === 'what_i_have') {
          const pa = ingMatchPct(a, selectedTags, ingredientTagIds)
          const pb = ingMatchPct(b, selectedTags, ingredientTagIds)
          if (pb !== pa) return pb - pa
        } else {
          const sa = scoreRecipe(a, selectedTags, 999)
          const sb = scoreRecipe(b, selectedTags, 999)
          if (sb.matched !== sa.matched) return sb.matched - sa.matched
        }
        return a.title.localeCompare(b.title, 'fr')
      })
    }

    return items
  }, [allItems, selectedTags, tolerance, infiniteTolerance, mode, titleQuery, activeCategoryIds, includeComponents, ingredientTagIds])

  // Tag suggestions (top 20 by frequency, excluding selected)
  const tagSuggestions = useMemo(() => {
    const freq = new Map<string, number>()
    for (const r of filteredItems) {
      for (const t of r.tags) {
        if (!selectedTags.has(t)) freq.set(t, (freq.get(t) || 0) + 1)
      }
    }
    return Array.from(freq.entries()).sort((a, b) => b[1] - a[1]).slice(0, 20)
  }, [filteredItems, selectedTags])

  // Autocomplete
  const autocompleteTags = useMemo(() => {
    if (!tagInput.trim()) return []
    const q = normalize(tagInput)
    return allTags.filter(t => !selectedTags.has(t.id) && normalize(t.id).includes(q)).slice(0, 10)
  }, [tagInput, selectedTags])

  // Recommendations (recipes outside the filtered set with highest tag overlap)
  const recommendations = useMemo(() => {
    if (selectedTags.size === 0) return []
    const inFiltered = new Set(filteredItems.map(r => r.slug))
    return allItems
      .filter(r => !inFiltered.has(r.slug))
      .map(r => ({ recipe: r, score: scoreRecipe(r, selectedTags, 999).matched }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score !== a.score ? b.score - a.score : a.recipe.title.localeCompare(b.recipe.title, 'fr'))
      .slice(0, 6)
      .map(x => x.recipe)
  }, [allItems, filteredItems, selectedTags])

  // Graph data
  const { graphNodes, graphLinks } = useMemo<{ graphNodes: GraphNode[]; graphLinks: GraphLink[] }>(() => {
    if (!showViz) return { graphNodes: [], graphLinks: [] }
    const { nodes, links } = buildGraphData(filteredItems, allItems, {
      linkMode, weightMode, maxRecipes, maxIngredients,
      hideTopIngredients: 0,
      showTokens, showRecipes: showGraphRecipes, showComponents: showGraphComponents,
      selectedTags,
      makeUrl: slug => `/recette/${slug}`,
    })
    return { graphNodes: nodes as GraphNode[], graphLinks: links as GraphLink[] }
  }, [showViz, filteredItems, allItems, linkMode, weightMode, maxRecipes, maxIngredients, showTokens, showGraphRecipes, showGraphComponents, selectedTags])

  // Handlers
  function addTag(tag: string) {
    const t = tag.trim()
    if (!t) return
    setSelectedTags(prev => new Set([...prev, t]))
    setTagInput('')
    setShowAutocomplete(false)
  }
  function removeTag(tag: string) {
    setSelectedTags(prev => { const n = new Set(prev); n.delete(tag); return n })
  }
  function clearTags() { setSelectedTags(new Set()) }
  function toggleCategory(id: string) {
    setActiveCategoryIds(prev => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  }

  const onTagClick = useCallback((tag: string) => {
    setSelectedTags(prev => {
      const n = new Set(prev)
      if (n.has(tag)) n.delete(tag)
      else n.add(tag)
      return n
    })
  }, [])

  const onRecipeNavigate = useCallback((url: string) => {
    navigate(url)
  }, [navigate])

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col md:flex-row">
      {/* ── Filter sidebar ─────────────────────────────────────────── */}
      <aside className="w-full md:w-72 lg:w-80 flex-shrink-0 bg-white border-r border-orange-100 p-4 flex flex-col gap-4 overflow-y-auto md:h-screen md:sticky md:top-0 pb-24 md:pb-4">
        <h1 className="font-gelica text-primary text-2xl font-bold pt-2">Recherche</h1>

        {/* Title search */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
            Nom de la recette
          </label>
          <div className="relative">
            <input
              type="text"
              value={titleQuery}
              onChange={e => setTitleQuery(e.target.value)}
              placeholder="Rechercher…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {titleQuery && (
              <button
                onClick={() => setTitleQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
              Catégories
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.filter(c => !c.mode).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${
                    activeCategoryIds.has(cat.id)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mode toggle */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
            Mode
          </label>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setMode('tag')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition ${
                mode === 'tag' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              Tags
            </button>
            <button
              onClick={() => setMode('what_i_have')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition ${
                mode === 'what_i_have' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              J'ai ces ingrédients
            </button>
          </div>

          {mode === 'tag' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Tolérance</span>
              <button
                onClick={() => setInfiniteTolerance(t => !t)}
                className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold border transition ${
                  infiniteTolerance
                    ? 'bg-orange-100 text-orange-700 border-orange-300'
                    : 'bg-gray-50 text-gray-600 border-gray-200'
                }`}
              >
                {infiniteTolerance ? '∞' : tolerance}
              </button>
              {!infiniteTolerance && (
                <input
                  type="range" min={0} max={5} step={1} value={tolerance}
                  onChange={e => setTolerance(Number(e.target.value))}
                  className="flex-1 accent-primary"
                />
              )}
            </div>
          )}
        </div>

        {/* Tag input */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
            {mode === 'what_i_have' ? "Ingrédients que j'ai" : 'Filtrer par tags'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={tagInput}
              onChange={e => { setTagInput(e.target.value); setShowAutocomplete(true) }}
              onFocus={() => setShowAutocomplete(true)}
              onBlur={() => setTimeout(() => setShowAutocomplete(false), 150)}
              onKeyDown={e => {
                if (e.key === 'Enter' && tagInput.trim()) { addTag(normalize(tagInput.trim())); e.preventDefault() }
                if (e.key === 'Escape') setShowAutocomplete(false)
              }}
              placeholder="Ajouter un tag…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {showAutocomplete && autocompleteTags.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {autocompleteTags.map(t => (
                  <button
                    key={t.id}
                    onMouseDown={() => addTag(t.id)}
                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-orange-50"
                  >
                    {t.id}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedTags.size > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {Array.from(selectedTags).map(t => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary text-white rounded-full text-xs"
                >
                  {t}
                  <button onClick={() => removeTag(t)} className="hover:opacity-70 leading-none">✕</button>
                </span>
              ))}
              <button
                onClick={clearTags}
                className="px-2 py-0.5 rounded-full text-xs text-gray-500 border border-gray-200 hover:bg-gray-50"
              >
                Tout effacer
              </button>
            </div>
          )}
        </div>

        {/* Tag suggestions */}
        {tagSuggestions.length > 0 && (
          <div>
            <p className="text-xs text-gray-400 mb-1.5">Suggestions</p>
            <div className="flex flex-wrap gap-1.5">
              {tagSuggestions.map(([tag, count]) => (
                <button
                  key={tag}
                  onClick={() => addTag(tag)}
                  className="px-2.5 py-1 rounded-full text-xs bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition"
                >
                  {tag}
                  <span className="ml-1 text-[10px] text-orange-400 font-mono">{count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Include components */}
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={includeComponents}
            onChange={e => setIncludeComponents(e.target.checked)}
            className="rounded accent-primary"
          />
          Inclure les composants
        </label>
      </aside>

      {/* ── Main content ───────────────────────────────────────────── */}
      <main className="flex-1 p-4 md:p-6 flex flex-col gap-6 min-h-screen">
        {/* Results header */}
        <div ref={resultsRef} className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{filteredItems.length}</span>{' '}
            recette{filteredItems.length !== 1 ? 's' : ''}
          </p>
          <button
            onClick={() => setShowViz(v => !v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              showViz
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'
            }`}
          >
            {showViz ? '✕ Fermer la visualisation' : '⬡ Visualisation'}
          </button>
        </div>

        {/* Force graph */}
        {showViz && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-600">
              <label className="flex items-center gap-1">
                Layout:
                <select
                  value={layoutMode}
                  onChange={e => setLayoutMode(e.target.value as LayoutMode)}
                  className="ml-1 border border-gray-200 rounded px-1.5 py-0.5"
                >
                  {(['force', 'radial', 'circle', 'rings', 'spiral'] as LayoutMode[]).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-1">
                Liens:
                <select
                  value={linkMode}
                  onChange={e => setLinkMode(e.target.value as LinkMode)}
                  className="ml-1 border border-gray-200 rounded px-1.5 py-0.5"
                >
                  {(['auto', 'recipe-token', 'token-token', 'recipe-recipe'] as LinkMode[]).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-1">
                Poids:
                <select
                  value={weightMode}
                  onChange={e => setWeightMode(e.target.value as WeightMode)}
                  className="ml-1 border border-gray-200 rounded px-1.5 py-0.5"
                >
                  {(['uniform', 'idf', 'freq', 'select'] as WeightMode[]).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={showTokens} onChange={e => setShowTokens(e.target.checked)} className="accent-green-500" />
                <span className="text-green-600 font-medium">Ingrédients</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={showGraphRecipes} onChange={e => setShowGraphRecipes(e.target.checked)} className="accent-orange-500" />
                <span className="text-orange-500 font-medium">Recettes</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" checked={showGraphComponents} onChange={e => setShowGraphComponents(e.target.checked)} />
                <span className="text-red-600 font-medium">Composants</span>
              </label>
              <label className="flex items-center gap-1">
                <span className="text-gray-400">Max recettes:</span>
                <input
                  type="range" min={10} max={150} step={5} value={maxRecipes}
                  onChange={e => setMaxRecipes(Number(e.target.value))}
                  className="w-20 accent-primary ml-1"
                />
                <span className="font-mono text-gray-500 w-7 tabular-nums">{maxRecipes}</span>
              </label>
              <label className="flex items-center gap-1">
                <span className="text-gray-400">Impact:</span>
                <input
                  type="range" min={0} max={3} step={0.1} value={impact}
                  onChange={e => setImpact(Number(e.target.value))}
                  className="w-16 accent-primary ml-1"
                />
              </label>
            </div>

            <div className="aspect-video w-full bg-gray-50 rounded-lg overflow-hidden">
              <D3ForceGraph
                nodes={graphNodes}
                links={graphLinks}
                selectedTags={selectedTags}
                onTagClick={onTagClick}
                onRecipeNavigate={onRecipeNavigate}
                layoutMode={layoutMode}
                linkMode={linkMode}
                weightMode={weightMode}
                weightingEnabled={weightMode !== 'uniform'}
                impact={impact}
              />
            </div>

            <div className="flex gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block flex-shrink-0" />
                Ingrédients
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block flex-shrink-0" />
                Recettes
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F53200] inline-block flex-shrink-0" />
                Composants
              </span>
            </div>
          </div>
        )}

        {/* Results grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredItems.map((recipe, i) => (
              <SearchRecipeCard
                key={recipe.slug}
                recipe={recipe}
                selectedTags={selectedTags}
                mode={mode}
                ingredientTagIds={ingredientTagIds}
                eager={i < 8}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="text-base">Aucune recette trouvée</p>
            <p className="text-sm mt-1">
              {selectedTags.size > 0 && mode === 'tag' && !infiniteTolerance
                ? "Essayez d'augmenter la tolérance ou de réduire les filtres."
                : 'Essayez de modifier vos critères de recherche.'}
            </p>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Recettes proches
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {recommendations.map(recipe => (
                <SearchRecipeCard
                  key={recipe.slug}
                  recipe={recipe}
                  selectedTags={selectedTags}
                  mode={mode}
                  ingredientTagIds={ingredientTagIds}
                  eager={false}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

interface CardProps {
  recipe: SearchItem
  selectedTags: Set<string>
  mode: 'tag' | 'what_i_have'
  ingredientTagIds: Set<string>
  eager?: boolean
}

function SearchRecipeCard({ recipe, selectedTags, mode, ingredientTagIds, eager }: CardProps) {
  const { matched, missing } = selectedTags.size > 0
    ? scoreRecipe(recipe, selectedTags, 999)
    : { matched: 0, missing: 0 }
  const total = matched + missing
  const pct = total > 0 ? matched / total : 1
  const ingPct = mode === 'what_i_have' && selectedTags.size > 0
    ? ingMatchPct(recipe, selectedTags, ingredientTagIds)
    : null

  const badgeColor = pct >= 1 ? '#22c55e' : pct >= 0.5 ? '#f97316' : '#F53200'

  return (
    <Link
      to={`/recette/${recipe.slug}`}
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={`${BASE}/images/card/${recipe.image}.webp`}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading={eager ? 'eager' : 'lazy'}
        />
        {selectedTags.size > 0 && (
          <span
            className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-white text-xs font-bold shadow"
            style={{ background: badgeColor }}
          >
            {ingPct !== null ? `${Math.round(ingPct * 100)}%` : `${matched}/${total}`}
          </span>
        )}
      </div>
      <div className="p-2 pb-3">
        <p className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2">{recipe.title}</p>
      </div>
    </Link>
  )
}
