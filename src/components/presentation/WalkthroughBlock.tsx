import { useId } from 'react'
import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/motion'
import { usePresentationTheme } from '@/lib/presentationTheme'
import DemoVideo from '@/components/presentation/DemoVideo'
import type { WalkthroughSection } from '@/types/presentation'

interface WalkthroughBlockProps {
  walkthrough: WalkthroughSection
  className?: string
}

/** A recorded walkthrough placed after the flow it demonstrates, in the section's own colors. */
export default function WalkthroughBlock({ walkthrough, className = '' }: WalkthroughBlockProps) {
  const theme = usePresentationTheme()
  const titleId = useId()
  return (
    <article
      aria-labelledby={titleId}
      className={`grid grid-cols-1 gap-8 border-t border-[color:var(--pres-border)] pt-12 lg:grid-cols-12 lg:gap-14 ${className}`}
    >
      <motion.header
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        className="max-w-[65ch] lg:col-span-4"
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--pres-eyebrow)]">
          {walkthrough.eyebrow}
        </p>
        <h3 id={titleId} className={`${theme.heading} mb-5 text-2xl md:text-3xl`}>
          {walkthrough.title}
        </h3>
        <p className="m-0 leading-relaxed text-[color:var(--pres-muted)]">{walkthrough.body}</p>
      </motion.header>
      <div className="lg:col-span-8">
        <DemoVideo video={walkthrough.video} />
      </div>
    </article>
  )
}
