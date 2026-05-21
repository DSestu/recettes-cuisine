import { Link } from 'react-router-dom'
import { components } from '../data/components'
import { IngredientList } from './IngredientList'
import { MarkdownRenderer, DirectionsList } from './MarkdownRenderer'
import type { RecipeComponent } from '../types'

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

interface Props {
  componentTitles: string[]
}

function resolveComponent(title: string): RecipeComponent | undefined {
  return components.find(c => c.title === title)
}

export function ComponentCards({ componentTitles }: Props) {
  const resolved = componentTitles
    .map(t => resolveComponent(t))
    .filter((c): c is RecipeComponent => c !== undefined)

  if (resolved.length === 0) return null

  return (
    <div className="mb-8">
      <h2 className="uppercase text-primary font-semibold mb-2">Composants</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {resolved.map(comp => (
          <Link
            key={comp.slug}
            to={`/recette/${comp.slug}`}
            className="recipe relative md:hover:scale-105 md:hover:rotate-1 transition"
          >
            <img
              src={`${BASE}/images/cards/${comp.image}.webp`}
              alt={comp.title}
              className="aspect-video w-full rounded-xl bg-gray-100 mb-1 object-cover"
              loading="lazy"
            />
            <h3 className="font-semibold leading-tight">{comp.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function ComponentDetails({ componentTitles }: Props) {
  const resolved = componentTitles
    .map(t => resolveComponent(t))
    .filter((c): c is RecipeComponent => c !== undefined)

  if (resolved.length === 0) return null

  return (
    <div className="components flex flex-col gap-12">
      <p className="text-orange-700/80 text-sm">
        ↓ C&apos;est une <strong className="text-primary">recette à composants</strong>. ↓
      </p>
      {resolved.map(comp => (
        <div key={comp.slug}>
          {comp.image && (
            <div className="component-image aspect-video w-full bg-cover bg-center mb-4 overflow-hidden rounded-xl">
              <img
                src={`${BASE}/images/cards/${comp.image}.webp`}
                alt={comp.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          <h4 className="font-gelica text-3xl mb-6 mt-4">{comp.title}</h4>
          <IngredientList ingredients={comp.ingredients} />
          {comp.directions ? (
            <DirectionsList directions={comp.directions} />
          ) : comp.content.trim() ? (
            <MarkdownRenderer content={comp.content} />
          ) : null}
        </div>
      ))}
    </div>
  )
}
