import { motion } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/lib/motion'
import { services } from '@/data/services'
import type { Service } from '@/data/services'
import AccentLine from '@/components/AccentLine'
import ServicePlate from '@/components/services/ServicePlate'
import ServiceIllustration from '@/components/services/ServiceIllustrations'
import { useReveal } from '@/hooks/useReveal'

/**
 * "How I can help": an editorial header, then one row per service with its
 * copy on the left and an illustration plate on the right. Each plate plays
 * its short story once as it comes into view. The text never waits on the
 * illustrations, and stays visible however the reveals behave.
 */
export default function Services() {
  const reveal = useReveal({ once: true, margin: '-10% 0px' })

  return (
    <section aria-labelledby="services-heading" className="section-space px-6 md:px-10">
      <div className="content-wide">
        <motion.header
          variants={staggerContainer}
          {...reveal}
          className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-12"
        >
          <motion.div variants={fadeUp} className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <AccentLine />
              <p className="text-xs font-medium uppercase tracking-widest text-text-secondary">{services.label}</p>
            </div>
            <h2
              id="services-heading"
              className="mt-6 font-display text-[clamp(2.5rem,1.3rem+3.6vw,4.75rem)] font-black leading-[1.02] tracking-[-0.03em] text-text-primary"
            >
              {services.heading.map((line, i) => (
                <span key={line} className={`block ${i === services.heading.length - 1 ? 'text-gradient' : ''}`}>
                  {line}
                </span>
              ))}
            </h2>
          </motion.div>
          <motion.p
            variants={fadeUp}
            className="max-w-[30rem] text-pretty text-base leading-relaxed text-text-secondary md:text-lg lg:col-span-4 lg:col-start-9 lg:self-end"
          >
            {services.intro}
          </motion.p>
        </motion.header>

        <ol className="mt-12 border-t border-desk-line md:mt-16 lg:mt-20">
          {services.items.map((service, i) => (
            <ServiceRow key={service.id} service={service} index={i} />
          ))}
        </ol>
      </div>
    </section>
  )
}

function ServiceRow({ service, index }: { service: Service; index: number }) {
  const reveal = useReveal({ once: true, margin: '-15% 0px' })
  return (
    <motion.li
      variants={staggerContainer}
      {...reveal}
      className="grid grid-cols-1 items-center gap-y-8 border-b border-desk-line py-10 md:grid-cols-12 md:gap-x-10 md:py-12 lg:gap-x-12 lg:py-14"
    >
      <motion.div variants={fadeUp} className="md:col-span-5">
        <p className="font-display text-sm font-bold tabular-nums text-accent">
          {String(index + 1).padStart(2, '0')}
        </p>
        <h3 className="mt-3 font-display text-[clamp(1.75rem,1.25rem+1.5vw,2.5rem)] font-bold leading-[1.08] tracking-[-0.02em] text-text-primary text-balance">
          {service.title}
        </h3>
        <p className="mt-4 max-w-[44ch] text-pretty text-base leading-relaxed text-text-secondary md:text-[1.0625rem]">
          {service.body}
        </p>
        <ul aria-label="Deliverables" className="mt-6 flex flex-wrap gap-2">
          {service.deliverables.map((item) => (
            <li
              key={item}
              className="rounded-md border border-desk-line bg-surface px-2.5 py-1 text-[0.8125rem] font-medium text-text-primary"
            >
              {item}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div variants={fadeUp} className="md:col-span-7 lg:col-span-6 lg:col-start-7">
        <ServicePlate>{(state) => <ServiceIllustration id={service.id} state={state} />}</ServicePlate>
      </motion.div>
    </motion.li>
  )
}
