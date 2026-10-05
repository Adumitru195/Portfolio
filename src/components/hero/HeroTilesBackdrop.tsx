import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { Pause, Play } from '@phosphor-icons/react'
import { HERO_TILES_ANIMATION_ENABLED } from '@/data/hero-tiles'
import {
  LAYOUT_START_TIME,
  compactTiles,
  laneTiles,
  measureHero,
  supportsLanes,
} from '@/lib/heroTilesLayout'
import type { HeroGeometry } from '@/lib/heroTilesLayout'
import { supportsWebGL } from '@/lib/webgl'
import WebGLBoundary from '@/components/WebGLBoundary'
import HeroTilesStatic from '@/components/hero/HeroTilesStatic'

// Lazy-loaded so Three.js is only fetched on devices that will animate.
const HeroTilesScene = lazy(() => import('@/components/hero/HeroTilesScene'))

// The headline's entrance moves its lines; measure once it has settled.
const ENTRANCE_MS = 1300
const RESIZE_DEBOUNCE_MS = 150

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
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
 * The homepage hero's decorative background: software tiles drifting right
 * to left beside the headline.
 *
 * A still HTML composition renders first and stays for reduced motion, touch
 * devices, narrow screens, a disabled flag or any WebGL failure. Eligible
 * desktops then fade in the Three.js scene, which only renders while the
 * hero is on screen, the tab is visible and the visitor hasn't paused it.
 */
export default function HeroTilesBackdrop({ contentRef }: { contentRef: RefObject<HTMLElement> }) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [geometry, setGeometry] = useState<HeroGeometry | null>(null)
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const pageVisible = usePageVisible()
  const [inView, setInView] = useState(true)
  const [paused, setPaused] = useState(false)
  const [failed, setFailed] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)
  const [webgl] = useState(supportsWebGL)

  // Measure the text the tiles must avoid, then again on every resize.
  useEffect(() => {
    const frame = frameRef.current
    const content = contentRef.current
    if (!frame || !content) return
    let cancelled = false
    let debounce = 0
    const measure = () => {
      if (!cancelled) setGeometry(measureHero(frame, content))
    }
    const observer = new ResizeObserver(() => {
      window.clearTimeout(debounce)
      debounce = window.setTimeout(measure, RESIZE_DEBOUNCE_MS)
    })
    const start = window.setTimeout(() => {
      document.fonts.ready.then(() => {
        if (cancelled) return
        measure()
        observer.observe(frame)
      })
    }, ENTRANCE_MS)
    return () => {
      cancelled = true
      window.clearTimeout(start)
      window.clearTimeout(debounce)
      observer.disconnect()
    }
  }, [contentRef])

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  const lanes = geometry !== null && finePointer && supportsLanes(geometry)
  const animate = HERO_TILES_ANIMATION_ENABLED && lanes && !reducedMotion && webgl && !failed
  const running = inView && pageVisible && !paused

  const stillTiles = useMemo(() => {
    if (!geometry) return []
    return lanes ? laneTiles(geometry, LAYOUT_START_TIME) : compactTiles(geometry)
  }, [geometry, lanes])

  const handleReady = useCallback(() => setSceneReady(true), [])
  const handleFail = useCallback(() => {
    setFailed(true)
    setSceneReady(false)
  }, [])

  // A scene that unmounts (resize, failure) must fade in again from scratch.
  useEffect(() => {
    if (!animate) setSceneReady(false)
  }, [animate])

  const showScene = animate && sceneReady

  return (
    <>
      <div ref={frameRef} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <HeroTilesStatic tiles={stillTiles} visible={geometry !== null && !showScene} />
        {animate && geometry && (
          <div
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${showScene ? 'opacity-100' : 'opacity-0'}`}
          >
            <WebGLBoundary fallback={<FailSignal onFail={handleFail} />}>
              <Suspense fallback={null}>
                <HeroTilesScene
                  geometry={geometry}
                  running={running}
                  onReady={handleReady}
                  onFail={handleFail}
                />
              </Suspense>
            </WebGLBoundary>
          </div>
        )}
      </div>

      {showScene && (
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          className="absolute z-20 bottom-6 right-6 md:right-10 inline-flex items-center gap-2 rounded-full border border-subtle bg-bg/80 px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors duration-200 hover:text-text-primary hover:border-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {paused ? <Play size={12} weight="fill" aria-hidden="true" /> : <Pause size={12} weight="fill" aria-hidden="true" />}
          {paused ? 'Resume background animation' : 'Pause background animation'}
        </button>
      )}
    </>
  )
}
