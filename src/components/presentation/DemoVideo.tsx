import { useId, useRef, useState } from 'react'
import { Pause, Play } from '@phosphor-icons/react'
import { usePresentationTheme } from '@/lib/presentationTheme'
import type { PresentationImage } from '@/types/presentation'

interface DemoVideoProps {
  mp4: string
  webm: string
  poster: PresentationImage
  caption: string
  description: string
  label: string
}

/**
 * A silent screen recording that only plays when asked. Shows its poster
 * until then, never autoplays, and is controlled by a labeled play/pause
 * button. A text description covers what the recording shows.
 */
export default function DemoVideo({ mp4, webm, poster, caption, description, label }: DemoVideoProps) {
  const theme = usePresentationTheme()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)
  const descriptionId = useId()

  const toggle = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused || video.ended) {
      video.play().catch(() => setFailed(true))
    } else {
      video.pause()
    }
  }

  const buttonLabel = playing ? `Pause ${label}` : `Play ${label}`

  return (
    <figure className="m-0">
      <div className={`relative overflow-hidden rounded-xl border ${theme.screenFrame}`}>
        <video
          ref={videoRef}
          poster={poster.src}
          width={poster.width}
          height={poster.height}
          preload="none"
          muted
          playsInline
          aria-describedby={descriptionId}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onError={() => setFailed(true)}
          className="block aspect-[1280/800] h-auto w-full bg-glow-deep"
        >
          <source src={webm} type="video/webm" />
          <source src={mp4} type="video/mp4" />
        </video>
        {!playing && !failed && (
          // Pointer shortcut only; keyboard and screen-reader users get the labeled button below.
          <button
            type="button"
            onClick={toggle}
            tabIndex={-1}
            aria-hidden="true"
            className="group absolute inset-0 flex items-center justify-center bg-transparent"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-glow-accent text-glow-ink shadow-[0_12px_30px_-10px_rgba(4,6,14,0.8)] transition-transform duration-200 motion-safe:group-hover:scale-105">
              <Play size={28} weight="fill" aria-hidden="true" />
            </span>
          </button>
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <button
          type="button"
          onClick={toggle}
          disabled={failed}
          className={`inline-flex items-center gap-2 rounded-[10px] border border-glow-line-strong px-4 py-2.5 text-sm font-semibold transition-colors hover:border-glow-accent hover:text-glow-accent disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${theme.focusRing}`}
        >
          {playing ? <Pause size={16} weight="fill" aria-hidden="true" /> : <Play size={16} weight="fill" aria-hidden="true" />}
          {buttonLabel}
        </button>
        <figcaption className="text-sm text-[color:var(--pres-muted)]">
          {failed ? 'The recording couldn’t be played here. The description below covers what it shows.' : caption}
        </figcaption>
      </div>
      <p id={descriptionId} className="mt-4 max-w-[70ch] text-sm leading-relaxed text-[color:var(--pres-muted)]">
        {description}
      </p>
    </figure>
  )
}
