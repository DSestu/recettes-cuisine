import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { AppLayout } from './components/AppLayout'
import { HomePage } from './pages/HomePage'
import { RecipePage } from './pages/RecipePage'
import { SearchPage } from './pages/SearchPage'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/recettes-cuisine/serviceworker.js')
  })
}

const root = document.getElementById('root')!
createRoot(root).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="recette/:slug" element={<RecipePage />} />
          <Route path="recherche" element={<SearchPage />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>
)
