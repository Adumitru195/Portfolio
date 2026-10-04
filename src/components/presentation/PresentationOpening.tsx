import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from '@phosphor-icons/react'
import ShowcaseStage from '@/components/presentation/ShowcaseStage'
import { fadeUp, lineReveal, staggerContainer } from '@/lib/motion'
import { usePresentationTheme } from '@/lib/presentationTheme'
import type { MetaItem, PresentationImage } from '@/types/presentation'

interface PresentationOpeningProps {
  title: string
  subtitle?: string
  eyebrow: string
  meta: MetaItem[]
  showcase: {
    desktop: PresentationImage
    mobile: PresentationImage
    description: string
    caption: string
  }
  note?: string
}

export const workLink = { pathname: '/' }
export const workState = { scrollTo: 'work' }

// Title, metadata and the desktop/mobile showcase that open a presentation.
export default function PresentationOpening({ title, subtitle, eyebrow, meta, showcase, note }: PresentationOpeningProps) {
  const theme = usePresentationTheme()
  return (
    <section aria-labelledby="presentation-title" className={theme.tones.base}>
      <nav aria-label="Case study" className="mx-auto max-w-[1280px] px-4 pt-6 sm:px-6 md:px-10">
        <Link
          to={workLink}
          state={workState}
          className={`inline-flex items-center gap-2 rounded text-sm font-medium text-[color:var(--pres-accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${theme.focusRing}`}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to work
        </Link>
      </nav>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-[1280px] px-4 pb-16 pt-12 sm:px-6 md:px-10 md:pb-24 md:pt-20"
      >
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.p
              variants={fadeUp}
              className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--pres-eyebrow)]"
            >
              <span aria-hidden="true" className="block h-px w-8 bg-current" />
              {eyebrow}
            </motion.p>
            <h1 id="presentation-title" className={theme.title}>
              <span className="block overflow-hidden pb-[0.1em]">
                <motion.span variants={lineReveal} className="block">
                  {title}
                </motion.span>
              </span>
            </h1>
            {subtitle && (
              <motion.p variants={fadeUp} className={`mt-5 max-w-[34ch] ${theme.subtitle}`}>
                {subtitle}
              </motion.p>
            )}
          </div>
          <motion.dl
            variants={fadeUp}
            className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[color:var(--pres-border)] pt-6 lg:col-span-5"
          >
            {meta.map((item) => (
              <div key={item.label}>
                <dt className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--pres-muted)]">
                  {item.label}
                </dt>
                <dd className="m-0 font-medium">{item.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.figure variants={fadeUp} className="m-0 mt-12 md:mt-16">
          <ShowcaseStage desktop={showcase.desktop} mobile={showcase.mobile} description={showcase.description} />
          <figcaption className="mt-5 text-sm text-[color:var(--pres-muted)]">
            {showcase.caption}
            {note && <span className="mt-1 block text-xs">{note}</span>}
          </figcaption>
        </motion.figure>
      </motion.div>
    </section>
  )
}
