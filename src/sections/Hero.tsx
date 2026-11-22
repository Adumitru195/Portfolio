import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight } from '@phosphor-icons/react'
import { staggerContainer, fadeUp, slideInLeft, lineMask, lineReveal } from '@/lib/motion'
import { heroCopy } from '@/data/hero'
import { person } from '@/data/person'
import { useSiteNavigation } from '@/hooks/useSiteNavigation'
import HeroWorkspace from '@/components/hero/HeroWorkspace'

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'

/**
 * The homepage opening: copy on the left, the workspace composition on the
 * right (below the copy on phones and tablets). The copy never waits on the
 * composition, and the composition never covers the copy or its links.
 */
export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const { goToSection } = useSiteNavigation()

  return (
    <section
      ref={heroRef}
      aria-labelledby="hero-heading"
      className="relative overflow-hidden px-6 md:px-10 pt-28 pb-20 md:pt-32 lg:min-h-[100dvh] lg:flex lg:items-center lg:pt-24 lg:pb-14"
    >
      <div className="content-wide grid grid-cols-1 items-center gap-y-14 md:gap-y-16 lg:grid-cols-12 lg:gap-x-12">
        <motion.div
          className="relative z-10 lg:col-span-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={slideInLeft} className="mb-8 md:mb-10">
            <span className="inline-flex items-center gap-2 text-xs font-medium text-text-secondary border border-subtle rounded-full px-3 py-1.5 bg-bg">
              {/* Two pulses (4s), then steady */}
              <span className="w-1.5 h-1.5 rounded-full bg-accent motion-safe:animate-pulse motion-safe:[animation-iteration-count:2]" />
              {heroCopy.badge}
            </span>
          </motion.div>

          {/* Per-line mask reveal */}
          <motion.h1
            id="hero-heading"
            variants={lineMask}
            className="font-display font-black text-[clamp(2.75rem,1.1rem+5.4vw,4.5rem)] lg:text-[clamp(3.5rem,0.9rem+4.1vw,5.5rem)] tracking-[-0.03em] text-text-primary leading-[1.02] mb-9 md:mb-11"
          >
            {heroCopy.headline.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
                <motion.span
                  variants={lineReveal}
                  className={`block ${i === heroCopy.headline.length - 1 ? 'text-gradient' : ''}`}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          <motion.div variants={fadeUp}>
            <p className="text-text-secondary text-base md:text-lg leading-relaxed max-w-[34rem] text-pretty">
              {person.tagline}
            </p>
            <p className="mt-4 flex flex-wrap items-center gap-x-2 text-sm text-text-secondary">
              <span>{heroCopy.location}</span>
              <span aria-hidden="true">·</span>
              <span>{heroCopy.locationNote}</span>
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-9 md:mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              to="/"
              state={{ scrollTo: 'work' }}
              onClick={(e) => goToSection(e, 'work')}
              className={`group inline-flex min-h-[44px] items-center gap-2 bg-accent hover:bg-accent-dim text-white text-sm font-medium px-5 rounded-full transition-colors duration-200 ${focusRing}`}
            >
              {heroCopy.primaryCta}
              <ArrowDown
                size={14}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-y-0.5 motion-reduce:transition-none motion-reduce:transform-none"
              />
            </Link>
            <Link
              to="/"
              state={{ scrollTo: 'contact' }}
              onClick={(e) => goToSection(e, 'contact')}
              className={`group inline-flex min-h-[44px] items-center gap-2 border border-subtle bg-bg hover:border-text-muted text-text-primary text-sm font-medium px-5 rounded-full transition-colors duration-200 ${focusRing}`}
            >
              {heroCopy.secondaryCta}
              <ArrowRight
                size={14}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:transform-none"
              />
            </Link>
          </motion.div>
        </motion.div>

        <div className="lg:col-span-6 w-full max-w-[38rem] md:ml-auto lg:max-w-none">
          <HeroWorkspace interactionRef={heroRef} />
        </div>
      </div>
    </section>
  )
}
