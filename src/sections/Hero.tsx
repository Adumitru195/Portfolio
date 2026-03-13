import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'
import { ArrowDown } from '@phosphor-icons/react'
import { staggerContainer, fadeUp, slideInLeft } from '@/lib/motion'
import { person } from '@/data/person'

export default function Hero() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 })

  const blobX = useTransform(springX, [-1, 1], ['-10%', '10%'])
  const blobY = useTransform(springY, [-1, 1], ['-10%', '10%'])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1)
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-end px-6 md:px-10 pb-20 pt-32 overflow-hidden">
      {/* Ambient background blob */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          x: blobX,
          y: blobY,
          background: 'radial-gradient(circle, rgba(184,255,59,0.14) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="max-w-6xl mx-auto w-full"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Status badge */}
        <motion.div variants={slideInLeft} className="mb-10">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-text-secondary border border-subtle rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Available for freelance &amp; collaboration
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          variants={fadeUp}
          className="font-display font-black text-5xl md:text-7xl lg:text-8xl tracking-tightest text-text-primary leading-[0.92] mb-8 max-w-5xl"
        >
          Design that
          <br />
          <span className="text-gradient">makes people</span>
          <br />
          feel something.
        </motion.h1>

        {/* Meta row */}
        <motion.div variants={fadeUp}>
          <p className="text-text-secondary text-base leading-relaxed max-w-md">
            {person.tagline}
          </p>
          <p className="text-text-muted text-sm mt-2">{person.location}</p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={fadeUp}
          className="mt-16 flex items-center gap-3 text-text-muted"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown size={14} />
          </motion.div>
          <span className="text-xs tracking-widest uppercase">Scroll</span>
        </motion.div>
      </motion.div>
    </section>
  )
}
