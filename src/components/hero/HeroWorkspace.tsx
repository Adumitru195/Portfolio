import { Suspense, lazy, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { motion } from 'framer-motion'
import { heroWorkspaceAssets as assets } from '@/data/hero'
import {
  PANEL_ORDER,
  SCENE_BLEED,
  WORKSPACE_EASE,
  computeLayout,
  paintPanel,
  panelMotion,
} from '@/lib/heroWorkspace'
import type { PanelKind, PanelPose, WorkspaceImages, WorkspaceLayout } from '@/lib/heroWorkspace'
import { supportsWebGL } from '@/lib/webgl'
import WebGLBoundary from '@/components/WebGLBoundary'
import WebGLFailSignal from '@/components/WebGLFailSignal'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePageVisible } from '@/hooks/usePageVisible'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'

// Loaded only on desktops that will use it, so other devices never fetch Three.js.
const HeroWorkspaceScene = lazy(() => import('@/components/hero/HeroWorkspaceScene'))

// Waiting longer than this for images starts the entrance anyway; panels
// whose image hasn't arrived paint a neutral fill and repaint when it does.
const ASSET_TIMEOUT_MS = 2500

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Image failed: ${src}`))
    img.src = src
  })
}

/** Loads the three screenshots and the UI font the panels are painted with. */
function useWorkspaceAssets() {
  const [images, setImages] = useState<WorkspaceImages>({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const loaded: WorkspaceImages = {}
    const keys = ['wireframe', 'browser', 'phone'] as const
    const jobs = keys.map((key) =>
      loadImage(assets[key].src)
        .then((img) => {
          loaded[key] = img
          if (!cancelled) setImages((prev) => ({ ...prev, [key]: img }))
        })
        .catch(() => undefined),
    )
    const font = document.fonts
      ? Promise.all([document.fonts.load('500 12px Geist'), document.fonts.load('400 12px Geist')]).catch(() => undefined)
      : Promise.resolve()
    const timeout = new Promise((resolve) => window.setTimeout(resolve, ASSET_TIMEOUT_MS))
    Promise.race([Promise.all([...jobs, font]), timeout]).then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return { images, ready }
}

const SHADOW: Record<PanelKind, string> = {
  wireframe: 'shadow-[0_1px_2px_rgba(46,43,110,0.05),0_14px_30px_-18px_rgba(46,43,110,0.28)]',
  browser: 'shadow-[0_1px_2px_rgba(46,43,110,0.06),0_30px_60px_-28px_rgba(46,43,110,0.38)]',
  components: 'shadow-[0_1px_2px_rgba(46,43,110,0.06),0_22px_40px_-20px_rgba(46,43,110,0.36)]',
  phone: 'drop-shadow-[0_22px_22px_rgba(46,43,110,0.22)]',
  chip: 'shadow-[0_1px_2px_rgba(46,43,110,0.06),0_10px_22px_-12px_rgba(46,43,110,0.4)]',
}

interface PanelProps {
  pose: PanelPose
  assemble: boolean
  canvasRef: (el: HTMLCanvasElement | null) => void
}

function Panel({ pose, assemble, canvasRef }: PanelProps) {
  const m = panelMotion[pose.kind]
  // The assembly on desktop; elsewhere a short fade in place.
  const initial = assemble
    ? { opacity: 0, x: m.fromX, y: m.fromY, rotate: pose.rotate + m.fromRotate }
    : { opacity: 0, x: 0, y: 0, rotate: pose.rotate }
  const transition = assemble
    ? { delay: m.delay, duration: m.duration, ease: WORKSPACE_EASE }
    : { delay: m.delay * 0.4, duration: 0.6, ease: 'easeOut' as const }
  return (
    <motion.div
      className="absolute"
      style={{ left: pose.x, top: pose.y, width: pose.w, height: pose.h }}
      initial={initial}
      animate={{ opacity: 1, x: 0, y: 0, rotate: pose.rotate }}
      transition={transition}
    >
      <canvas
        ref={canvasRef}
        className={`block w-full h-full ${SHADOW[pose.kind]}`}
        style={{ borderRadius: pose.kind === 'phone' ? 0 : pose.radius }}
      />
    </motion.div>
  )
}

interface HeroWorkspaceProps {
  /** The element whose pointer movement steers the parallax (the hero). */
  interactionRef: RefObject<HTMLElement>
}

/**
 * The hero's composition: Porchlight's wireframe, the finished Porchlight
 * page, a few of its components and Backwater Journal on iPhone, laid on a
 * shared work surface.
 *
 * A complete HTML version renders first and is what phones, touch screens,
 * reduced motion and any WebGL problem keep. Eligible desktops load the
 * Three.js scene, which replays the same assembly from the same start time,
 * takes over on its first frame, then follows the pointer with a little
 * depth. Both draw the same painted canvases, so the swap is invisible. The
 * whole stage is decorative and hidden from assistive technology.
 */
export default function HeroWorkspace({ interactionRef }: HeroWorkspaceProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const canvases = useRef<Partial<Record<PanelKind, HTMLCanvasElement>>>({})
  const [layout, setLayout] = useState<WorkspaceLayout | null>(null)
  const [paintVersion, setPaintVersion] = useState(0)
  const [entranceStart, setEntranceStart] = useState<number | null>(null)
  const { images, ready } = useWorkspaceAssets()

  const reduceMotion = useReducedMotionPreference()
  const desktop = useMediaQuery('(min-width: 1024px)')
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const pageVisible = usePageVisible()
  const [webgl] = useState(supportsWebGL)
  const [failed, setFailed] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)
  const [inView, setInView] = useState(true)

  const assemble = desktop && !reduceMotion
  const eligible = desktop && finePointer && !reduceMotion && webgl && !failed && layout !== null && !layout.compact
  const showScene = eligible && sceneReady

  // Lay the panels out for the stage's size, and again on every resize.
  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const measure = () => {
      const { width, height } = stage.getBoundingClientRect()
      if (width > 0 && height > 0) setLayout(computeLayout(width, height))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  // The HTML panels and the scene share one timeline, starting once the
  // assets are in.
  useEffect(() => {
    if (ready && entranceStart === null) setEntranceStart(performance.now())
  }, [ready, entranceStart])

  // Paint (or repaint) every panel whenever its size or an image changes.
  useLayoutEffect(() => {
    if (!layout || entranceStart === null) return
    for (const pose of layout.panels) {
      const canvas = canvases.current[pose.kind]
      if (canvas) paintPanel(canvas, pose, images)
    }
    setPaintVersion((v) => v + 1)
  }, [layout, images, entranceStart])

  // A scene that unmounts must prove itself ready again before it shows.
  useEffect(() => {
    if (!eligible) setSceneReady(false)
  }, [eligible])

  const handleReady = useCallback(() => setSceneReady(true), [])
  const handleFail = useCallback(() => {
    setFailed(true)
    setSceneReady(false)
  }, [])

  const canvasRefs = useMemo(() => {
    const refs = {} as Record<PanelKind, (el: HTMLCanvasElement | null) => void>
    for (const kind of PANEL_ORDER) {
      refs[kind] = (el) => {
        if (el) canvases.current[kind] = el
        else delete canvases.current[kind]
      }
    }
    return refs
  }, [])

  return (
    <div ref={stageRef} aria-hidden="true" className="relative w-full aspect-[100/86] select-none pointer-events-none">
      {/* The work surface */}
      {layout && (
        <motion.div
          className="absolute rounded-[18px] desk-grid desk-fade"
          style={{ left: layout.plate.x, top: layout.plate.y, width: layout.plate.w, height: layout.plate.h }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      )}

      {layout && entranceStart !== null && (
        <div className={`absolute inset-0 ${showScene ? 'opacity-0' : ''}`}>
          {layout.panels.map((pose) => (
            <Panel
              key={`${pose.kind}-${layout.compact ? 'c' : 'w'}`}
              pose={pose}
              assemble={assemble}
              canvasRef={canvasRefs[pose.kind]}
            />
          ))}
        </div>
      )}

      {eligible && layout && entranceStart !== null && paintVersion > 0 && (
        <div className={`absolute ${showScene ? 'opacity-100' : 'opacity-0'}`} style={{ inset: -SCENE_BLEED }}>
          <WebGLBoundary fallback={<WebGLFailSignal onFail={handleFail} />}>
            <Suspense fallback={null}>
              <HeroWorkspaceScene
                layout={layout}
                canvases={canvases}
                paintVersion={paintVersion}
                interactionRef={interactionRef}
                entranceStart={entranceStart}
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
