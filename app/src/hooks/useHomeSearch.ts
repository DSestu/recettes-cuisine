import { useState, useCallback } from 'react'
import type { Recipe } from '../types'

function normalize(str: string): string {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function isSubsequence(query: string, text: string): boolean {
  if (!query) return true
  let i = 0, j = 0
  while (i < query.length && j < text.length) {
    if (query[i] === text[j]) i++
    j++
  }
  return i === query.length
}

export function filterRecipes(recipes: Recipe[], query: string): Recipe[] {
  const q = normalize(query)
  if (!q) return recipes
  return recipes.filter(r => {
    const title = normalize(r.title)
    return title.includes(q) || isSubsequence(q, title)
  })
}

export function useHomeSearch(recipes: Recipe[]) {
  const [query, setQuery] = useState('')

  const filtered = filterRecipes(recipes, query)

  const clear = useCallback(() => setQuery(''), [])

  return { query, setQuery, filtered, clear }
}
