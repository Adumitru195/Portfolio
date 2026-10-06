import { useCallback, useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export type HomeSection = 'work' | 'contact'

const SPY_SECTIONS: HomeSection[] = ['work', 'contact']

/**
 * Navigation between the homepage sections and standalone pages.
 *
 * Section links are real links to `#/` carrying `{ scrollTo }` state, which
 * the homepage reads on arrival. When already on the homepage the click is
 * intercepted and the section scrolls smoothly instead.
 */
export function useSiteNavigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const onHome = location.pathname === '/'

  const goToSection = useCallback(
    (event: MouseEvent, id: HomeSection | 'top') => {
      if (!onHome) return
      event.preventDefault()
      if (id === 'top') window.scrollTo({ top: 0, behavior: 'smooth' })
      else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    },
    [onHome],
  )

  return { onHome, pathname: location.pathname, goToSection, navigate }
}

/** Which homepage section sits in the middle of the viewport, if any. */
export function useActiveHomeSection(enabled: boolean) {
  const [active, setActive] = useState<HomeSection | null>(null)

  useEffect(() => {
    if (!enabled) {
      setActive(null)
      return
    }
    const visible = new Set<HomeSection>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as HomeSection
          if (entry.isIntersecting) visible.add(id)
          else visible.delete(id)
        }
        setActive(SPY_SECTIONS.find((id) => visible.has(id)) ?? null)
      },
      // A thin band across the middle of the viewport.
      { rootMargin: '-45% 0px -50% 0px' },
    )
    SPY_SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [enabled])

  return active
}
