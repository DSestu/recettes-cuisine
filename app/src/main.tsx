import { StrictMode, Component } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'monospace', color: 'red' }}>
          <h2>Render error</h2>
          <pre>{String(this.state.error)}</pre>
          <pre>{(this.state.error as Error).stack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}
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
    <ErrorBoundary>
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="recette/:slug" element={<RecipePage />} />
          <Route path="recherche" element={<SearchPage />} />
        </Route>
      </Routes>
    </HashRouter>
    </ErrorBoundary>
  </StrictMode>
)
