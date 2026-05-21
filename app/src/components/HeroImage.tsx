import { useNavigate } from 'react-router-dom'
import type { Recipe } from '../types'

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

interface Props {
  recipe: Recipe
}

const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 md:size-8">
    <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
  </svg>
)

const ZoomIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
  </svg>
)

export function HeroImage({ recipe, onZoom }: Props & { onZoom?: () => void }) {
  const navigate = useNavigate()
  const heroSrc = `${BASE}/images/hero/${recipe.image}.webp`

  function goBack() {
    if (window.history.length > 1) navigate(-1)
    else navigate('/')
  }

  return (
    <div className="recipe-image-panel relative aspect-video md:aspect-auto md:h-screen md:overflow-hidden" style={{ viewTransitionName: 'vt-hero' }}>
      <img
        src={heroSrc}
        alt={recipe.title}
        className="view w-full h-full"
        fetchPriority="high"
        decoding="async"
        style={{ objectFit: 'cover', objectPosition: 'center' }}
      />

      {/* Back button */}
      <button
        type="button"
        onClick={goBack}
        className="fixed top-4 left-4 z-30 bg-white rounded-full p-3 md:p-4 shadow border border-gray-200 hover:bg-gray-50 transition"
        aria-label="Retour"
      >
        <BackIcon />
      </button>

      {/* Mobile zoom button */}
      {onZoom && (
        <button
          type="button"
          onClick={onZoom}
          className="md:hidden absolute top-4 right-4 z-10 bg-white rounded-full p-3 shadow border border-gray-200 hover:bg-gray-50 transition"
          title="Agrandir l'image"
          aria-label="Agrandir l'image"
        >
          <ZoomIcon />
        </button>
      )}
    </div>
  )
}
