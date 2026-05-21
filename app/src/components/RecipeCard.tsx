import { Link } from 'react-router-dom'
import type { Recipe } from '../types'

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

interface Props {
  recipe: Recipe
}

export function RecipeCard({ recipe }: Props) {
  const cardImg = `${BASE}/images/cards/${recipe.image}.webp`

  return (
    <Link
      to={`/recette/${recipe.slug}`}
      className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 border border-orange-100"
    >
      <div className="aspect-video bg-orange-100 overflow-hidden">
        <img
          src={cardImg}
          alt={recipe.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none'
          }}
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm text-orange-950 leading-tight line-clamp-2">
          {recipe.title}
        </h3>
        {/* {recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {recipe.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-xs px-1.5 py-0.5 rounded-md bg-orange-100 text-orange-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )} */}
      </div>
    </Link>
  )
}
