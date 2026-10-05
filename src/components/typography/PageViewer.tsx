import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowsIn, ArrowsOut, CircleNotch, X } from '@phosphor-icons/react'
import type { ViewerItem } from '@/types/typography'

/**
 * Open/close state for a PageViewer. `open` remembers the control that opened
 * the viewer so focus can return to it on close.
 */
export function useViewer() {
  const [index, setIndex] = useState<number | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  const open = useCallback((i: number, trigger: HTMLElement) => {
    triggerRef.current = trigger
    setIndex(i)
  }, [])

  const close = useCallback(() => {
    setIndex(null)
    const trigger = triggerRef.current
    triggerRef.current = null
    requestAnimationFrame(() => trigger?.focus())
  }, [])

  return { index, setIndex, open, close }
}

interface PageViewerProps {
  items: ViewerItem[]
  index: number | null
  onIndexChange: (index: number) => void
  onClose: () => void
  /** Names the collection, e.g. the book title. */
  label: string
}

const control =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition-[background-color,color,opacity] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-type-ink disabled:cursor-not-allowed disabled:opacity-35'

/**
 * Enlarged view of print artwork in a native modal <dialog>: Escape closes it,
 * Tab stays inside it, and Left/Right (or Home/End) move between pages. Pages
 * only advance when asked. The artwork fits the screen by default; "Zoom in"
 * shows it larger in a scrollable area. Only the current page is requested.
 */
