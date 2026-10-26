import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import type { MutableRefObject, RefObject } from 'react'
import WebGLBoundary from '@/components/WebGLBoundary'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'
import { supportsWebGL } from '@/lib/webgl'
import type { ServiceColumn } from '@/components/services/ServiceVisualsScene'

// Fetched only for eligible screens, and only once the list is near view.
const ServiceVisualsScene = lazy(() => import('@/components/services/ServiceVisualsScene'))

interface ServiceVisualsLayerProps {
  gridRef: RefObject<HTMLElement>
  columns: MutableRefObject<ServiceColumn[]>
  /** Whether the section's text has finished its entrance. */
  revealed: boolean
  /** True once the 3D visuals are drawn, so the static ones can step aside. */
  onActiveChange: (active: boolean) => void
}

function usePageVisible() {
  const [visible, setVisible] = useState(() => !document.hidden)
  useEffect(() => {
    const onChange = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])
  return visible
}

// Rendered by the error boundary when the scene throws or its chunk fails.
function FailSignal({ onFail }: { onFail: () => void }) {
  useEffect(() => onFail(), [onFail])
  return null
}

/**
 * Loads the Three.js versions of the service visuals on screens wide enough
 * for the three-column layout, with no reduced-motion preference and working
 * WebGL. Phones, reduced motion and any failure keep the static SVGs, with
 * no animation loop at all. The canvas never takes pointer or keyboard input.
 */
export default function ServiceVisualsLayer({ gridRef, columns, revealed, onActiveChange }: ServiceVisualsLayerProps) {
  const reducedMotion = useReducedMotionPreference()
  const desktop = useMediaQuery('(min-width: 768px)')
  const pageVisible = usePageVisible()
  const [webgl] = useState(supportsWebGL)
  const [near, setNear] = useState(false)
  const [inView, setInView] = useState(false)
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)
  const enabled = desktop && !reducedMotion && webgl && !failed

  // Load ahead of time as the list approaches; draw only while it is visible.
  useEffect(() => {
    const grid = gridRef.current
    if (!grid || !enabled) return
    const approach = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true)
      },
      { rootMargin: '400px 0px' },
    )
    const visible = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    approach.observe(grid)
    visible.observe(grid)
    return () => {
      approach.disconnect()
      visible.disconnect()
    }
  }, [gridRef, enabled])

  // A scene that unmounts must report ready again before it is shown.
  useEffect(() => {
    if (!enabled) setReady(false)
  }, [enabled])

  const active = enabled && near && ready && revealed
  useEffect(() => onActiveChange(active), [active, onActiveChange])

  const handleReady = useCallback(() => setReady(true), [])
  const handleFail = useCallback(() => {
    setFailed(true)
    setReady(false)
  }, [])

  if (!enabled || !near) return null
  return (
    <div
      className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out ${active ? 'opacity-100' : 'opacity-0'}`}
      aria-hidden="true"
    >
      <WebGLBoundary fallback={<FailSignal onFail={handleFail} />}>
        <Suspense fallback={null}>
          <ServiceVisualsScene
            gridRef={gridRef}
            columns={columns}
            inView={inView && revealed}
            running={inView && pageVisible}
            onReady={handleReady}
            onFail={handleFail}
          />
        </Suspense>
      </WebGLBoundary>
    </div>
  )
}
