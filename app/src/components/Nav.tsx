import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'

const HomeIcon = () => (
  <svg className="w-12 md:w-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 16.25H15V7.5H12V16.25H9V7.5H6V16.25C6 18.9 8.49 21.05 11.625 21.2125V32.5H15.375V21.2125C18.51 21.05 21 18.9 21 16.25V7.5H18V16.25ZM25.5 12.5V22.5H29.25V32.5H33V7.5C28.86 7.5 25.5 10.3 25.5 12.5Z" fill="currentColor" />
  </svg>
)

const SearchIcon = () => (
  <svg className="w-12 md:w-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M13 21.5C13 16.8056 16.8056 13 21.5 13C26.1944 13 30 16.8056 30 21.5C30 23.8248 29.0667 25.9315 27.5544 27.4661C27.5392 27.4801 27.5241 27.4946 27.5093 27.5093C27.4946 27.5241 27.4801 27.5392 27.4661 27.5544C25.9315 29.0667 23.8248 30 21.5 30C16.8056 30 13 26.1944 13 21.5ZM28.502 30.6233C26.5628 32.1139 24.1349 33 21.5 33C15.1487 33 10 27.8513 10 21.5C10 15.1487 15.1487 10 21.5 10C27.8513 10 33 15.1487 33 21.5C33 24.1349 32.1139 26.5628 30.6233 28.502L37.5607 35.4393C38.1464 36.0251 38.1464 36.9749 37.5607 37.5607C36.9749 38.1465 36.0251 38.1465 35.4393 37.5607L28.502 30.6233Z" fill="currentColor" />
  </svg>
)

const GitHubIcon = () => (
  <svg className="w-12 md:w-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M24 8C17.9256 8 13 12.9256 13 19V28.5C13 29.8816 11.8816 31 10.5 31C9.67157 31 9 31.6716 9 32.5C9 33.3284 9.67157 34 10.5 34H37.5C38.3284 34 39 33.3284 39 32.5C39 31.6716 38.3284 31 37.5 31C36.1184 31 35 29.8816 35 28.5V19C35 12.9256 30.0744 8 24 8ZM32 28.5C32 29.4003 32.2161 30.25 32.5994 31H15.4006C15.7839 30.25 16 29.4003 16 28.5V19C16 14.5824 19.5824 11 24 11C28.4176 11 32 14.5824 32 19V28.5ZM26.4 36C26.702 36 26.986 36.136 27.176 36.37C27.366 36.604 27.442 36.912 27.38 37.206C27.034 38.85 25.644 40 24.002 40C22.36 40 20.97 38.85 20.624 37.206C20.562 36.912 20.636 36.604 20.826 36.37C21.016 36.136 21.3 36 21.602 36H26.4Z" fill="#212121" />
  </svg>
)

const ChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
  </svg>
)

export function Nav() {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const lastScrollY = useRef(0)

  // Mobile: hide nav on scroll down, show on scroll up / at top
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    function onScroll() {
      if (!nav) return
      const isMobile = window.matchMedia('(max-width: 767px)').matches
      if (!isMobile) return
      const y = window.scrollY
      const goingDown = y > lastScrollY.current && y > 6
      if (goingDown) {
        nav.classList.add('nav-hidden')
        nav.classList.remove('nav-visible')
      } else {
        nav.classList.remove('nav-hidden')
        nav.classList.add('nav-visible')
      }
      lastScrollY.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Desktop: expand sidebar on strip hover, collapse on mouse leave
  useEffect(() => {
    const wrap = sidebarRef.current
    if (!wrap) return

    const strip = wrap.querySelector<HTMLElement>('#desktop-edge-strip')

    function expand() {
      wrap!.classList.add('desktop-sidebar-expanded')
      strip?.classList.remove('desktop-edge-strip--visible')
    }
    function collapse() {
      wrap!.classList.remove('desktop-sidebar-expanded')
    }
    function showStrip() {
      if (!wrap!.classList.contains('desktop-sidebar-expanded')) {
        strip?.classList.add('desktop-edge-strip--visible')
      }
    }
    function hideStrip() {
      strip?.classList.remove('desktop-edge-strip--visible')
    }

    wrap.addEventListener('mouseenter', expand)
    wrap.addEventListener('mouseleave', collapse)
    strip?.addEventListener('mouseenter', showStrip)
    strip?.addEventListener('mouseleave', hideStrip)

    return () => {
      wrap.removeEventListener('mouseenter', expand)
      wrap.removeEventListener('mouseleave', collapse)
      strip?.removeEventListener('mouseenter', showStrip)
      strip?.removeEventListener('mouseleave', hideStrip)
    }
  }, [])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col md:flex-row items-center gap-0 md:gap-2${isActive ? ' text-primary' : ''}`

  return (
    <div className="desktop-sidebar-wrap" ref={sidebarRef} id="desktop-sidebar-wrap">
      <div id="desktop-edge-strip" className="md:block hidden" aria-hidden="true" />
      <div className="desktop-sidebar-panel">
        <nav
          ref={navRef}
          className="mobile-nav nav-visible w-screen md:w-full md:h-full bg-orange-50 fixed md:relative left-0 right-0 bottom-0 overflow-x-hidden flex md:flex-col justify-between md:justify-start px-6 py-4 md:p-5 md:gap-3 z-[9999] shadow-3xl md:shadow-none"
          id="main-nav"
          aria-expanded="false"
        >
          <NavLink to="/" end className={linkClass}>
            <HomeIcon />
            <span className="text-sm md:text-xl font-medium md:font-gelica">Accueil</span>
          </NavLink>

          <NavLink to="/recherche" className={linkClass}>
            <SearchIcon />
            <span className="text-sm md:text-xl font-medium md:font-gelica">Recherche</span>
          </NavLink>

          <a
            href="https://github.com/DSestu/recettes-cuisine"
            className="flex flex-col md:flex-row items-center gap-0 md:gap-2"
            target="_blank"
            rel="noreferrer"
          >
            <GitHubIcon />
            <span className="text-sm md:text-xl font-medium md:font-gelica">Repository</span>
          </a>
        </nav>
        <button
          type="button"
          id="desktop-sidebar-open-btn"
          className="hidden md:flex"
          aria-label="Ouvrir le menu"
          title="Ouvrir le menu"
        >
          <ChevronIcon />
        </button>
      </div>
    </div>
  )
}
