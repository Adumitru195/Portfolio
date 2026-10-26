import { useSyncExternalStore } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { getUserReduceMotion, subscribeUserReduceMotion } from '@/lib/motionPreference'

/** The footer toggle's "Reduce motion" choice on its own. */
export function useUserReduceMotion() {
  return useSyncExternalStore(subscribeUserReduceMotion, getUserReduceMotion)
}

/** The system reduced-motion setting on its own. */
export function useSystemReduceMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/**
 * True when decorative motion should stop: the system asks for reduced
 * motion, or the visitor turned on "Reduce motion" in the footer.
 */
export function useReducedMotionPreference() {
  const system = useSystemReduceMotion()
  const user = useUserReduceMotion()
  return system || user
}
