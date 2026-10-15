import { useEffect, useId, useRef, useState } from 'react'
import { ArrowCounterClockwise, ArrowSquareOut, ArrowsOut, Pause, Play } from '@phosphor-icons/react'
import { usePresentationTheme } from '@/lib/presentationTheme'
import type { WalkthroughVideo } from '@/types/presentation'

/** Classes that tie the player to a case study's colors. */
export interface DemoVideoStyles {
  /** Border, background and shadow around the video. */
  frame: string
  /** Letterbox color behind the video. */
  surface: string
  /** The large play badge over the poster. */
  badge: string
  /** Corner radius, border and hover colors for the buttons under the video. */
  control: string
  focusRing: string
  /** Caption, time and description text. */
  muted: string
}

interface DemoVideoProps {
  video: WalkthroughVideo
  /** Defaults to the surrounding presentation theme. */
  styles?: DemoVideoStyles
}

// Vendor-prefixed fullscreen APIs that the DOM typings leave out.
type VendorVideo = HTMLVideoElement & {
  webkitRequestFullscreen?: () => void
  webkitEnterFullscreen?: () => void
}
type VendorDocument = Document & { webkitFullscreenEnabled?: boolean }

type FullscreenMode = 'standard' | 'webkit' | 'ios' | 'none'

function detectFullscreen(video: VendorVideo): FullscreenMode {
  const doc = document as VendorDocument
  if (document.fullscreenEnabled && typeof video.requestFullscreen === 'function') return 'standard'
  if (doc.webkitFullscreenEnabled && typeof video.webkitRequestFullscreen === 'function') return 'webkit'
  // iPhone Safari only offers the video element's own native player.
  if (typeof video.webkitEnterFullscreen === 'function') return 'ios'
  return 'none'
}

function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/**
 * A silent recording that only plays when asked. It shows its poster until
 * then, never autoplays and loads nothing before the first play. Once it
 * starts, the native controls handle seeking, time and fullscreen; the labeled buttons below
 * repeat play/pause and fullscreen for keyboard and screen-reader users, and
 * "Open video" links the file directly when fullscreen or playback fails.
 */
