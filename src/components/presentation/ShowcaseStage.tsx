import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { DESKTOP, PHONE, STAGE, toStageRect } from '@/lib/showcaseLayout'
import { usePresentationTheme } from '@/lib/presentationTheme'
import { supportsWebGL } from '@/lib/webgl'
import type { PresentationImage } from '@/types/presentation'

/**
 * Opening showcase stage. The static HTML composition renders immediately
 * and is the accessible image. On wide screens with WebGL and without a
 * reduced-motion preference, a Three.js version of the same composition is
 * loaded and cross-faded in on top. Its canvas is decorative.
 *
 * Optional `options` (all off by default) let a page opt into an entrance,
 * phone parallax, a custom tilt range or DPR cap, restrict 3D to fine-pointer
 * devices, defer loading until the stage is near the viewport, or switch the
 * enhancement off entirely.
 */

export interface ShowcaseStageOptions {
  enabled?: boolean
  entrance?: boolean
  phoneParallax?: number
  tiltRange?: { x: number; y: number }
  maxDpr?: number
  /** Only enhance on devices with a fine, hover-capable pointer (no touch). */
  requireFinePointer?: boolean
  /** Load Three.js only once the stage is within this margin of the viewport. */
  loadMargin?: string
}

interface ShowcaseStageProps {
  desktop: PresentationImage
  mobile: PresentationImage
  description: string
  options?: ShowcaseStageOptions
}

const WIDE_QUERY = '(min-width: 900px)'
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'
const FINE_POINTER_QUERY = '(pointer: fine)'
const DESKTOP_POINTER_QUERY = '(hover: hover) and (pointer: fine)'

function useEnhancementAllowed(enabled: boolean, requireFinePointer: boolean) {
  const [allowed, setAllowed] = useState(false)
  useEffect(() => {
    if (!enabled) {
      setAllowed(false)
      return
    }
    const wide = window.matchMedia(WIDE_QUERY)
    const reduced = window.matchMedia(REDUCED_QUERY)
    const pointer = window.matchMedia(DESKTOP_POINTER_QUERY)
    const update = () =>
      setAllowed(
        wide.matches && !reduced.matches && (!requireFinePointer || pointer.matches) && supportsWebGL(),
      )
    update()
    wide.addEventListener('change', update)
    reduced.addEventListener('change', update)
    pointer.addEventListener('change', update)
    return () => {
      wide.removeEventListener('change', update)
      reduced.removeEventListener('change', update)
      pointer.removeEventListener('change', update)
    }
  }, [enabled, requireFinePointer])
  return allowed
}

// True once the element comes within `margin` of the viewport (immediately when no margin is given).
function useNearViewport(ref: React.RefObject<HTMLElement | null>, margin: string | undefined, active: boolean) {
  const [near, setNear] = useState(!margin)
  useEffect(() => {
    if (!active || near || !margin || !ref.current) return
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          observer.disconnect()
        }
      },
      { rootMargin: margin },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref, margin, active, near])
  return near
}

const desktopRect = toStageRect(DESKTOP.cx, DESKTOP.cy, DESKTOP.width, DESKTOP.height)
const phoneRect = toStageRect(PHONE.cx, PHONE.cy, PHONE.width, PHONE.height)
const barHeight = `${((DESKTOP.bar / DESKTOP.height) * 100).toFixed(3)}%`
// Percentage padding resolves against the containing block's width (the
// stage), so the bezel is expressed as a fraction of the stage width.
const phoneBezel = `${((PHONE.bezel / STAGE.width) * 100).toFixed(3)}%`

export default function ShowcaseStage({ desktop, mobile, description, options = {} }: ShowcaseStageProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const supported = useEnhancementAllowed(options.enabled ?? true, options.requireFinePointer ?? false)
  const near = useNearViewport(stageRef, options.loadMargin, supported)
  const allowed = supported && near
  const { entrance, phoneParallax, maxDpr } = options
  const tiltX = options.tiltRange?.x
  const tiltY = options.tiltRange?.y
  const theme = usePresentationTheme()
  const colors = theme.showcase.colors
  const [enhanced, setEnhanced] = useState(false)

  useEffect(() => {
    if (!allowed || !stageRef.current || !hostRef.current) return
    const stage = stageRef.current
    const host = hostRef.current
    let cancelled = false
    let dispose: (() => void) | undefined

    import('@/lib/deviceShowcase')
      .then(({ mountShowcase }) => {
        if (cancelled) return
        const handle = mountShowcase({
          host,
          pointerTarget: stage,
          desktopSrc: desktop.src,
          mobileSrc: mobile.src,
          tilt: window.matchMedia(FINE_POINTER_QUERY).matches,
          colors,
          entrance,
          phoneParallax,
          maxDpr,
          tiltRange: tiltX !== undefined && tiltY !== undefined ? { x: tiltX, y: tiltY } : undefined,
          onReady: () => {
            if (!cancelled) setEnhanced(true)
          },
          onFail: () => {
            if (cancelled) return
            // Release the failed scene; the static composition stays visible.
            setEnhanced(false)
            dispose?.()
            dispose = undefined
          },
        })
        dispose = handle.dispose
      })
      .catch(() => {
        if (!cancelled) setEnhanced(false)
      })

    return () => {
      cancelled = true
      dispose?.()
      setEnhanced(false)
    }
  }, [allowed, desktop.src, mobile.src, colors, entrance, phoneParallax, maxDpr, tiltX, tiltY])

  return (
    <div
      ref={stageRef}
      role="img"
      aria-label={description}
      className="relative w-full aspect-[16/10]"
    >
      {/* Static composition: shown immediately, and the fallback everywhere. */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${enhanced ? 'opacity-0' : 'opacity-100'}`}
      >
        <div
          className={`absolute flex flex-col overflow-hidden rounded-[1.4%/2.1%] ${theme.showcase.desktopFrame}`}
          style={desktopRect as CSSProperties}
        >
          <div className={`flex shrink-0 items-center gap-[0.9%] px-[1.8%] ${theme.showcase.bar}`} style={{ height: barHeight }}>
            <span className={`block aspect-square w-[0.9%] rounded-full ${theme.showcase.dot}`} />
            <span className={`block aspect-square w-[0.9%] rounded-full ${theme.showcase.dot}`} />
            <span className={`block aspect-square w-[0.9%] rounded-full ${theme.showcase.dot}`} />
            <span className={`mx-auto block h-[46%] w-[27%] rounded-full ${theme.showcase.pill}`} />
          </div>
          <img
            src={desktop.src}
            alt=""
            width={desktop.width}
            height={desktop.height}
            fetchPriority="high"
            decoding="async"
            className="block w-full flex-1 min-h-0 object-cover object-top"
          />
        </div>
        <div
          className={`absolute rounded-[13%/6.3%] ${theme.showcase.phone}`}
          style={{ ...(phoneRect as CSSProperties), padding: phoneBezel }}
        >
          <img
            src={mobile.src}
            alt=""
            width={mobile.width}
            height={mobile.height}
            decoding="async"
            className="block h-full w-full rounded-[10%/4.6%] object-cover object-top"
          />
        </div>
      </div>

      {/* Three.js enhancement host. The canvas inside is aria-hidden. */}
      <div
        ref={hostRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${enhanced ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
