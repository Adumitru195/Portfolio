import { Suspense, lazy, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MapPin } from '@phosphor-icons/react'
import type { Photo } from '@/data/about'
import { PHOTO_EASE, SCENE_BLEED, photoMotion } from '@/lib/aboutPhotoMotion'
import type { PanelRect, StageLayout } from '@/lib/aboutPhotoMotion'
import { supportsWebGL } from '@/lib/webgl'
import WebGLBoundary from '@/components/WebGLBoundary'

// Loaded only on desktops that will use it, so other devices never fetch Three.js.
const AboutPhotoScene = lazy(() => import('@/components/about/AboutPhotoScene'))

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

// Layout box of a panel, ignoring the entrance transform.
function rectOf(el: HTMLElement): PanelRect {
  return { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight }
}

function PhotoImage({ photo, sizes, className }: { photo: Photo; sizes: string; className: string }) {
  const largest = photo.sources[photo.sources.length - 1]
  return (
    <img
      src={largest.src}
      srcSet={photo.sources.map((s) => `${s.src} ${s.width}w`).join(', ')}
      sizes={sizes}
      width={photo.width}
      height={photo.height}
      alt={photo.alt}
      loading="eager"
      decoding="async"
      draggable={false}
      className={`block w-full h-full object-cover ${className}`}
    />
  )
}

function entrance(kind: 'main' | 'support') {
  const m = photoMotion[kind]
  return {
    initial: { opacity: 0, x: m.entrance.fromX, y: m.entrance.fromY, rotate: m.entrance.fromRotate },
    animate: { opacity: 1, x: 0, y: 0, rotate: m.rotate },
    transition: { delay: m.entrance.delay, duration: m.entrance.duration, ease: PHOTO_EASE },
  }
}

interface AboutPhotoStageProps {
  main: Photo
  support: Photo
  location: string
}

/**
 * The opening photo composition. A complete HTML version renders first (and
 * stays for phones, touch, reduced motion and any WebGL problem). Eligible
 * desktops then swap the two photos for Three.js panels once their textures
 * and first frame are ready; the panels share the HTML poses, so the swap is
 * seamless. Images keep their alt text in the HTML; the canvas is hidden from
 * assistive technology.
 */
export default function AboutPhotoStage({ main, support, location }: AboutPhotoStageProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const supportRef = useRef<HTMLDivElement>(null)
  const entranceStart = useRef(performance.now())

  const reduceMotion = useReducedMotion()
  const desktop = useMediaQuery('(min-width: 1024px)')
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const pageVisible = usePageVisible()
  const [webgl] = useState(supportsWebGL)
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)
  const [inView, setInView] = useState(true)
  const [layout, setLayout] = useState<StageLayout | null>(null)

  const eligible = desktop && finePointer && !reduceMotion && webgl && !failed
  const showScene = eligible && ready

  // Measure the panels' resting boxes, and again whenever the stage resizes.
  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage || !eligible) return
    const measure = () => {
      if (!mainRef.current || !supportRef.current) return
      setLayout({
        width: stage.offsetWidth,
        height: stage.offsetHeight,
        main: rectOf(mainRef.current),
        support: rectOf(supportRef.current),
      })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [eligible])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  // A scene that unmounts must prove itself ready again before it shows.
  useEffect(() => {
    if (!eligible) setReady(false)
  }, [eligible])

  const handleReady = useCallback(() => setReady(true), [])
  const handleFail = useCallback(() => {
    setFailed(true)
    setReady(false)
  }, [])

  const hideStatic = showScene ? 'opacity-0' : ''

  return (
    <motion.div
      ref={stageRef}
      variants={{ hidden: {}, visible: {} }}
      className="relative w-full sm:aspect-[537/620]"
    >
      {/* Backing shapes: a lavender plate and a cobalt outline */}
      <div
        aria-hidden="true"
        className="absolute top-8 -right-3 sm:top-[7%] sm:-right-5 w-[86%] sm:w-[74%] aspect-[4/5] rounded-[32px] bg-accent-highlight"
      />
      <div
        aria-hidden="true"
        className="absolute -top-4 left-[6%] sm:-top-5 sm:left-[14%] w-24 h-24 md:w-32 md:h-32 rounded-3xl border-2 border-accent"
      />

      {/* Main photo: full width on phones, the dominant panel from 640px */}
      <div
        ref={mainRef}
        className={`relative w-[92%] sm:absolute sm:top-0 sm:right-0 sm:w-[78%] aspect-[4/5] ${hideStatic}`}
      >
        <motion.div {...entrance('main')} className="w-full h-full">
          <PhotoImage
            photo={main}
            sizes="(min-width: 1280px) 420px, (min-width: 1024px) 310px, (min-width: 640px) 400px, 92vw"
            className="rounded-[28px] shadow-[0_32px_64px_-28px_rgba(49,46,129,0.45)]"
          />
        </motion.div>
      </div>

      {/* Supporting photo: smaller and offset, from 640px up */}
      <div
        ref={supportRef}
        className={`hidden sm:block absolute left-0 bottom-0 w-[40%] aspect-[4/5] ${hideStatic}`}
      >
        <motion.div {...entrance('support')} className="w-full h-full">
          <PhotoImage
            photo={support}
            sizes="(min-width: 1280px) 215px, (min-width: 1024px) 160px, 205px"
            className="rounded-[20px] border-4 border-bg shadow-[0_24px_48px_-20px_rgba(49,46,129,0.45)]"
          />
        </motion.div>
      </div>

      {eligible && layout && (
        <div
          aria-hidden="true"
          className={`absolute pointer-events-none ${showScene ? 'opacity-100' : 'opacity-0'}`}
          style={{ inset: -SCENE_BLEED }}
        >
          <WebGLBoundary fallback={<FailSignal onFail={handleFail} />}>
            <Suspense fallback={null}>
              <AboutPhotoScene
                stageRef={stageRef}
                layout={layout}
                main={main}
                support={support}
                entranceStart={entranceStart.current}
                active={inView && pageVisible}
                onReady={handleReady}
                onFail={handleFail}
              />
            </Suspense>
          </WebGLBoundary>
        </div>
      )}

      {/* Location tag, above the photos and the canvas */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.6, ease: PHOTO_EASE }}
        className="absolute z-20 left-3 bottom-5 sm:left-[16%] sm:bottom-auto sm:top-[7%] inline-flex items-center gap-2 rounded-full bg-accent text-white text-sm font-medium px-4 py-2 shadow-[0_12px_24px_-12px_rgba(79,70,229,0.6)]"
      >
        <MapPin size={16} weight="fill" aria-hidden="true" />
        {location}
      </motion.p>
    </motion.div>
  )
}
