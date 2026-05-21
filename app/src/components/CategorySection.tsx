import { RecipeCard } from './RecipeCard'
import type { Recipe } from '../types'

interface Props {
  label: string
  recipes: Recipe[]
  cols: number
}

export function CategorySection({ label, recipes, cols }: Props) {
  if (recipes.length === 0) return null

  return (
    <section className="mb-8">
      <h3 className="px-6 text-primary uppercase font-semibold mb-2 text-lg md:text-xl">
        {label}
      </h3>
      <div
        className="grid px-6 gap-4 md:gap-6 grid-cols-2"
        style={{ '--cols': cols } as React.CSSProperties}
      >
        {recipes.map(r => (
          <RecipeCard key={r.slug} recipe={r} />
        ))}
      </div>
    </section>
  )
}
