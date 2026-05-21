import { describe, it, expect } from 'vitest'
import {
  normalizeBasic,
  normalize,
  isSubsequence,
  singularize,
  levenshtein,
  tokenizeIngredient,
  scoreRecipe,
} from './search'
import type { Recipe } from '../types'

describe('normalizeBasic', () => {
  it('lowercases and strips diacritics', () => {
    expect(normalizeBasic('Épaisse')).toBe('epaisse')
    expect(normalizeBasic('CRÈME')).toBe('creme')
  })
  it('converts œ to oe', () => {
    expect(normalizeBasic('œufs')).toBe('oeufs')
  })
  it('collapses whitespace', () => {
    expect(normalizeBasic('  foo   bar  ')).toBe('foo bar')
  })
})

describe('normalize', () => {
  it('strips diacritics and non-alnum', () => {
    expect(normalize('Pâtes carbonara!')).toBe('pates carbonara')
  })
  it('handles empty string', () => {
    expect(normalize('')).toBe('')
  })
})

describe('isSubsequence', () => {
  it('returns true for empty query', () => {
    expect(isSubsequence('', 'anything')).toBe(true)
  })
  it('matches exact string', () => {
    expect(isSubsequence('chat', 'chat')).toBe(true)
  })
  it('matches subsequence', () => {
    expect(isSubsequence('trs', 'tiramisu')).toBe(true)
  })
  it('returns false when chars out of order', () => {
    expect(isSubsequence('zaa', 'abc')).toBe(false)
  })
})

describe('singularize', () => {
  it('removes trailing -es for words > 4 chars', () => {
    expect(singularize('tomates')).toBe('tomat')  // ends in 'es', length 7 > 4
  })
  it('removes trailing -s for words > 3 chars', () => {
    expect(singularize('oeufs')).toBe('oeuf')
  })
  it('removes trailing -x for words > 3 chars', () => {
    expect(singularize('choux')).toBe('chou')
  })
  it('leaves short words unchanged', () => {
    expect(singularize('os')).toBe('os')
  })
})

describe('levenshtein', () => {
  it('returns 0 for identical strings', () => {
    expect(levenshtein('chat', 'chat')).toBe(0)
  })
  it('returns 1 for single insertion', () => {
    expect(levenshtein('chat', 'chats')).toBe(1)
  })
  it('returns 1 for single substitution', () => {
    expect(levenshtein('chat', 'chau')).toBe(1)
  })
  it('returns string length for empty vs non-empty', () => {
    expect(levenshtein('', 'abc')).toBe(3)
    expect(levenshtein('abc', '')).toBe(3)
  })
})

describe('tokenizeIngredient', () => {
  it('strips quantities and stopwords', () => {
    const tokens = tokenizeIngredient('200 g de farine')
    expect(tokens).not.toContain('de')
    expect(tokens).not.toContain('200')
    expect(tokens).not.toContain('g')
  })
  it('extracts meaningful words (apostrophe acts as token boundary)', () => {
    // d'aiguillettes → quantity regex stops at apostrophe, leaving 'aiguillettes + poulet
    const tokens = tokenizeIngredient("400 g d'aiguillettes de poulet")
    expect(tokens.some(t => t.includes('poulet'))).toBe(true)
  })
  it('returns empty array for empty input', () => {
    expect(tokenizeIngredient('')).toEqual([])
  })
})

describe('scoreRecipe', () => {
  const recipe: Recipe = {
    slug: 'test',
    title: 'Poulet rôti',
    image: 'test',
    tags: ['poulet', 'plat', 'four'],
    ingredients: ['500 g de poulet', '1 citron'],
    content: '',
  }

  it('returns full match when selected tags are a subset of recipe tags', () => {
    const result = scoreRecipe(recipe, new Set(['poulet', 'plat']), 0)
    expect(result.matched).toBe(2)
    expect(result.missing).toBe(0)
    expect(result.included).toBe(true)
  })

  it('excludes recipe when missing > tolerance', () => {
    const result = scoreRecipe(recipe, new Set(['poulet', 'soupe']), 0)
    expect(result.missing).toBe(1)
    expect(result.included).toBe(false)
  })

  it('includes recipe when missing <= tolerance', () => {
    const result = scoreRecipe(recipe, new Set(['poulet', 'soupe']), 1)
    expect(result.missing).toBe(1)
    expect(result.included).toBe(true)
  })

  it('includes everything when no tags selected', () => {
    const result = scoreRecipe(recipe, new Set(), 0)
    expect(result.included).toBe(true)
  })
})