export default function PageViewer({ items, index, onIndexChange, onClose, label }: PageViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [zoomed, setZoomed] = useState(false)
  // Keyed by source, so a cached image that loads instantly can't be missed.
  const [loaded, setLoaded] = useState<string | null>(null)
  const [failed, setFailed] = useState<string | null>(null)

  const isOpen = index !== null
  const item = index !== null ? items[index] : undefined
  const multiple = items.length > 1

  // Mirror the controlled index onto the native dialog.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) {
      dialog.showModal()
      closeRef.current?.focus()
      document.documentElement.style.overflow = 'hidden'
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  useEffect(() => {
    const dialog = dialogRef.current
    return () => {
      if (dialog?.open) dialog.close()
      document.documentElement.style.overflow = ''
    }
  }, [])

  // Each page starts fitted to the screen, scrolled to its top-left.
  useEffect(() => {
    setZoomed(false)
    scrollRef.current?.scrollTo(0, 0)
  }, [index])

  const go = useCallback(
    (next: number) => {
      if (index === null) return
      const clamped = Math.min(Math.max(next, 0), items.length - 1)
      if (clamped !== index) onIndexChange(clamped)
    },
    [index, items.length, onIndexChange],
  )

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const onDialogClose = () => {
      document.documentElement.style.overflow = ''
      onClose()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        const focusable = [
          ...dialog.querySelectorAll<HTMLElement>('button:not(:disabled), [href], [tabindex]:not([tabindex="-1"])'),
        ]
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
        return
      }
      // While zoomed with the artwork focused, arrow keys scroll it instead.
      if (zoomed && document.activeElement === scrollRef.current) return
      if (!multiple || index === null) return
      if (event.key === 'ArrowRight') go(index + 1)
      else if (event.key === 'ArrowLeft') go(index - 1)
      else if (event.key === 'Home') go(0)
      else if (event.key === 'End') go(items.length - 1)
      else return
      event.preventDefault()
    }
    dialog.addEventListener('close', onDialogClose)
    dialog.addEventListener('keydown', onKeyDown)
    return () => {
      dialog.removeEventListener('close', onDialogClose)
      dialog.removeEventListener('keydown', onKeyDown)
    }
  }, [go, index, items.length, multiple, onClose, zoomed])

  const hide = () => dialogRef.current?.close()

  const srcSet = item ? `${item.src} ${item.width}w, ${item.large} ${item.largeWidth}w` : undefined
  const zoomWidth = item ? Math.round(item.largeWidth * 0.75) : 0
  const currentSrc = item ? (zoomed ? item.large : item.src) : ''
  const loadState = failed === currentSrc ? 'error' : loaded === currentSrc ? 'ready' : 'loading'

  return (
    <dialog
      ref={dialogRef}
      aria-label={item ? `${label}: ${item.title ?? item.alt}` : label}
      onClick={(event) => {
        if (event.target === event.currentTarget) hide()
      }}
      className="m-auto h-[100dvh] max-h-none w-screen max-w-none bg-transparent p-0 text-white backdrop:bg-[rgba(18,18,18,0.96)] motion-safe:open:animate-[zoomIn_200ms_ease-out]"
    >
      {item && index !== null && (
        <div className="flex h-full flex-col gap-3 p-3 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1" aria-live="polite" aria-atomic="true">
              <p className="m-0 truncate text-xs font-semibold uppercase tracking-[0.14em] text-white/70">{label}</p>
              <p className="m-0 mt-1 text-sm text-white sm:text-base">
                {multiple && (
                  <span className="mr-2 font-semibold tabular-nums">
                    Page {index + 1} of {items.length}
                  </span>
                )}
                {item.title && <span className="text-white/80">{item.title}</span>}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                aria-pressed={zoomed}
                className={`${control} border border-white/40 text-white hover:bg-white/10`}
              >
                {zoomed ? <ArrowsIn size={16} aria-hidden="true" /> : <ArrowsOut size={16} aria-hidden="true" />}
                {zoomed ? 'Fit to screen' : 'Zoom in'}
              </button>
              <button ref={closeRef} type="button" onClick={hide} className={`${control} bg-white text-type-text hover:bg-type-paper`}>
                <X size={16} aria-hidden="true" />
                Close
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            tabIndex={0}
            aria-label={zoomed ? 'Enlarged page, scrollable. Use arrow keys to scroll.' : 'Page fitted to screen'}
            className={`relative min-h-0 flex-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
              zoomed ? 'overflow-auto' : 'flex items-center justify-center overflow-hidden'
            }`}
          >
            {loadState === 'loading' && (
              <p className="absolute inset-0 m-0 flex items-center justify-center gap-2 text-sm text-white/80" role="status">
                <CircleNotch size={18} aria-hidden="true" className="motion-safe:animate-spin" />
                Loading page…
              </p>
            )}
            {loadState === 'error' ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center" role="alert">
                <p className="m-0 max-w-[40ch] text-white/90">This page could not be loaded.</p>
                <a
                  href={item.large}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-white underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Open the image directly<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            ) : (
              <img
                key={currentSrc}
                src={currentSrc}
                srcSet={zoomed ? undefined : srcSet}
                sizes={zoomed ? undefined : '100vw'}
                alt={item.alt}
                width={item.width}
                height={item.height}
                onLoad={() => setLoaded(currentSrc)}
                onError={() => setFailed(currentSrc)}
                style={zoomed ? { width: zoomWidth, maxWidth: 'none' } : undefined}
                className={`block bg-white ${zoomed ? 'mx-auto h-auto' : 'h-auto max-h-full w-auto max-w-full object-contain'} ${
                  loadState === 'ready' ? 'opacity-100' : 'opacity-0'
                } transition-opacity duration-200`}
              />
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            {multiple ? (
              <>
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  disabled={index === 0}
                  className={`${control} border border-white/40 text-white hover:bg-white/10`}
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  Previous<span className="sr-only"> page</span>
                </button>
                <p className="m-0 hidden text-xs text-white/70 md:block">
                  {item.label ? `${item.label} · ` : ''}Use ← and → to move between pages
                </p>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  disabled={index === items.length - 1}
                  className={`${control} border border-white/40 text-white hover:bg-white/10`}
                >
                  Next<span className="sr-only"> page</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </>
            ) : (
              <p className="m-0 text-xs text-white/70">{item.label ?? 'Press Escape to close.'}</p>
            )}
          </div>
        </div>
      )}
    </dialog>
  )
}
