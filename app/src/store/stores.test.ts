import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from './cart'
import { useOwnedStore } from './owned'
import { useFavoritesStore } from './favorites'

// Reset store state before each test
beforeEach(() => {
  useCartStore.setState({ items: [] })
  useOwnedStore.setState({ ingredients: [] })
  useFavoritesStore.setState({ slugs: [] })
})

describe('useCartStore', () => {
  it('adds an item', () => {
    useCartStore.getState().add({ recipeSlug: 'poulet-roti', ingredient: 'poulet' })
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0]).toEqual({ recipeSlug: 'poulet-roti', ingredient: 'poulet' })
  })

  it('does not add duplicate items', () => {
    const add = useCartStore.getState().add
    add({ recipeSlug: 'poulet-roti', ingredient: 'poulet' })
    add({ recipeSlug: 'poulet-roti', ingredient: 'poulet' })
    expect(useCartStore.getState().items).toHaveLength(1)
  })

  it('removes an item', () => {
    useCartStore.getState().add({ recipeSlug: 'poulet-roti', ingredient: 'poulet' })
    useCartStore.getState().remove('poulet-roti', 'poulet')
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('clears all items', () => {
    useCartStore.getState().add({ recipeSlug: 'a', ingredient: 'x' })
    useCartStore.getState().add({ recipeSlug: 'b', ingredient: 'y' })
    useCartStore.getState().clear()
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('removes only matching item', () => {
    useCartStore.getState().add({ recipeSlug: 'a', ingredient: 'x' })
    useCartStore.getState().add({ recipeSlug: 'a', ingredient: 'y' })
    useCartStore.getState().remove('a', 'x')
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].ingredient).toBe('y')
  })
})

describe('useOwnedStore', () => {
  it('adds an ingredient', () => {
    useOwnedStore.getState().add('tomate')
    expect(useOwnedStore.getState().ingredients).toContain('tomate')
  })

  it('does not add duplicates', () => {
    useOwnedStore.getState().add('tomate')
    useOwnedStore.getState().add('tomate')
    expect(useOwnedStore.getState().ingredients).toHaveLength(1)
  })

  it('removes an ingredient', () => {
    useOwnedStore.getState().add('tomate')
    useOwnedStore.getState().remove('tomate')
    expect(useOwnedStore.getState().ingredients).toHaveLength(0)
  })

  it('has() returns true when present', () => {
    useOwnedStore.getState().add('fromage')
    expect(useOwnedStore.getState().has('fromage')).toBe(true)
  })

  it('has() returns false when absent', () => {
    expect(useOwnedStore.getState().has('truffe')).toBe(false)
  })

  it('clears all', () => {
    useOwnedStore.getState().add('a')
    useOwnedStore.getState().add('b')
    useOwnedStore.getState().clear()
    expect(useOwnedStore.getState().ingredients).toHaveLength(0)
  })
})

describe('useFavoritesStore', () => {
  it('adds a slug', () => {
    useFavoritesStore.getState().add('poulet-roti')
    expect(useFavoritesStore.getState().slugs).toContain('poulet-roti')
  })

  it('does not add duplicates', () => {
    useFavoritesStore.getState().add('poulet-roti')
    useFavoritesStore.getState().add('poulet-roti')
    expect(useFavoritesStore.getState().slugs).toHaveLength(1)
  })

  it('removes a slug', () => {
    useFavoritesStore.getState().add('poulet-roti')
    useFavoritesStore.getState().remove('poulet-roti')
    expect(useFavoritesStore.getState().slugs).toHaveLength(0)
  })

  it('toggle adds when absent', () => {
    useFavoritesStore.getState().toggle('pasta')
    expect(useFavoritesStore.getState().has('pasta')).toBe(true)
  })

  it('toggle removes when present', () => {
    useFavoritesStore.getState().add('pasta')
    useFavoritesStore.getState().toggle('pasta')
    expect(useFavoritesStore.getState().has('pasta')).toBe(false)
  })

  it('clears all', () => {
    useFavoritesStore.getState().add('a')
    useFavoritesStore.getState().add('b')
    useFavoritesStore.getState().clear()
    expect(useFavoritesStore.getState().slugs).toHaveLength(0)
  })
})
