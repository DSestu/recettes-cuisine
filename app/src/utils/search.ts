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
