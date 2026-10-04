import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/motion'
import { usePresentationTheme } from '@/lib/presentationTheme'
import type { SectionTone } from '@/lib/presentationTheme'

interface PresentationSectionProps {
  id: string
  tone: SectionTone
  index: string
  label: string
  title: string
  intro?: string
  children: ReactNode
}

export default function PresentationSection({
  id,
  tone,
  index,
  label,
  title,
  intro,
  children,
}: PresentationSectionProps) {
  const theme = usePresentationTheme()
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`${theme.tones[tone]} py-20 md:py-28`}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10">
        <motion.header
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          className="mb-12 max-w-[65ch] md:mb-16"
        >
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--pres-eyebrow)]">
            <span aria-hidden="true" className="block h-px w-8 bg-current" />
            <span>
              <span className="sr-only">Section </span>
              {index} · {label}
            </span>
          </p>
          <h2 id={`${id}-title`} className={`${theme.heading} text-3xl md:text-5xl`}>
            {title}
          </h2>
          {intro && <p className="mt-5 text-lg leading-relaxed text-[color:var(--pres-muted)]">{intro}</p>}
        </motion.header>
        {children}
      </div>
    </section>
  )
}
