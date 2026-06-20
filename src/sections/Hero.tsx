import { motion } from 'framer-motion'
import { Suspense, lazy } from 'react'
import { ArrowDown } from '@phosphor-icons/react'
import { staggerContainer, fadeUp, slideInLeft, lineMask, lineReveal } from '@/lib/motion'
import { person } from '@/data/person'

// Lazy-loaded so the Three.js bundle never blocks the hero's first paint.
const HeroWaveBackground = lazy(() => import('@/components/HeroWaveBackground'))

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-end px-6 md:px-10 pb-20 pt-32 overflow-hidden">
      {/* Ambient wireframe-wave backdrop */}
      <Suspense fallback={null}>
        <HeroWaveBackground />
      </Suspense>

      {/* Readability scrim: softens the wave behind the text */}
      <div className="absolute inset-0 z-[5] pointer-events-none bg-gradient-to-t from-bg via-bg/65 to-transparent" />

      <motion.div
        className="relative z-10 max-w-6xl mx-auto w-full"
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

        {/* Main headline — per-line mask reveal */}
        <motion.h1
          variants={lineMask}
          className="font-display font-black text-5xl md:text-7xl lg:text-8xl tracking-tightest text-text-primary leading-[0.92] mb-8 max-w-5xl"
        >
          <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
            <motion.span variants={lineReveal} className="block">Designing products</motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
            <motion.span variants={lineReveal} className="block">
              that are <span className="text-gradient">clear, useful,</span>
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
            <motion.span variants={lineReveal} className="block">and human.</motion.span>
          </span>
        </motion.h1>

        {/* Meta row */}
        <motion.div variants={fadeUp}>
          <p className="text-text-secondary text-base leading-relaxed max-w-md">
            {person.tagline}
          </p>
          <p className="text-text-muted text-sm mt-2">{person.location}</p>
        </motion.div>

        {/* CTA row */}
        <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
          <button
            onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dim text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors duration-200"
          >
            View Work
            <ArrowDown size={14} weight="bold" />
          </button>
          <a
            href="/Portfolio/AndrewDumitruResume.pdf"
            download
            className="inline-flex items-center gap-2 border border-subtle hover:border-text-muted text-text-secondary hover:text-text-primary text-sm font-medium px-5 py-2.5 rounded-full transition-colors duration-200"
          >
            Resume
          </a>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 border border-subtle hover:border-text-muted text-text-secondary hover:text-text-primary text-sm font-medium px-5 py-2.5 rounded-full transition-colors duration-200"
          >
            Contact Me
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex items-center gap-3 text-text-muted"
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
