import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  recipeSlug: string
  ingredient: string
}

interface CartStore {
  items: CartItem[]
  add: (item: CartItem) => void
  remove: (recipeSlug: string, ingredient: string) => void
  clear: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set(state => {
          const exists = state.items.some(
            i => i.recipeSlug === item.recipeSlug && i.ingredient === item.ingredient
          )
          return exists ? state : { items: [...state.items, item] }
        }),
      remove: (recipeSlug, ingredient) =>
        set(state => ({
          items: state.items.filter(
            i => !(i.recipeSlug === recipeSlug && i.ingredient === ingredient)
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: 'rc-cart' }
  )
)
