import { motion } from 'framer-motion'

/**
 * The small accent divider that precedes section labels. Draws itself in
 * (grows from the left) when scrolled into view. Self-contained: relies on
 * its own viewport trigger rather than a parent variant.
 */
export default function AccentLine({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`h-px w-8 bg-accent origin-left ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    />
  )
}
