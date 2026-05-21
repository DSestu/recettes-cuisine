import { Link } from 'react-router-dom'
import { recipes } from '../data/recipes'
import type { Recipe } from '../types'

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

function ingredientWords(lines: string[]): Set<string> {
  const words = lines.flatMap(ln =>
    ln.toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .split(/\W+/)
      .filter(w => w.length > 2)
  )
  return new Set(words)
}

function score(current: Recipe, candidate: Recipe): number {
  const candTags = new Set(candidate.tags)
  const currentIngWords = ingredientWords(current.ingredients)
  const candIngWords = ingredientWords(candidate.ingredients)
  let s = 0
  for (const t of current.tags) if (candTags.has(t)) s += 2
  for (const w of currentIngWords) if (candIngWords.has(w)) s += 1
  return s
}

export function RecipeSuggestions({ recipe }: { recipe: Recipe }) {
  const suggestions = recipes
    .filter(r => r.slug !== recipe.slug)
    .map(r => ({ recipe: r, score: score(recipe, r) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score || a.recipe.title.localeCompare(b.recipe.title))
    .slice(0, 6)
    .map(x => x.recipe)

  if (suggestions.length === 0) return null

  return (
    <div className="mt-8">
      <h2 className="uppercase text-primary font-semibold mb-4">Suggestions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {suggestions.map(r => (
          <Link
            key={r.slug}
            to={`/recette/${r.slug}`}
            className="recipe relative md:hover:scale-105 md:hover:rotate-1 transition"
          >
            <img
              src={`${BASE}/images/cards/${r.image}.webp`}
              alt={r.title}
              className="aspect-video w-full rounded-xl bg-gray-100 mb-1 object-cover"
              loading="lazy"
            />
            <h3 className="font-semibold leading-tight">{r.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  )
}
