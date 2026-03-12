import { motion } from 'framer-motion'
import { useScrollProgress } from '@/hooks/useScrollProgress'

export default function ScrollProgress() {
  const scaleX = useScrollProgress()

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 bg-accent origin-left z-[60]"
      style={{ scaleX }}
    />
  )
}
