import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const root = document.getElementById('root')!
createRoot(root).render(
  <StrictMode>
    <div className="font-inter bg-orange-50 text-orange-950 min-h-screen flex items-center justify-center">
      <h1 className="font-gelica text-3xl text-primary">Recettes de cuisine</h1>
    </div>
  </StrictMode>
)
