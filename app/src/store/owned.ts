import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface OwnedStore {
  ingredients: string[]
  add: (ingredient: string) => void
  remove: (ingredient: string) => void
  clear: () => void
  has: (ingredient: string) => boolean
}

export const useOwnedStore = create<OwnedStore>()(
  persist(
    (set, get) => ({
      ingredients: [],
      add: (ingredient) =>
        set(state =>
          state.ingredients.includes(ingredient)
            ? state
            : { ingredients: [...state.ingredients, ingredient] }
        ),
      remove: (ingredient) =>
        set(state => ({ ingredients: state.ingredients.filter(i => i !== ingredient) })),
      clear: () => set({ ingredients: [] }),
      has: (ingredient) => get().ingredients.includes(ingredient),
    }),
    { name: 'rc-owned' }
  )
)
