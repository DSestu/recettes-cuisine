import { Outlet } from 'react-router-dom'
import { Nav } from './Nav'
import { PageTransition } from './PageTransition'

export function AppLayout() {
  return (
    <div className="flex min-h-screen w-full font-inter bg-orange-50 text-orange-950">
      <Nav />
      <main className="relative flex-1 w-full">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  )
}
