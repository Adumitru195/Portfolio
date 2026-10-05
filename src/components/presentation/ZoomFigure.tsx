import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowsOut, X } from '@phosphor-icons/react'
import { imageReveal } from '@/lib/motion'
import { usePresentationTheme } from '@/lib/presentationTheme'
import type { PresentationImage } from '@/types/presentation'

interface ZoomFigureProps {
  image: PresentationImage
  caption?: string
  chrome?: boolean
  className?: string
  /** CSS `sizes` for the inline image when a small variant exists. */
  sizes?: string
  /** Source shown in the enlarged view; defaults to the image itself. */
  fullSrc?: string
}

/**
 * A screenshot that opens in an enlarged view. The trigger is a real button;
 * the enlarged view is a native modal <dialog>, so focus stays inside it and
 * Escape closes it. Focus returns to the trigger on close. The open/close
 * transition is skipped with reduced motion.
 */
export default function ZoomFigure({ image, caption, chrome = false, className = '', sizes, fullSrc }: ZoomFigureProps) {
  const theme = usePresentationTheme()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)

  const show = () => {
    const dialog = dialogRef.current
    if (!dialog || dialog.open) return
    dialog.showModal()
    setOpen(true)
    closeRef.current?.focus()
  }
  const hide = () => dialogRef.current?.close()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const onClose = () => {
      setOpen(false)
      triggerRef.current?.focus()
    }
    // Keep Tab cycling inside the dialog; browsers otherwise let it reach their own UI.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const focusable = [...dialog.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])')]
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
    }
    dialog.addEventListener('close', onClose)
    dialog.addEventListener('keydown', onKeyDown)
    return () => {
      dialog.removeEventListener('close', onClose)
      dialog.removeEventListener('keydown', onKeyDown)
      if (dialog.open) dialog.close()
    }
  }, [])

  const srcSet = image.small ? `${image.small} 800w, ${image.src} ${image.width}w` : undefined

  return (
    <motion.figure
      variants={imageReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      className={`m-0 ${className}`}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        className={`group relative block w-full overflow-hidden rounded-xl border text-left transition-transform duration-300 motion-safe:hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 ${theme.screenFrame} ${theme.focusRing}`}
      >
        {chrome && (
          <span aria-hidden="true" className={`flex h-7 items-center gap-1.5 border-b px-3 ${theme.chromeBar}`}>
            <span className={`h-2 w-2 rounded-full ${theme.chromeDot}`} />
            <span className={`h-2 w-2 rounded-full ${theme.chromeDot}`} />
            <span className={`h-2 w-2 rounded-full ${theme.chromeDot}`} />
          </span>
        )}
        <img
          src={image.src}
          srcSet={srcSet}
          sizes={srcSet ? sizes ?? '(min-width: 1280px) 1200px, 100vw' : undefined}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
        <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-[rgba(24,26,23,0.82)] px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100">
          <ArrowsOut size={14} aria-hidden="true" />
          <span className="hidden sm:inline">Enlarge</span>
          <span className="sr-only">Enlarge: {image.alt}</span>
        </span>
      </button>
      {caption && (
        <figcaption className="mt-3 text-sm leading-snug text-[color:var(--pres-muted)]">{caption}</figcaption>
      )}

      <dialog
        ref={dialogRef}
        aria-label={`Enlarged view: ${image.alt}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) hide()
        }}
        className={`m-auto h-[100dvh] max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-[rgba(24,26,23,0.96)] ${
          open ? 'motion-safe:animate-[zoomIn_220ms_ease-out]' : ''
        }`}
      >
        <div className="flex h-full flex-col p-3 sm:p-6" onClick={(event) => event.target === event.currentTarget && hide()}>
          <div className="mb-3 flex items-center justify-end">
            <button
              ref={closeRef}
              type="button"
              onClick={hide}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#1f1f1f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <X size={16} aria-hidden="true" />
              Close
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto rounded-lg" tabIndex={0} aria-label="Enlarged image, scrollable">
            <img
              src={fullSrc ?? image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="mx-auto block h-auto w-full max-w-[min(100%,1600px)]"
            />
          </div>
          {caption && (
            <p className="mt-3 text-center text-sm text-white/80">{caption.replace(/\s*Select to enlarge\.?$/, '')}</p>
          )}
        </div>
      </dialog>
    </motion.figure>
  )
}
