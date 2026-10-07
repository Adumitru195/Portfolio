import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { BLEED, PERSPECTIVE, PIECES, STAGE_RATIO, faceDataUrl } from '@/lib/designStack'
import { supportsWebGL } from '@/lib/webgl'
import WebGLBoundary from '@/components/WebGLBoundary'

// Fetched only for eligible desktops, and only once the stage is near view.
const DesignStackScene = lazy(() => import('@/components/contact/DesignStackScene'))

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

// The resting composition in CSS 3D, using the camera distance of the
// Three.js scene as its perspective. Lengths are in `cqw` (stage widths).
function StaticStack({ hidden }: { hidden: boolean }) {
  return (
    <div
      className={`absolute inset-0 [transform-style:preserve-3d] ${hidden ? 'opacity-0' : ''}`}
      style={{ perspective: `${PERSPECTIVE * 100}cqw` }}
    >
      {PIECES.map((piece) => {
        const { shadow } = piece
        const radius = `${piece.radius}cqw`
        return (
          <div
            key={piece.id}
            className="absolute [transform-style:preserve-3d]"
            style={{
              left: `${piece.cx - piece.w / 2}%`,
              top: `${(piece.cy - piece.h / 2) / STAGE_RATIO}%`,
              width: `${piece.w}%`,
              height: `${piece.h / STAGE_RATIO}%`,
              transform: `translateZ(${piece.z}cqw) rotateZ(${piece.rotate.z}deg) rotateY(${piece.rotate.y}deg) rotateX(${piece.rotate.x}deg)`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                borderRadius: radius,
                background: piece.edge,
                transform: `translateZ(${-piece.depth}cqw)`,
                boxShadow: `0 ${shadow.y}cqw ${shadow.blur}cqw ${shadow.spread}cqw ${shadow.color}`,
              }}
            />
            <div
              className="absolute inset-0"
              style={{ borderRadius: radius, background: piece.edge, transform: `translateZ(${-piece.depth / 2}cqw)` }}
            />
            <img
              src={faceDataUrl(piece)}
              alt=""
              draggable={false}
              className="absolute inset-0 w-full h-full select-none"
              style={{ borderRadius: radius }}
            />
          </div>
        )
      })}
    </div>
  )
}

/**
 * Decorative composition beside the contact copy: a browser panel, a
 * typography tile and a palette tile.
 *
 * A static CSS version renders immediately and stays for touch devices,
 * narrow screens, reduced motion, missing WebGL, rendering errors and a lost
 * WebGL context. On eligible desktops a Three.js version loads near the
 * viewport, takes over once its first frame is ready, plays a short entrance
 * and tilts gently toward the pointer, rendering only while something moves.
 *
 * It has no link, button or focus stop, and lets scrolling pass through.
 */
export default function DesignStack({ className = '' }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const desktop = useMediaQuery('(min-width: 768px)')
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const pageVisible = usePageVisible()
  const [webgl] = useState(supportsWebGL)
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)
  const [near, setNear] = useState(false)
  const [inView, setInView] = useState(false)

  const eligible = desktop && finePointer && !reduceMotion && webgl && !failed
  const showScene = eligible && ready

  // Start loading a little before the stage scrolls into view.
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true)
      },
      { rootMargin: '400px 0px' },
    )
    const viewObserver = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    nearObserver.observe(el)
    viewObserver.observe(el)
    return () => {
      nearObserver.disconnect()
      viewObserver.disconnect()
    }
  }, [])

  // A scene that unmounts must report ready again before it is shown.
  useEffect(() => {
    if (!eligible) setReady(false)
  }, [eligible])

  const handleReady = useCallback(() => setReady(true), [])
  const handleFail = useCallback(() => {
    setFailed(true)
    setReady(false)
  }, [])

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className={`relative aspect-[100/88] [container-type:inline-size] select-none ${className}`}
      data-scene={showScene ? 'webgl' : 'static'}
    >
      <StaticStack hidden={showScene} />

      {eligible && near && (
        <div
          className={`absolute pointer-events-none ${showScene ? 'opacity-100' : 'opacity-0'}`}
          style={{ inset: `${-BLEED * 100}cqw` }}
        >
          <WebGLBoundary fallback={<FailSignal onFail={handleFail} />}>
            <Suspense fallback={null}>
              <DesignStackScene
                stageRef={stageRef}
                inView={inView}
                active={inView && pageVisible}
                onReady={handleReady}
                onFail={handleFail}
              />
            </Suspense>
          </WebGLBoundary>
        </div>
      )}
    </div>
  )
}
