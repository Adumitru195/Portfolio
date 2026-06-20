import { useRef, type ReactNode, type MouseEvent as ReactMouseEvent } from 'react'
import { motion } from 'framer-motion'

/**
 * A card that lifts on hover and shows a cursor-tracked indigo sheen —
 * the same interaction used on the home Work cards. Cursor position is
 * exposed as CSS vars so the sheen follows without React re-renders.
 *
 * Pass the card's own styling (padding, border, bg, radius) via className.
 */
export default function SheenCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  function handleMove(e: ReactMouseEvent) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
      className={`group relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(360px circle at var(--mx) var(--my), rgba(79,70,229,0.10), transparent 65%)',
        }}
      />
      {children}
    </motion.div>
  )
}
