import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/**
 * Decides where each page starts scrolling. Rendered once inside the router.
 *
 *  - Fresh visit or refresh: the top of the page, unless the URL names a
 *    homepage section (`#/?section=work`). Link state left in history from
 *    an earlier click is ignored, since browsers keep it across reloads.
 *  - Link navigation: the section a link asked for with `state.scrollTo`,
 *    otherwise the top.
 *  - Back / Forward: the position the visitor left that history entry at.
 *
 * Browser scroll restoration is switched off in main.tsx, and every jump
 * here is instant so the site's CSS smooth scrolling doesn't animate it.
 * Same-page section links still scroll smoothly on their own.
 */

const SECTIONS = new Set(['work', 'contact'])
const STORAGE_KEY = 'portfolio-scroll-positions'

type Positions = Record<string, number>

function readPositions(): Positions {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '{}') as Positions
  } catch {
    return {}
  }
}

function writePositions(positions: Positions) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions))
  } catch {
    // Storage can be unavailable (private mode); positions then last only
    // for this page session.
  }
}

function jumpTo(top: number) {
  window.scrollTo({ top, left: 0, behavior: 'instant' })
}

function jumpToSection(id: string) {
  const el = SECTIONS.has(id) ? document.getElementById(id) : null
  if (!el) return false
  el.scrollIntoView({ behavior: 'instant', block: 'start' })
  return true
}

export default function ScrollManager() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const positions = useRef<Positions>(readPositions())
  const currentKey = useRef(location.key)
  const handledKey = useRef<string | null>(null)

  // Remember the scroll position of the current history entry.
  useEffect(() => {
    const onScroll = () => {
      positions.current[currentKey.current] = Math.round(window.scrollY)
    }
    const onPageHide = () => writePositions(positions.current)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pagehide', onPageHide)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pagehide', onPageHide)
    }
  }, [])

  // Runs after the new route's DOM is in place, before the browser paints.
  useLayoutEffect(() => {
    if (handledKey.current === location.key) return
    const firstLoad = handledKey.current === null
    handledKey.current = location.key
    currentKey.current = location.key
    writePositions(positions.current)

    if (firstLoad) {
      const section = new URLSearchParams(location.search).get('section')
      if (location.pathname === '/' && section && jumpToSection(section)) {
        // Web fonts can reflow the page above the target; re-align once
        // they're ready unless the visitor has already scrolled.
        const placed = Math.round(window.scrollY)
        document.fonts?.ready.then(() => {
          if (Math.round(window.scrollY) === placed) jumpToSection(section)
        })
        return
      }
      jumpTo(0)
      return
    }

    if (navigationType === 'POP') {
      const saved = positions.current[location.key]
      jumpTo(saved ?? 0)
      return
    }

    const target = (location.state as { scrollTo?: string } | null)?.scrollTo
    if (target && jumpToSection(target)) return
    jumpTo(0)
  }, [location, navigationType])

  return null
}
