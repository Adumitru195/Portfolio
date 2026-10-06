import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, List, X } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { person } from '@/data/person'
import { useActiveHomeSection, useSiteNavigation } from '@/hooks/useSiteNavigation'
import type { HomeSection } from '@/hooks/useSiteNavigation'

type NavItem =
  | { label: string; kind: 'section'; id: HomeSection }
  | { label: string; kind: 'page'; to: string }

const navItems: NavItem[] = [
  { label: 'Work', kind: 'section', id: 'work' },
  { label: 'About', kind: 'page', to: '/about' },
  { label: 'Contact', kind: 'section', id: 'contact' },
]

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'

export default function Navbar() {
  const { scrollY } = useScroll()
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1])
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

  const isActive = (item: NavItem) =>
    item.kind === 'page' ? pathname === item.to : onHome && activeSection === item.id

  function renderLink(item: NavItem, className: string) {
    const active = isActive(item)
    const classes = `${className} ${active ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`
    if (item.kind === 'page') {
      return (
        <Link
          to={item.to}
          aria-current={active ? 'page' : undefined}
          onClick={() => setMenuOpen(false)}
          className={classes}
        >
          {item.label}
          <ActiveMark active={active} />
        </Link>
      )
    }
    return (
      <Link
        to="/"
        state={{ scrollTo: item.id }}
        onClick={(e) => {
          setMenuOpen(false)
          goToSection(e, item.id)
        }}
        className={classes}
      >
        {item.label}
        <ActiveMark active={active} />
      </Link>
    )
  }

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 glass"
      style={{ borderBottomWidth: 1, borderBottomColor: `rgba(0,0,0,${borderOpacity.get() * 0.08})` }}
    >
      <nav aria-label="Main" className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Link
          to="/"
          onClick={(e) => {
            setMenuOpen(false)
            goToSection(e, 'top')
          }}
          className={`font-display font-bold text-text-primary tracking-tight hover:text-accent transition-colors duration-200 rounded-sm ${focusRing}`}
        >
          {person.name.split(' ')[0]}<span className="text-text-muted">.</span>
          <span className="sr-only">, home</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.label}>
              {renderLink(item, `relative text-sm transition-colors duration-200 rounded-sm ${focusRing}`)}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
            <Link
              to="/"
              state={{ scrollTo: 'contact' }}
              onClick={(e) => {
                setMenuOpen(false)
                goToSection(e, 'contact')
              }}
              className={`flex items-center gap-1.5 text-sm font-medium text-white bg-accent hover:bg-accent-dim px-4 py-2 rounded-full transition-colors duration-200 ${focusRing}`}
            >
              Get in touch
              <ArrowUpRight size={14} weight="bold" />
            </Link>
          </motion.div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className={`md:hidden -mr-2 p-2 rounded-full text-text-primary hover:bg-surface-raised transition-colors duration-200 ${focusRing}`}
          >
            {menuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="md:hidden border-t border-subtle bg-bg"
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
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

// A short accent rule under (desktop) or beside (mobile) the active link.
function ActiveMark({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <span
      aria-hidden="true"
      className="block h-px w-4 bg-accent md:absolute md:left-0 md:-bottom-1.5 md:w-full"
    />
  )
}
