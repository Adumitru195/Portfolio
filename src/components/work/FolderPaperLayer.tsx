import { Suspense, lazy, useCallback, useEffect, useState, type MutableRefObject, type RefObject } from 'react'
import WebGLBoundary from '@/components/WebGLBoundary'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { folderPaper, offsetWithin } from '@/lib/folderPaper'
import { supportsWebGL } from '@/lib/webgl'
import type { FolderTint } from '@/data/work-folders'

const FolderPaperScene = lazy(() => import('@/components/work/FolderPaperScene'))

interface FolderPaperLayerProps {
  gridRef: RefObject<HTMLElement>
  slots: MutableRefObject<Map<string, HTMLElement>>
  cards: { id: string; tint: FolderTint }[]
  /** True once the 3D sheets are drawn, so the CSS sheets can step aside. */
  onActiveChange: (active: boolean) => void
}

// Rendered by the error boundary when the scene throws or its chunk fails.
function FailSignal({ onFail }: { onFail: () => void }) {
  useEffect(() => onFail(), [onFail])
  return null
}

/**
 * Loads the decorative 3D paper layer for the folder grid, only when it can
 * add something: a fine pointer (hover exists), no reduced-motion preference,
 * and working WebGL. It loads as the grid approaches the viewport and draws
 * only while the grid is on screen. Without it, the CSS folders are complete.
 */
export default function FolderPaperLayer({ gridRef, slots, cards, onActiveChange }: FolderPaperLayerProps) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const [webgl] = useState(supportsWebGL)
  const [near, setNear] = useState(false)
  const [inView, setInView] = useState(false)
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)
  const enabled = !reducedMotion && finePointer && webgl && !failed

  // Load ahead of time as the grid approaches; draw only while it is visible.
  useEffect(() => {
    const grid = gridRef.current
    if (!grid || !enabled) return
    const approach = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setNear(true)
    }, { rootMargin: '600px 0px' })
    const visible = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    approach.observe(grid)
    visible.observe(grid)
    return () => {
      approach.disconnect()
      visible.disconnect()
    }
  }, [gridRef, enabled])

  // Keep each preview's position in the grid up to date for the scene.
  useEffect(() => {
    const grid = gridRef.current
    if (!grid || !enabled || !near) return
    let frame = 0
    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        slots.current.forEach((element, id) => folderPaper.setSlot(id, offsetWithin(element, grid)))
      })
    }
    measure()
    // Re-measure on anything that can move a preview: the grid or a preview
    // resizing (breakpoints, fonts reflowing the tabs), the window, late fonts
    // and images finishing loading.
    const observer = new ResizeObserver(measure)
    observer.observe(grid)
    slots.current.forEach((element) => observer.observe(element))
    window.addEventListener('resize', measure)
    const images = [...grid.querySelectorAll('img')]
    images.forEach((image) => image.addEventListener('load', measure))
    document.fonts?.ready.then(measure)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', measure)
      images.forEach((image) => image.removeEventListener('load', measure))
    }
  }, [gridRef, slots, enabled, near])

  const active = enabled && near && ready
  useEffect(() => onActiveChange(active), [active, onActiveChange])

  const handleReady = useCallback(() => setReady(true), [])
  const handleFail = useCallback(() => {
    setFailed(true)
    setReady(false)
  }, [])

  if (!enabled || !near) return null
  return (
    <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
      <WebGLBoundary fallback={<FailSignal onFail={handleFail} />}>
        <Suspense fallback={null}>
          <FolderPaperScene cards={cards} running={inView} onReady={handleReady} onFail={handleFail} />
        </Suspense>
      </WebGLBoundary>
    </div>
  )
}
