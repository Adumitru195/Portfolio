import { useEffect, useState } from 'react'
import type * as THREE from 'three'

/**
 * Helpers for the indigo wireframe wave used by the case-study backdrop
 * (src/components/CaseStudyBackdrop.tsx).
 */

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

export function displace(positions: THREE.BufferAttribute, base: Float32Array, t: number) {
  for (let i = 0; i < positions.count; i++) {
    const x = base[i * 3]
    const y = base[i * 3 + 1]
    // Two overlapping waves on different axes/frequencies for an organic ripple.
    const z =
      Math.sin(x * 0.5 + t) * 0.42 +
      Math.sin(y * 0.4 + t * 0.8) * 0.34 +
      Math.sin((x + y) * 0.3 + t * 0.6) * 0.26
    positions.setZ(i, z)
  }
  positions.needsUpdate = true
}
