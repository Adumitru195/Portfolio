import { motion } from 'framer-motion'
import { useRevealsEnabled } from '@/hooks/useReveal'

/**
 * The small accent divider that precedes section labels. Draws itself in
 * (grows from the left) when scrolled into view. Self-contained: relies on
 * its own viewport trigger rather than a parent variant.
 */
export default function AccentLine({ className = '' }: { className?: string }) {
  const revealsEnabled = useRevealsEnabled()
  return (
    <motion.div
      className={`h-px w-8 bg-accent origin-left ${className}`}
      initial={revealsEnabled ? { scaleX: 0 } : false}
      animate={revealsEnabled ? undefined : { scaleX: 1 }}
      whileInView={revealsEnabled ? { scaleX: 1 } : undefined}
      // Vertical margin only: the line starts zero-width at the left padding,
      // which a horizontal inset would exclude on narrow screens.
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    />
  )
}
