import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { flushSync } from 'react-dom'
import { useEffect, useRef } from 'react'
import { Nav } from './Nav'

function pageKind(path: string): string {
  if (path === '/' || path === '') return 'home'
  if (path.startsWith('/recherche')) return 'search'
  if (path.startsWith('/recette/')) return 'recipe'
  return 'other'
}

export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const navigateRef = useRef(navigate)
  const locationRef = useRef(location)
  navigateRef.current = navigate
  locationRef.current = location

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest('a') as HTMLAnchorElement | null
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href) return

      // HashRouter internal links look like "#/recette/slug"
      let to: string
      if (href === '#/' || href === '#') to = '/'
      else if (href.startsWith('#/')) to = href.slice(1)
      else return

      e.preventDefault()
      e.stopPropagation()

      const from = pageKind(locationRef.current.pathname)
      const dest = pageKind(to)

      // Recipe → Recipe: clear names so old page is captured as a flat root snapshot
      // (matching legacy transitions.js pageswap behaviour — crossfade instead of curtains)
      if (from === 'recipe' && dest === 'recipe') {
        document.querySelectorAll<HTMLElement>('.recipe-image-panel, .post-content').forEach(el => {
          el.style.viewTransitionName = ''
        })
      }

      const doUpdate = () => { flushSync(() => navigateRef.current(to)) }

      if (!('startViewTransition' in document)) { navigateRef.current(to); return }

      try {
        ;(document as unknown as { startViewTransition: (o: { types: string[]; update: () => void }) => void })
          .startViewTransition({ types: [`from-${from}`, `to-${dest}`], update: doUpdate })
      } catch {
        document.startViewTransition(doUpdate)
      }
    }

    document.addEventListener('click', handleClick, { capture: true })
    return () => document.removeEventListener('click', handleClick, { capture: true })
  }, [])

  return (
    <div className="flex min-h-screen w-full font-inter bg-orange-50 text-orange-950">
      <Nav />
      <main className="relative flex-1 w-full">
        <Outlet />
      </main>
    </div>
  )
}
