import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/motion'

export type SectionTone = 'cream' | 'white' | 'green'

const toneClasses: Record<SectionTone, string> = {
  cream: 'bg-porch-cream text-porch-charcoal',
  white: 'bg-white text-porch-charcoal',
  green: 'bg-porch-green text-porch-cream',
}

const eyebrowClasses: Record<SectionTone, string> = {
  cream: 'text-porch-brass-text',
  white: 'text-porch-brass-text',
  green: 'text-porch-brass-soft',
}

const introClasses: Record<SectionTone, string> = {
  cream: 'text-porch-muted',
  white: 'text-porch-muted',
  green: 'text-porch-cream/85',
}

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
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`${toneClasses[tone]} py-20 md:py-28`}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10">
        <motion.header
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          className="mb-12 md:mb-16 max-w-[65ch]"
        >
          <p className={`mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] ${eyebrowClasses[tone]}`}>
            <span aria-hidden="true" className="block h-px w-8 bg-current" />
            <span>
              <span className="sr-only">Section </span>
              {index} · {label}
            </span>
          </p>
          <h2
            id={`${id}-title`}
            className="font-porch-display text-3xl font-semibold leading-[1.08] tracking-[-0.02em] md:text-5xl"
          >
            {title}
          </h2>
          {intro && <p className={`mt-5 text-lg leading-relaxed ${introClasses[tone]}`}>{intro}</p>}
        </motion.header>
        {children}
      </div>
    </section>
  )
}
