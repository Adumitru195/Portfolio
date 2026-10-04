import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { DESKTOP, PHONE, STAGE, toStageRect } from '@/lib/showcaseLayout'
import { usePresentationTheme } from '@/lib/presentationTheme'
import type { PresentationImage } from '@/types/presentation'

/**
 * Opening showcase stage. The static HTML composition renders immediately
 * and is the accessible image. On wide screens with WebGL and without a
 * reduced-motion preference, a Three.js version of the same composition is
 * loaded and cross-faded in on top. Its canvas is decorative.
 */

interface ShowcaseStageProps {
  desktop: PresentationImage
  mobile: PresentationImage
  description: string
}

const WIDE_QUERY = '(min-width: 900px)'
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'
const FINE_POINTER_QUERY = '(pointer: fine)'

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    if (!gl) return false
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

function useEnhancementAllowed() {
  const [allowed, setAllowed] = useState(false)
  useEffect(() => {
    const wide = window.matchMedia(WIDE_QUERY)
    const reduced = window.matchMedia(REDUCED_QUERY)
    const webgl = supportsWebGL()
    const update = () => setAllowed(webgl && wide.matches && !reduced.matches)
    update()
    wide.addEventListener('change', update)
    reduced.addEventListener('change', update)
    return () => {
      wide.removeEventListener('change', update)
      reduced.removeEventListener('change', update)
    }
  }, [])
  return allowed
}

const desktopRect = toStageRect(DESKTOP.cx, DESKTOP.cy, DESKTOP.width, DESKTOP.height)
const phoneRect = toStageRect(PHONE.cx, PHONE.cy, PHONE.width, PHONE.height)
const barHeight = `${((DESKTOP.bar / DESKTOP.height) * 100).toFixed(3)}%`
// Percentage padding resolves against the containing block's width (the
// stage), so the bezel is expressed as a fraction of the stage width.
const phoneBezel = `${((PHONE.bezel / STAGE.width) * 100).toFixed(3)}%`

export default function ShowcaseStage({ desktop, mobile, description }: ShowcaseStageProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const allowed = useEnhancementAllowed()
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
          onReady: () => {
            if (!cancelled) setEnhanced(true)
          },
          onFail: () => {
            if (!cancelled) setEnhanced(false)
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
  }, [allowed, desktop.src, mobile.src, colors])

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
