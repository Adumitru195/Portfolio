import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'

type Viewport = { once?: boolean; margin?: string; amount?: number | 'some' | 'all' }

/**
 * Props for a scroll reveal on a Framer Motion element whose variants define
 * `hidden` and `visible`.
 *
 * Reveals start content at opacity 0 and rely on an IntersectionObserver to
 * show it. Whenever that can't be trusted, the content is simply shown from
 * the start instead (and `whileInView`, which needs the observer, is not
 * used at all):
 *  - reduced motion (system setting or the footer toggle);
 *  - no IntersectionObserver in this browser.
 *
 * Printing is covered in CSS (index.css forces revealed content visible).
 */
export function useReveal(viewport: Viewport = { once: true, margin: '-10% 0px' }) {
  const reduceMotion = useReducedMotionPreference()
  const canObserve = typeof window !== 'undefined' && 'IntersectionObserver' in window
  if (reduceMotion || !canObserve) return { initial: false, animate: 'visible' } as const
  return { initial: 'hidden', whileInView: 'visible', viewport } as const
}

/** Whether scroll reveals are live (false: content shows from the start). */
export function useRevealsEnabled() {
  const reduceMotion = useReducedMotionPreference()
  return !reduceMotion && typeof window !== 'undefined' && 'IntersectionObserver' in window
}
