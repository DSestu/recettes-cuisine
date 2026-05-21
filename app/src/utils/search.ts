import type { Recipe } from '../types'

export const FRENCH_STOPWORDS = new Set([
  'de','du','des','la','le','les','et','ou','au','aux','en','sur','avec','sans','un','une',
  'vos','mes','ses','nos','ces','ce','cette','pour','par','dans',
  'g','gramme','grammes','kg','mg','ml','cl','l','litre','litres',
  'cuillere','cuilleres','cac','cas','tasse','verre','pincee','tranche','tranches',
  'gros','grosses','grandes','grand','petit','petite','petites','petits',
  'noix','poignee','morceaux','morceau','environ','semi','epaisse','fraiche',
  'fin','fins','fine','fines','bio','frais','fraichement','seche','sec','secs',
])

export function normalizeBasic(s: string): string {
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/œ/g, 'oe')
    .replace(/[^a-z0-9\-\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function normalize(str: string): string {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function isSubsequence(query: string, text: string): boolean {
  if (!query) return true
  let i = 0, j = 0
  while (i < query.length && j < text.length) {
    if (query[i] === text[j]) i++
    j++
  }
  return i === query.length
}

export function singularize(frWord: string): string {
  const w = frWord
  if (w.endsWith('es') && w.length > 4) return w.slice(0, -2)
  if (w.endsWith('s') && w.length > 3) return w.slice(0, -1)
  if (w.endsWith('x') && w.length > 3) return w.slice(0, -1)
  return w
}

export function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length
  if (m === 0) return n
  if (n === 0) return m
  const dp: number[] = Array.from({ length: n + 1 }, (_, j) => j)
  for (let i = 1; i <= m; i++) {
    let prev = i - 1
    dp[0] = i
    for (let j = 1; j <= n; j++) {
      const temp = dp[j]
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost)
      prev = temp
    }
  }
  return dp[n]
}

export function buildCanonicalMap(vocabulary: Iterable<string>): {
  canonicalMap: Map<string, string>
  representatives: Set<string>
} {
  const canonicalMap = new Map<string, string>()
  const representatives: string[] = []

  function toCandidate(t: string) { return singularize(normalizeBasic(t)) }

  const tokens = Array.from(vocabulary)
    .map(toCandidate)
    .filter(t => t && !FRENCH_STOPWORDS.has(t))

  for (const tok of tokens) {
    let best: string | null = null, bestDist = Infinity
    for (const rep of representatives) {
      const dist = levenshtein(tok, rep)
      const thr = rep.length <= 4 ? 1 : rep.length <= 7 ? 2 : 3
      if (dist < bestDist && dist <= thr) { bestDist = dist; best = rep }
    }
    if (best) {
      canonicalMap.set(tok, best)
    } else {
      representatives.push(tok)
      canonicalMap.set(tok, tok)
    }
  }
  return { canonicalMap, representatives: new Set(representatives) }
}

export function tokenizeIngredient(line: string): string[] {
  if (!line) return []
  const tokens = normalizeBasic(String(line))
    .replace(/\d+[\w\s/.,-]*/g, ' ')
    .split(/\s+/)
    .map(t => singularize(t))
    .filter(t => t.length > 2 && !FRENCH_STOPWORDS.has(t))
  return Array.from(new Set(tokens))
}

export interface ScoreResult {
  matched: number
  missing: number
  included: boolean
}

export function scoreRecipe(
  recipe: Recipe,
  selectedTags: Set<string>,
  tolerance: number
): ScoreResult {
  if (selectedTags.size === 0) return { matched: 0, missing: 0, included: true }

  const tagSet = new Set(recipe.tags.map(t => String(t).trim()))
  let matched = 0, missing = 0

  for (const tag of selectedTags) {
    if (tagSet.has(tag)) matched++
    else missing++
  }

  return { matched, missing, included: missing <= tolerance }
}

export function filterByTitle(recipes: Recipe[], query: string): Recipe[] {
  const q = normalize(query)
  if (!q) return recipes
  return recipes.filter(r => {
    const t = normalize(r.title)
    return t.includes(q) || isSubsequence(q, t)
  })
}

// ── Graph data types ─────────────────────────────────────────────────────────

export type LinkMode = 'auto' | 'recipe-token' | 'token-token' | 'recipe-recipe'
export type WeightMode = 'idf' | 'freq' | 'select' | 'uniform'

export interface GraphNodeData {
  id: number
  label: string
  type: 'tag' | 'recipe' | 'component'
  url?: string
}

export interface GraphLinkData {
  source: number
  target: number
  weightRaw: number
}

export function tagsForRecipe(recipe: Recipe): string[] {
  const recipeTags = recipe.tags
    .map(t => singularize(normalizeBasic(t)))
    .filter(t => t.length > 2 && !FRENCH_STOPWORDS.has(t))
  const ingTokens = recipe.ingredients.flatMap(i => tokenizeIngredient(i))
  return Array.from(new Set([...recipeTags, ...ingTokens]))
}

export type SearchItem = Recipe & { itemType?: 'recipe' | 'component' }

export function buildGraphData(
  items: SearchItem[],
  allItems: SearchItem[],
  options: {
    linkMode?: LinkMode
    weightMode?: WeightMode
    maxRecipes?: number
    maxIngredients?: number
    hideTopIngredients?: number
    showTokens?: boolean
    showRecipes?: boolean
    showComponents?: boolean
    selectedTags?: Set<string>
    makeUrl?: (slug: string) => string
  }
): { nodes: GraphNodeData[]; links: GraphLinkData[] } {
  const {
    linkMode = 'auto',
    weightMode = 'uniform',
    maxRecipes = 60,
    maxIngredients = 60,
    hideTopIngredients = 0,
    showTokens = true,
    showRecipes = true,
    showComponents = true,
    selectedTags = new Set<string>(),
    makeUrl = (slug) => `/recette/${slug}`,
  } = options

  const Ndocs = Math.max(1, allItems.length)
  const df = new Map<string, number>()
  for (const r of allItems) {
    for (const tok of new Set(tagsForRecipe(r))) {
      df.set(tok, (df.get(tok) || 0) + 1)
    }
  }

  // Top tokens: skip most-frequent N, take up to maxIngredients
  const sorted = Array.from(df.entries()).sort((a, b) => b[1] - a[1])
  const topTokenSet = new Set<string>()
  let skipCount = 0
  for (const [tok] of sorted) {
    if (skipCount < hideTopIngredients) { skipCount++; continue }
    if (topTokenSet.size >= maxIngredients) break
    topTokenSet.add(tok)
  }

  const nodes: GraphNodeData[] = []
  const links: GraphLinkData[] = []
  const tokenId = new Map<string, number>()
  const recipeId = new Map<string, number>()
  let id = 0

  if (showTokens) {
    for (const tok of topTokenSet) {
      tokenId.set(tok, id)
      nodes.push({ id: id++, label: tok, type: 'tag' })
    }
  }

  const eligibleItems = items.filter(r =>
    r.itemType === 'component' ? showComponents : showRecipes
  )
  const limitedItems = eligibleItems.slice(0, maxRecipes)
  for (const r of limitedItems) {
    recipeId.set(r.title, id)
    nodes.push({
      id: id++,
      label: r.title,
      type: r.itemType === 'component' ? 'component' : 'recipe',
      url: makeUrl(r.slug),
    })
  }

  const useRecipeToken =
    linkMode === 'recipe-token' || (linkMode === 'auto' && (showRecipes || showComponents))
  const useTokenToken =
    linkMode === 'token-token' || (linkMode === 'auto' && !(showRecipes || showComponents))
  const useRecipeRecipe = linkMode === 'recipe-recipe'

  if (useRecipeToken) {
    for (const r of limitedItems) {
      const rid = recipeId.get(r.title)!
      for (const tok of new Set(tagsForRecipe(r))) {
        if (!topTokenSet.has(tok) || !showTokens) continue
        const freq = df.get(tok) || 1
        const idf = Math.log(1 + Ndocs / freq)
        let wRaw = 1
        if (weightMode === 'idf') wRaw = idf
        else if (weightMode === 'freq') wRaw = freq
        else if (weightMode === 'select') wRaw = selectedTags.has(tok) ? 2 : 1
        links.push({ source: rid, target: tokenId.get(tok)!, weightRaw: wRaw })
      }
    }
  } else if (useTokenToken && showTokens) {
    const pairCount = new Map<string, number>()
    for (const r of allItems) {
      const toks = Array.from(new Set(tagsForRecipe(r).filter(t => topTokenSet.has(t))))
      for (let i = 0; i < toks.length; i++) {
        for (let j = i + 1; j < toks.length; j++) {
          const a = toks[i] < toks[j] ? toks[i] : toks[j]
          const b = toks[i] < toks[j] ? toks[j] : toks[i]
          const key = `${a}||${b}`
          pairCount.set(key, (pairCount.get(key) || 0) + 1)
        }
      }
    }
    for (const [key, count] of pairCount) {
      const [a, b] = key.split('||')
      if (!tokenId.has(a) || !tokenId.has(b)) continue
      const fa = df.get(a) || 1, fb = df.get(b) || 1
      const idfa = Math.log(1 + Ndocs / fa), idfb = Math.log(1 + Ndocs / fb)
      let wRaw = count
      if (weightMode === 'idf') wRaw = count * (idfa + idfb) / 2
      links.push({ source: tokenId.get(a)!, target: tokenId.get(b)!, weightRaw: wRaw })
    }
  } else if (useRecipeRecipe) {
    for (let i = 0; i < limitedItems.length; i++) {
      for (let j = i + 1; j < limitedItems.length; j++) {
        const a = limitedItems[i], b = limitedItems[j]
        const setA = new Set(tagsForRecipe(a))
        const setB = new Set(tagsForRecipe(b))
        let shared = 0
        for (const t of setA) if (setB.has(t)) shared++
        if (shared > 0) {
          links.push({ source: recipeId.get(a.title)!, target: recipeId.get(b.title)!, weightRaw: shared })
        }
      }
    }
  }

  const usedIds = new Set<number>()
  for (const l of links) { usedIds.add(l.source); usedIds.add(l.target) }
  return {
    nodes: nodes.filter(n => usedIds.has(n.id)),
    links: links.filter(l => usedIds.has(l.source) && usedIds.has(l.target)),
  }
}
