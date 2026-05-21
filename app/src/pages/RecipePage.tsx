import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { recipes } from '../data/recipes'
import { HeroImage } from '../components/HeroImage'
import { IngredientList } from '../components/IngredientList'
import { MarkdownRenderer, DirectionsList } from '../components/MarkdownRenderer'
import { TagPills } from '../components/TagPills'
import { ComponentCards, ComponentDetails } from '../components/ComponentComposition'
import { ImageOverlay } from '../components/ImageOverlay'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

export function RecipePage() {
  const { slug } = useParams<{ slug: string }>()
  const [overlayImg, setOverlayImg] = useState<string | null>(null)

  const recipe = recipes.find(r => r.slug === slug)

  if (!recipe) {
    return (
      <div className="p-8 flex flex-col gap-4">
        <p className="text-orange-700">Recette « {slug} » introuvable.</p>
        <Link to="/" className="text-primary underline">← Retour à l'accueil</Link>
      </div>
    )
  }

  const fullImgSrc = `${BASE}/images/full/${recipe.image}.webp`
  const heroImgUrl = `${BASE}/images/hero/${recipe.image}.webp`

  useDocumentMeta({
    title: recipe.title,
    image: heroImgUrl,
  })

  const tagParam = recipe.tags.map(t => encodeURIComponent(t)).join(',')

  return (
    <>
      <div
        className="grid grid-cols-1 md:grid-cols-2 w-full md:overflow-x-hidden md:h-screen md:overflow-hidden"
        itemScope
        itemType="http://schema.org/Recipe"
      >
        {/* Left: hero image */}
        <HeroImage
          recipe={recipe}
          onZoom={() => setOverlayImg(fullImgSrc)}
        />

        {/* Right: article */}
        <article className="post-content bg-orange-50 p-8 md:p-12 flex flex-col gap-12 h-full md:overflow-y-scroll md:overflow-x-hidden mb-24">

          <header className="flex flex-col gap-6 md:pt-16">
            <h1
              className="recipe-title font-gelica text-primary text-left text-5xl lg:text-7xl font-bold"
              itemProp="name"
            >
              {recipe.title}
            </h1>

            <TagPills tags={recipe.tags} />

            <div>
              <Link
                to={`/recherche?tags=${tagParam}&viz=0&inf=1&autoScroll=1&open=tags`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white shadow-sm hover:opacity-90 transition border-2 border-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 4.42 11.94l3.195 3.196a.75.75 0 1 0 1.06-1.06L15.98 14.63A6.75 6.75 0 0 0 10.5 3.75m-5.25 6.75a5.25 5.25 0 1 1 10.5 0a5.25 5.25 0 0 1-10.5 0" clipRule="evenodd" />
                </svg>
                <span><strong>Recherches similaires</strong></span>
              </Link>
            </div>

            {/* Description block (content before ## Préparation, if directions: is set) */}
            {recipe.directions && recipe.content.trim() && (
              <div
                className="text-left text-lg leading-loose [&>*]:mb-6 [&_a]:underline [&_a]:decoration-[3px] [&_a]:decoration-primary [&_a]:underline-offset-2"
                itemProp="description"
                dangerouslySetInnerHTML={{ __html: recipe.content }}
              />
            )}
          </header>

          {/* Component cards (thumbnails) */}
          {recipe.components && (
            <ComponentCards componentTitles={recipe.components} />
          )}

          {/* Ingredients */}
          {recipe.ingredients.length > 0 && (
            <IngredientList ingredients={recipe.ingredients} />
          )}

          {/* Directions */}
          {recipe.directions ? (
            <DirectionsList directions={recipe.directions} />
          ) : (
            <MarkdownRenderer content={recipe.content} />
          )}

          {/* Component details (inline expanded) */}
          {recipe.components && (
            <ComponentDetails componentTitles={recipe.components} />
          )}

        </article>
      </div>

      {/* Fullscreen image overlay */}
      <ImageOverlay
        src={overlayImg}
        alt={recipe.title}
        onClose={() => setOverlayImg(null)}
      />
    </>
  )
}
