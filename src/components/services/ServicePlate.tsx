import { useEffect, useRef, useState } from 'react'
import type { PointerEvent, ReactNode, RefObject } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'

/** Where an illustration is in its one-time story. */
export type PlayState = 'start' | 'playing' | 'final'

/** Pointer tilt, in degrees, at the plate's edges. */
const TILT = { x: 5, y: 7 }
const SPRING = { stiffness: 100, damping: 20 }

/**
 * Plays an illustration once, the first time most of it is on screen.
 *
 * Reduced motion (system or footer toggle) and browsers without
 * IntersectionObserver go straight to the finished state, so the drawing is
 * always complete and still. If the observer never fires (for instance a
 * full-page capture that never scrolls) the illustration simply stays at its
 * first frame, which is a complete drawing too.
 */
function usePlayState(ref: RefObject<HTMLElement>): { state: PlayState; instant: boolean } {
  const reduceMotion = useReducedMotionPreference()
  const canObserve = typeof window !== 'undefined' && 'IntersectionObserver' in window
  const instant = reduceMotion || !canObserve
  const [played, setPlayed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (instant || played || !el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlayed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.55 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, instant, played])

  if (instant) return { state: 'final', instant: true }
  return { state: played ? 'playing' : 'start', instant: false }
}

interface ServicePlateProps {
  children: (state: PlayState, instant: boolean) => ReactNode
}

/**
 * The work surface each service illustration sits on: the hero's dot-grid
 * mat in a bordered plate. Its contents are layered with CSS 3D
 * (`translateZ`), and on desktops with a mouse the plate tilts a few degrees
 * toward the pointer on a damped spring, so nearer layers drift more.
 *
 * Illustration sizes are in `em` against a root of 1cqw, so every drawing
 * scales with the plate. Decorative: hidden from assistive technology, and
 * it never takes focus or blocks scrolling.
 */
export default function ServicePlate({ children }: ServicePlateProps) {
  const plateRef = useRef<HTMLDivElement>(null)
  const { state, instant } = usePlayState(plateRef)
  const reduceMotion = useReducedMotionPreference()
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const tiltEnabled = finePointer && !reduceMotion

  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const rotateX = useSpring(rx, SPRING)
  const rotateY = useSpring(ry, SPRING)

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!tiltEnabled || event.pointerType !== 'mouse') return
    const r = event.currentTarget.getBoundingClientRect()
    const px = ((event.clientX - r.left) / r.width) * 2 - 1
    const py = ((event.clientY - r.top) / r.height) * 2 - 1
    rx.set(-py * TILT.x)
    ry.set(px * TILT.y)
  }
  const onPointerLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <div
      ref={plateRef}
      aria-hidden="true"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative aspect-[16/10] w-full select-none overflow-hidden rounded-[18px] border border-desk-line desk-grid [container-type:inline-size] [perspective:1400px]"
    >
      <motion.div
        className="absolute inset-0 text-[1cqw] [transform-style:preserve-3d]"
        style={tiltEnabled ? { rotateX, rotateY } : undefined}
      >
        {children(state, instant)}
      </motion.div>
    </div>
  )
}
