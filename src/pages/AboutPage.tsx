import { useEffect } from 'react'
import { MotionConfig, motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AccentLine from '@/components/AccentLine'
import Portrait from '@/components/Portrait'
import { aboutPage, aboutPortrait } from '@/data/about'
import { person } from '@/data/person'
import { fadeUp, staggerContainer } from '@/lib/motion'

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'

// Each block fades up once as it enters the viewport.
const reveal = {
  variants: staggerContainer,
  initial: 'hidden' as const,
  whileInView: 'visible' as const,
  viewport: { once: true, margin: '-10%' },
}

function SectionLabel({ children }: { children: string }) {
  return (
    <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5">
      <AccentLine />
      <span className="text-xs text-text-muted uppercase tracking-widest">{children}</span>
    </motion.div>
  )
}

/**
 * The About page (#/about): who Andrew is, how he approaches UX and how a
 * project with him runs. Calm by design: no WebGL, only gentle fade-ups,
 * which MotionConfig reduces to opacity for visitors who prefer less motion.
 */
export default function AboutPage() {
  const { label, heading, intro, background, proof, approach, workingTogether, closing } = aboutPage

  useEffect(() => {
    window.scrollTo(0, 0)
    const previous = document.title
    document.title = `About | ${person.name}`
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main>
        {/* Opening: headline and introduction beside a large portrait */}
        <section className="px-6 md:px-10 pt-32 md:pt-40 pb-20 md:pb-28">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-10 items-start"
          >
            <div className="lg:col-span-7 lg:pt-10">
              <SectionLabel>{label}</SectionLabel>
              <motion.h1
                variants={fadeUp}
                className="font-display font-black text-4xl md:text-6xl lg:text-7xl tracking-tightest text-text-primary leading-[0.98] mb-8 max-w-[14ch]"
              >
                {heading}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-[38rem]"
              >
                {intro}
              </motion.p>
            </div>

            <motion.figure
              variants={fadeUp}
              className="lg:col-span-5 lg:col-start-8 relative w-full max-w-sm sm:max-w-md lg:max-w-none mx-0"
            >
              {/* Offset tint plate gives the portrait an editorial frame */}
              <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-4 translate-y-4 md:translate-x-6 md:translate-y-6 rounded-[28px] bg-accent-highlight"
              />
              <Portrait
                portrait={aboutPortrait}
                priority
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 448px, calc(100vw - 48px)"
                className="relative w-full aspect-[4/5] rounded-[28px] border border-subtle shadow-[0_24px_48px_-24px_rgba(49,46,129,0.28)]"
              />
            </motion.figure>
          </motion.div>
        </section>

        {/* Background and the Backwater Journal proof point */}
        <section className="px-6 md:px-10 py-20 md:py-28 border-t border-subtle">
          <div className="max-w-6xl mx-auto space-y-20 md:space-y-28">
            <motion.div {...reveal} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
              <motion.h2
                variants={fadeUp}
                className="lg:col-span-4 font-display font-bold text-2xl md:text-3xl tracking-tight text-text-primary"
              >
                {background.heading}
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="lg:col-span-7 lg:col-start-6 text-lg text-text-secondary leading-relaxed max-w-[40rem]"
              >
                {background.body}
              </motion.p>
            </motion.div>

            <motion.div {...reveal} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
              <motion.h2
                variants={fadeUp}
                className="lg:col-span-4 font-display font-bold text-2xl md:text-3xl tracking-tight text-text-primary"
              >
                {proof.heading}
              </motion.h2>
              <motion.div variants={fadeUp} className="lg:col-span-7 lg:col-start-6 max-w-[40rem]">
                <p className="text-lg text-text-secondary leading-relaxed mb-6">{proof.body}</p>
                <Link
                  to={`/project/${proof.projectId}`}
                  className={`group inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-dim border-b border-accent/30 hover:border-accent-dim pb-1 transition-colors duration-200 rounded-sm ${focusRing}`}
                >
                  {proof.linkLabel}
                  <ArrowUpRight
                    size={14}
                    weight="bold"
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Approach: an editorial numbered sequence on a lighter band */}
        <section className="px-6 md:px-10 py-20 md:py-32 bg-surface border-y border-subtle">
          <div className="max-w-6xl mx-auto">
            <motion.div {...reveal} className="mb-14 md:mb-20 max-w-3xl">
              <SectionLabel>Approach</SectionLabel>
              <motion.h2
                variants={fadeUp}
                className="font-display font-black text-4xl md:text-6xl tracking-tighter text-text-primary leading-[1.02] mb-6"
              >
                {approach.heading}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-lg text-text-secondary leading-relaxed max-w-[36rem]">
                {approach.intro}
              </motion.p>
            </motion.div>

            <ol>
              {approach.steps.map((step) => (
                <motion.li
                  key={step.number}
                  {...reveal}
                  className="grid grid-cols-[3.5rem_minmax(0,1fr)] md:grid-cols-12 gap-x-4 md:gap-x-10 gap-y-3 py-10 md:py-12 border-t border-subtle"
                >
                  <motion.span
                    variants={fadeUp}
                    aria-hidden="true"
                    className="md:col-span-2 font-display font-black text-3xl md:text-5xl tracking-tighter text-accent leading-none"
                  >
                    {step.number}
                  </motion.span>
                  <motion.h3
                    variants={fadeUp}
                    className="md:col-span-4 font-display font-bold text-xl md:text-2xl tracking-tight text-text-primary leading-snug"
                  >
                    <span className="sr-only">Step {step.number}: </span>
                    {step.title}
                  </motion.h3>
                  <motion.p
                    variants={fadeUp}
                    className="col-start-2 md:col-start-auto md:col-span-6 text-text-secondary leading-relaxed max-w-[36rem]"
                  >
                    {step.body}
                  </motion.p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* Working together: three principles under short accent rules */}
        <section className="px-6 md:px-10 py-20 md:py-32">
          <motion.div {...reveal} className="max-w-6xl mx-auto">
            <motion.h2
              variants={fadeUp}
              className="font-display font-black text-4xl md:text-6xl tracking-tighter text-text-primary leading-[1.02] mb-14 md:mb-20 lg:pl-[16.666%]"
            >
              {workingTogether.heading}
            </motion.h2>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 lg:pl-[16.666%]">
              {workingTogether.principles.map((principle) => (
                <motion.li key={principle.title} variants={fadeUp}>
                  <span aria-hidden="true" className="block h-0.5 w-10 bg-accent mb-6" />
                  <h3 className="font-display font-bold text-xl tracking-tight text-text-primary mb-3">
                    {principle.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">{principle.body}</p>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* Closing: hands off to the homepage contact section */}
        <section className="px-6 md:px-10 pt-20 md:pt-28 pb-28 md:pb-40 border-t border-subtle">
          <motion.div {...reveal} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <motion.h2
                variants={fadeUp}
                className="font-display font-black text-4xl md:text-6xl tracking-tighter text-text-primary leading-[1.02] mb-6"
              >
                {closing.heading}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-lg text-text-secondary leading-relaxed max-w-[32rem]">
                {closing.body}
              </motion.p>
            </div>
            <motion.div variants={fadeUp} className="lg:col-span-4 lg:justify-self-end">
              <Link
                to="/"
                state={{ scrollTo: 'contact' }}
                className={`group inline-flex items-center gap-2 bg-accent hover:bg-accent-dim text-white font-medium px-6 py-3.5 rounded-full transition-colors duration-200 ${focusRing}`}
              >
                {closing.buttonLabel}
                <ArrowRight size={16} weight="bold" className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </MotionConfig>
  )
}
