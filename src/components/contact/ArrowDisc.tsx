import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ARROW_PATH, ARROW_ROUNDING, DISC_ARROW, DISC_BLEED, DISC_FACE } from '@/lib/arrowDisc'
import { supportsWebGL } from '@/lib/webgl'
import WebGLBoundary from '@/components/WebGLBoundary'

// Fetched only for eligible desktops, and only once the disc is near view.
const ArrowDiscScene = lazy(() => import('@/components/contact/ArrowDiscScene'))

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

function FailSignal({ onFail }: { onFail: () => void }) {
  useEffect(() => onFail(), [onFail])
  return null
}

interface ArrowDiscProps {
  href: string
  label: string
  /** Sizing classes for the square disc. */
  className: string
  /** Only the desktop instance may upgrade to Three.js. */
  allowScene?: boolean
}

/**
 * A pale lavender disc with a north-east arrow, acting as an email link.
 *
 * The link is plain HTML, so activation is immediate and keyboard focus is
 * native. A static SVG disc renders first and stays for touch, reduced
 * motion, missing WebGL or any rendering failure. On eligible desktops a
 * Three.js disc loads near the viewport and takes over once its first frame
 * is ready; it tilts toward the pointer, lifts the arrow on hover and
 * presses in on click, rendering only while it moves.
 */
export default function ArrowDisc({ href, label, className, allowScene = true }: ArrowDiscProps) {
  const linkRef = useRef<HTMLAnchorElement>(null)
  const reduceMotion = useReducedMotion()
  const desktop = useMediaQuery('(min-width: 768px)')
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const pageVisible = usePageVisible()
  const [webgl] = useState(supportsWebGL)
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)
  const [near, setNear] = useState(false)
  const [inView, setInView] = useState(false)
  const [size, setSize] = useState(0)

  const eligible = allowScene && desktop && finePointer && !reduceMotion && webgl && !failed
  const showScene = eligible && ready

  // Start loading a little before the disc scrolls into view.
  useEffect(() => {
    const el = linkRef.current
    if (!el) return
    const nearObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setNear(true)
    }, { rootMargin: '400px 0px' })
    const viewObserver = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    nearObserver.observe(el)
    viewObserver.observe(el)
    return () => {
      nearObserver.disconnect()
      viewObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const el = linkRef.current
    if (!el || !eligible) return
    const measure = () => setSize(el.offsetWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [eligible])

  useEffect(() => {
    if (!eligible) setReady(false)
  }, [eligible])

  const handleReady = useCallback(() => setReady(true), [])
  const handleFail = useCallback(() => {
    setFailed(true)
    setReady(false)
  }, [])

  const bleed = Math.round(size * DISC_BLEED)

  return (
    <a
      ref={linkRef}
      href={href}
      aria-label={label}
      className={`group relative block shrink-0 aspect-square rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent ${className}`}
    >
      {/* Soft, tinted contact shadow shared by both versions */}
      <span
        aria-hidden="true"
        className="absolute left-[18%] right-[18%] -bottom-[5%] h-[12%] rounded-[50%] bg-accent/15 blur-xl"
      />

      <svg
        aria-hidden="true"
        viewBox="-1 -1 2 2"
        className={`absolute inset-0 w-full h-full overflow-visible ${showScene ? 'opacity-0' : ''}`}
      >
        <circle r="1" fill={DISC_FACE} />
        <path
          d={ARROW_PATH}
          fill={DISC_ARROW}
          stroke={DISC_ARROW}
          strokeWidth={ARROW_ROUNDING * 2}
          strokeLinejoin="round"
        />
      </svg>

      {eligible && near && size > 0 && (
        <span
          aria-hidden="true"
          className={`absolute pointer-events-none ${showScene ? 'opacity-100' : 'opacity-0'}`}
          style={{ inset: -bleed }}
        >
          <WebGLBoundary fallback={<FailSignal onFail={handleFail} />}>
            <Suspense fallback={null}>
              <ArrowDiscScene
                linkRef={linkRef}
                discSize={size}
                bleed={bleed}
                active={inView && pageVisible}
                onReady={handleReady}
                onFail={handleFail}
              />
            </Suspense>
          </WebGLBoundary>
        </span>
      )}
    </a>
  )
}
