import { describe, it, expect } from 'vitest'
import { filterRecipes } from './useHomeSearch'
import type { Recipe } from '../types'

const recipes: Recipe[] = [
  { slug: 'carbonara', title: 'Pâtes carbonara', image: 'carbonara', tags: ['pates', 'lard'], ingredients: [], content: '' },
  { slug: 'poulet_creme', title: 'Poulet à la crème', image: 'poulet', tags: ['poulet', 'creme'], ingredients: [], content: '' },
  { slug: 'tiramisu', title: 'Tiramisu au café', image: 'tiramisu', tags: ['dessert', 'cafe'], ingredients: [], content: '' },
  { slug: 'soupe_oignons', title: 'Soupe à l\'oignon', image: 'soupe', tags: ['soupe', 'oignon'], ingredients: [], content: '' },
]

describe('filterRecipes', () => {
  it('returns all recipes for empty query', () => {
    expect(filterRecipes(recipes, '')).toHaveLength(4)
  })

  it('matches exact title substring', () => {
    const result = filterRecipes(recipes, 'carbonara')
    expect(result).toHaveLength(1)
    expect(result[0].slug).toBe('carbonara')
  })

  it('matches case-insensitively', () => {
    expect(filterRecipes(recipes, 'POULET')).toHaveLength(1)
  })

  it('strips diacritics for matching (pates matches Pâtes)', () => {
    expect(filterRecipes(recipes, 'pates')).toHaveLength(1)
    expect(filterRecipes(recipes, 'Pâtes')).toHaveLength(1)
  })

  it('matches subsequence (tirs matches tiramisu)', () => {
    const result = filterRecipes(recipes, 'tirs')
    expect(result.some(r => r.slug === 'tiramisu')).toBe(true)
  })

  it('returns empty array for no match', () => {
    expect(filterRecipes(recipes, 'xyzqwerty')).toHaveLength(0)
  })

  it('matches across multiple recipes', () => {
    // 'ou' appears in both 'Poulet' and 'Soupe'
    const result = filterRecipes(recipes, 'ou')
    expect(result.length).toBeGreaterThan(1)
  })
})
