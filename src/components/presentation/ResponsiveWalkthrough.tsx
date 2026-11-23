import { useEffect, useRef, useState } from 'react'
import { ArrowSquareOut, Play } from '@phosphor-icons/react'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'

export interface WalkthroughVariant {
  mp4: string
  poster: string
  width: number
  height: number
}

interface ResponsiveWalkthroughProps {
  /** Shown from the md breakpoint (768px) up. */
  landscape: WalkthroughVariant
  /** Shown below 768px. */
  vertical: WalkthroughVariant
  /** Names the video element once it plays. */
  label: string
  /** The Play button's accessible name; include the length and that it's silent. */
  playLabel: string
  /** The visible text on the Play button. */
  playText: string
  /** id of the text alternative that describes what the video shows. */
  descriptionId: string
}

/** Matches Tailwind's `md` breakpoint: below it, the vertical cut is used. */
const VERTICAL_QUERY = '(max-width: 767px)'

type Orientation = 'landscape' | 'vertical'
type Status = 'idle' | 'active' | 'error'

// The vertical cut stays a comfortable width and no taller than 80% of the viewport.
const verticalBox = 'mx-auto w-full max-w-[calc(80dvh*9/16)] aspect-[9/16]'
const landscapeBox = 'w-full aspect-video'

/**
 * A silent walkthrough that loads nothing but its poster until the visitor
 * presses Play. The poster comes from a <picture>, so the browser fetches only
 * the one that matches the viewport. Pressing Play picks the matching cut,
 * mounts the <video> with native controls (pause, seek, replay, fullscreen)
 * and starts it once. It never autoplays or loops, and returning to the page
 * shows the poster again.
 */
export default function ResponsiveWalkthrough({
  landscape,
  vertical,
  label,
  playLabel,
  playText,
  descriptionId,
}: ResponsiveWalkthroughProps) {
  const reduceMotion = useReducedMotionPreference()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  // Chosen when Play is pressed and kept, so a later resize can't swap files mid-playback.
  const [orientation, setOrientation] = useState<Orientation>('landscape')

  const start = () => {
    const isVertical = typeof window.matchMedia === 'function' && window.matchMedia(VERTICAL_QUERY).matches
    setOrientation(isVertical ? 'vertical' : 'landscape')
    setStatus('active')
  }

  // Runs once the <video> exists: keep keyboard focus on the player that replaced
  // the button, then start playback (allowed because the video is muted).
  useEffect(() => {
    if (status !== 'active') return
    const el = videoRef.current
    if (!el) return
    el.focus({ preventScroll: true })
    el.play().catch((err: unknown) => {
      // A blocked or interrupted play() leaves the native controls to start it.
      if (err instanceof DOMException && err.name === 'NotSupportedError') setStatus('error')
    })
  }, [status])

  const chosen = orientation === 'vertical' ? vertical : landscape
  const box = status === 'idle' ? `${verticalBox} md:aspect-video md:max-w-none` : orientation === 'vertical' ? verticalBox : landscapeBox
  const frame = `relative overflow-hidden rounded-[14px] border border-[#CFC6B4] bg-[#1F2A24] shadow-[0_30px_70px_-34px_rgba(32,56,47,0.55)] ${box}`

  // The pill is the same on both placements; the buttons around it differ.
  const pill = (
    <span
      className={`inline-flex min-h-[56px] items-center gap-3 rounded-full bg-[#20382F] py-2 pl-2 pr-6 text-base font-semibold text-[#F4F1EA] shadow-[0_16px_36px_-14px_rgba(32,56,47,0.7)] group-hover:bg-[#172820] ${
        reduceMotion ? '' : 'transition-[transform,background-color] duration-200 group-hover:scale-[1.03]'
      }`}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D9A441] text-[#1F2A24]">
        <Play size={22} weight="fill" aria-hidden="true" />
      </span>
      <span aria-hidden="true">{playText}</span>
    </span>
  )

  if (status === 'idle') {
    // Only one of the two buttons is displayed (and exposed to assistive tech) at a time.
    return (
      <div>
        <div className={frame}>
          <picture>
            <source media={VERTICAL_QUERY} srcSet={vertical.poster} width={vertical.width} height={vertical.height} />
            <img
              src={landscape.poster}
              width={landscape.width}
              height={landscape.height}
              alt=""
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>
          {/* 768px and up: over the poster, under its caption in the left column
              (percent padding scales with width, so it never covers the caption). */}
          <button
            type="button"
            onClick={start}
            aria-label={playLabel}
            aria-describedby={descriptionId}
            className="group absolute inset-0 hidden items-start justify-start bg-transparent pl-[9.5%] pt-[37%] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#D9A441] md:flex"
          >
            {pill}
          </button>
        </div>
        {/* Below 768px: under the poster, so it covers none of the app's interface. */}
        <div className="mt-4 flex justify-center md:hidden">
          <button
            type="button"
            onClick={start}
            aria-label={playLabel}
            aria-describedby={descriptionId}
            className="group rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D9A441] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EAE5DA]"
          >
            {pill}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className={frame}>
        {status === 'active' ? (
          <video
            ref={videoRef}
            src={chosen.mp4}
            poster={chosen.poster}
            width={chosen.width}
            height={chosen.height}
            controls
            muted
            playsInline
            preload="auto"
            aria-label={label}
            aria-describedby={descriptionId}
            onError={() => setStatus('error')}
            className="absolute inset-0 h-full w-full object-contain focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#D9A441]"
          />
        ) : (
          <img src={chosen.poster} width={chosen.width} height={chosen.height} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        )}
      </div>
      {/* Below 768px, keep the Play button's space so the caption doesn't jump once playback starts. */}
      {status === 'active' && <div aria-hidden="true" className="mt-4 h-16 md:hidden" />}
      {status === 'error' && (
        <p role="alert" className="mb-0 mt-4 text-sm leading-relaxed text-[#1F2A24]">
          The walkthrough couldn’t be played here. The description below covers what it shows, or{' '}
          <a
            href={chosen.mp4}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded font-semibold text-[#20382F] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#20382F] focus-visible:ring-offset-2"
          >
            open the video file
            <ArrowSquareOut size={14} aria-hidden="true" />
            <span className="sr-only">(MP4, opens in a new tab)</span>
          </a>
          .
        </p>
      )}
    </div>
  )
}
