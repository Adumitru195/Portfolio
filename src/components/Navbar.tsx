import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { ArrowUpRight, List, X } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { footer } from '@/data/contact'
import { useActiveHomeSection, useSiteNavigation } from '@/hooks/useSiteNavigation'
import type { HomeSection } from '@/hooks/useSiteNavigation'

type NavItem =
  | { label: string; kind: 'section'; id: HomeSection }
  | { label: string; kind: 'page'; to: string }

// Contact is reached through the "Get in touch" button, so it isn't repeated here.
const navItems: NavItem[] = [
  { label: 'Work', kind: 'section', id: 'work' },
  { label: 'About', kind: 'page', to: '/about' },
]

const ctaLabel = 'Get in touch'

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'

/**
 * The shared header for the homepage and the About page. Its content box
 * matches the hero's (`px-6 md:px-10` around a `max-w-6xl` column), so the
 * wordmark sits on the same left edge as the headline.
 */
export default function Navbar() {
  const { onHome, pathname, goToSection } = useSiteNavigation()
  const activeSection = useActiveHomeSection(onHome)
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Close the menu on any route change.
  useEffect(() => setMenuOpen(false), [pathname])

  // Escape closes the menu and returns focus to its toggle; widening the
  // window past the mobile breakpoint closes it too.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setMenuOpen(false)
      toggleRef.current?.focus()
    }
    const desktop = window.matchMedia('(min-width: 768px)')
    const onResize = () => desktop.matches && setMenuOpen(false)
    document.addEventListener('keydown', onKey)
    desktop.addEventListener('change', onResize)
    return () => {
      document.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', onResize)
    }
  }, [menuOpen])

  // A link inside the open menu closes it. Focus moves back to the toggle
  // before the link unmounts, so keyboard users aren't dropped on <body>.
  const closeMenu = () => {
    if (!menuOpen) return
    setMenuOpen(false)
    toggleRef.current?.focus({ preventScroll: true })
  }

  const isActive = (item: NavItem) =>
    item.kind === 'page' ? pathname === item.to : onHome && activeSection === item.id

  function renderLink(item: NavItem, className: string, mark: (active: boolean) => JSX.Element) {
    const active = isActive(item)
    const classes = `${className} ${active ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`
    if (item.kind === 'page') {
      return (
        <Link to={item.to} aria-current={active ? 'page' : undefined} onClick={closeMenu} className={classes}>
          {item.label}
          {mark(active)}
        </Link>
      )
    }
    return (
      <Link
        to="/"
        state={{ scrollTo: item.id }}
        aria-current={active ? 'location' : undefined}
        onClick={(e) => {
          closeMenu()
          goToSection(e, item.id)
        }}
        className={classes}
      >
        {item.label}
        {mark(active)}
      </Link>
    )
  }

  return (
    <MotionConfig reducedMotion="user">
      <header className="fixed top-0 inset-x-0 z-50 px-6 md:px-10 bg-bg/85 backdrop-blur-md border-b border-black/[0.06]">
        <nav aria-label="Main" className="max-w-6xl mx-auto h-16 flex items-center justify-between gap-6">
          <Link
            to="/"
            onClick={(e) => {
              closeMenu()
              goToSection(e, 'top')
            }}
            className={`font-display font-black text-2xl md:text-[1.625rem] leading-none tracking-tightest text-text-primary hover:opacity-80 transition-opacity duration-200 rounded-sm ${focusRing}`}
          >
            {footer.wordmark}
            <span className="text-accent">.</span>
            <span className="sr-only">, home</span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.label}>
                  {renderLink(
                    item,
                    `group relative inline-flex py-2 text-sm font-medium transition-colors duration-200 rounded-sm ${focusRing}`,
                    (active) => <Underline active={active} />,
                  )}
                </li>
              ))}
            </ul>

            <Link
              to="/"
              state={{ scrollTo: 'contact' }}
              onClick={(e) => goToSection(e, 'contact')}
              className={`group inline-flex items-center gap-1.5 text-sm font-medium text-white bg-accent hover:bg-accent-dim px-4 py-2 rounded-full transition-colors duration-200 ${focusRing}`}
            >
              {ctaLabel}
              <ArrowUpRight
                size={14}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:transform-none"
              />
            </Link>
          </div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className={`md:hidden -mr-3 p-3 rounded-full text-text-primary hover:bg-surface-raised transition-colors duration-200 ${focusRing}`}
          >
            {menuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              className="md:hidden -mx-6 border-t border-subtle bg-bg"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <ul className="px-6 py-4 flex flex-col">
                {navItems.map((item) => (
                  <li key={item.label}>
                    {renderLink(
                      item,
                      `flex items-center justify-between py-3 font-display font-bold text-2xl tracking-tight transition-colors duration-200 rounded-sm ${focusRing}`,
                      (active) => <SideMark active={active} />,
                    )}
                  </li>
                ))}
                <li className="mt-3 pt-4 border-t border-subtle">
                  <Link
                    to="/"
                    state={{ scrollTo: 'contact' }}
                    onClick={(e) => {
                      closeMenu()
                      goToSection(e, 'contact')
                    }}
                    className={`flex items-center justify-between py-3 font-display font-bold text-2xl tracking-tight text-accent hover:text-accent-dim transition-colors duration-200 rounded-sm ${focusRing}`}
                  >
                    {ctaLabel}
                    <ArrowUpRight size={22} weight="bold" aria-hidden="true" />
                  </Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </MotionConfig>
  )
}

// Desktop: an accent rule that draws in from the left on hover and stays
// drawn on the active link. Only `transform` animates.
function Underline({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute left-0 right-0 bottom-1 h-px origin-left bg-accent transition-transform duration-300 ease-out motion-reduce:transition-none ${
        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
      }`}
    />
  )
}

// Mobile menu: a short accent rule beside the active link.
function SideMark({ active }: { active: boolean }) {
  if (!active) return <></>
  return <span aria-hidden="true" className="block h-px w-4 bg-accent" />
}