export default function DemoVideo({ video, styles }: DemoVideoProps) {
  const theme = usePresentationTheme()
  const s: DemoVideoStyles = styles ?? {
    frame: `rounded-xl border ${theme.screenFrame}`,
    surface: theme.video.surface,
    badge: theme.video.badge,
    control: theme.video.control,
    focusRing: theme.focusRing,
    muted: 'text-[color:var(--pres-muted)]',
  }
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [ended, setEnded] = useState(false)
  const [failed, setFailed] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(video.duration)
  const [fullscreen, setFullscreen] = useState<FullscreenMode>('standard')
  const [fullscreenFailed, setFullscreenFailed] = useState(false)
  const [slow, setSlow] = useState(false)
  const stallTimer = useRef<number>()
  const descriptionId = useId()

  useEffect(() => {
    if (videoRef.current) setFullscreen(detectFullscreen(videoRef.current))
    return () => window.clearTimeout(stallTimer.current)
  }, [])

  // Some browsers sit in a loading state on a missing file instead of reporting an
  // error, so offer the direct link if nothing has loaded a while after playing.
  const watchLoading = (el: HTMLVideoElement) => {
    window.clearTimeout(stallTimer.current)
    if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) return
    stallTimer.current = window.setTimeout(() => {
      if (el.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) setSlow(true)
    }, 12000)
  }

  const loaded = () => {
    window.clearTimeout(stallTimer.current)
    setSlow(false)
  }

  const toggle = () => {
    const el = videoRef.current
    if (!el) return
    if (el.paused || el.ended) {
      // An interrupted play() (AbortError) or a blocked one isn't a broken file.
      el.play().catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'NotSupportedError') setFailed(true)
      })
    } else {
      el.pause()
    }
  }

  // Called directly from the click so the browser treats it as a user gesture.
  const enterFullscreen = () => {
    const el = videoRef.current as VendorVideo | null
    if (!el) return
    const fail = () => setFullscreenFailed(true)
    try {
      if (fullscreen === 'standard') {
        el.requestFullscreen().catch(fail)
      } else if (fullscreen === 'webkit') {
        el.webkitRequestFullscreen?.()
      } else if (fullscreen === 'ios') {
        try {
          el.webkitEnterFullscreen?.()
        } catch {
          // Before its metadata loads, iOS refuses; start playback and retry once it can.
          el.addEventListener('loadedmetadata', () => {
            try {
              el.webkitEnterFullscreen?.()
            } catch {
              fail()
            }
          }, { once: true })
          el.play().catch(fail)
        }
      } else {
        fail()
      }
    } catch {
      fail()
    }
  }

  const playLabel = playing ? `Pause ${video.label}` : ended ? `Replay ${video.label}` : `Play ${video.label}`
  const PlayIcon = playing ? Pause : ended ? ArrowCounterClockwise : Play
  const showOpenLink = failed || slow || fullscreen === 'none' || fullscreenFailed
  const button = `inline-flex min-h-[44px] items-center gap-2 border px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${s.control} ${s.focusRing}`

  return (
    <figure className="m-0">
      <div className={`relative overflow-hidden ${s.frame}`}>
        <video
          ref={videoRef}
          poster={video.poster.src}
          width={video.poster.width}
          height={video.poster.height}
          preload="none"
          muted
          playsInline
          // Native controls (seek bar, time, fullscreen) appear once playback starts; before
          // that, Safari would draw its own play button under the poster badge.
          controls={started}
          aria-label={video.label}
          aria-describedby={descriptionId}
          onPlay={(e) => {
            setStarted(true)
            setPlaying(true)
            setEnded(false)
            watchLoading(e.currentTarget)
          }}
          onLoadedData={loaded}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false)
            setEnded(true)
          }}
          onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => {
            if (Number.isFinite(e.currentTarget.duration)) setDuration(e.currentTarget.duration)
          }}
          onError={() => setFailed(true)}
          className={`block h-auto max-h-[85dvh] w-full object-contain [&:fullscreen]:bg-black ${s.surface}`}
        >
          {/* MP4 first: it is seekable everywhere. Source errors fire on the <source>, not the <video>,
              and only the last one failing means nothing can play. */}
          <source src={video.mp4} type="video/mp4" onError={video.webm ? undefined : () => setFailed(true)} />
          {video.webm && <source src={video.webm} type="video/webm" onError={() => setFailed(true)} />}
        </video>
        {!started && !failed && (
          // Pointer shortcut only; keyboard and screen-reader users get the labeled button below.
          <button
            type="button"
            onClick={toggle}
            tabIndex={-1}
            aria-hidden="true"
            className="group absolute inset-0 flex items-center justify-center bg-transparent"
          >
            <span
              className={`flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-200 motion-safe:group-hover:scale-105 ${s.badge}`}
            >
              <PlayIcon size={28} weight="fill" aria-hidden="true" />
            </span>
          </button>
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-3">
        <button type="button" onClick={toggle} disabled={failed} className={button}>
          <PlayIcon size={16} weight="fill" aria-hidden="true" />
          {playLabel}
        </button>
        {fullscreen !== 'none' && !failed && (
          <button type="button" onClick={enterFullscreen} className={button}>
            <ArrowsOut size={16} weight="bold" aria-hidden="true" />
            View fullscreen
            <span className="sr-only">: {video.label}</span>
          </button>
        )}
        {showOpenLink && (
          <a href={video.mp4} target="_blank" rel="noopener noreferrer" className={button}>
            <ArrowSquareOut size={16} weight="bold" aria-hidden="true" />
            Open video
            <span className="sr-only">: {video.label} (MP4, opens in a new tab)</span>
          </a>
        )}
        <p className={`m-0 text-sm tabular-nums ${s.muted}`}>
          <span className="sr-only">Elapsed time </span>
          {formatTime(current)}
          <span aria-hidden="true"> / </span>
          <span className="sr-only"> of </span>
          {formatTime(duration)}
        </p>
      </div>
      <figcaption className={`mt-4 text-sm ${s.muted}`}>
        {failed ? (
          <span role="alert">
            The recording couldn’t be played here. Use Open video to watch the file directly; the description below
            covers what it shows.
          </span>
        ) : slow ? (
          <span role="status">
            The recording is taking longer than expected to load. Use Open video to watch the file directly.
          </span>
        ) : fullscreenFailed ? (
          <span role="status">Fullscreen isn’t available in this browser. Use Open video to view the file directly.</span>
        ) : (
          video.caption
        )}
      </figcaption>
      <p id={descriptionId} className={`mt-3 max-w-[70ch] text-sm leading-relaxed ${s.muted}`}>
        {video.description}
      </p>
    </figure>
  )
}
