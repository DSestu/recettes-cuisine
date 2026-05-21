import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { recipes } from './data/recipes'
import { components } from './data/components'
import { tags } from './data/tags'
import { categories } from './data/categories'

const root = document.getElementById('root')!
createRoot(root).render(
  <StrictMode>
    <div className="font-inter bg-orange-50 text-orange-950 min-h-screen flex items-center justify-center flex-col gap-2">
      <h1 className="font-gelica text-3xl text-primary">Recettes de cuisine</h1>
      <p className="text-sm text-orange-700">
        {recipes.length} recettes · {components.length} composants · {tags.length} tags · {categories.length} catégories
      </p>
    </div>
  </StrictMode>
)
