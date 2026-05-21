import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesStore {
  slugs: string[]
  add: (slug: string) => void
  remove: (slug: string) => void
  toggle: (slug: string) => void
  clear: () => void
  has: (slug: string) => boolean
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      slugs: [],
      add: (slug) =>
        set(state =>
          state.slugs.includes(slug) ? state : { slugs: [...state.slugs, slug] }
        ),
      remove: (slug) =>
        set(state => ({ slugs: state.slugs.filter(s => s !== slug) })),
      toggle: (slug) => {
        const state = get()
        if (state.slugs.includes(slug)) {
          set({ slugs: state.slugs.filter(s => s !== slug) })
        } else {
          set({ slugs: [...state.slugs, slug] })
        }
      },
      clear: () => set({ slugs: [] }),
      has: (slug) => get().slugs.includes(slug),
    }),
    { name: 'rc-favorites' }
  )
)
