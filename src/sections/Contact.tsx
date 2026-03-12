import { motion } from 'framer-motion'
import { ArrowUpRight, Envelope, LinkedinLogo } from '@phosphor-icons/react'
import { staggerContainer, fadeUp } from '@/lib/motion'
import { person } from '@/data/person'

export default function Contact() {
  return (
    <section id="contact" className="px-6 md:px-10 py-24 md:py-32 border-t border-subtle">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="mb-16 max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-accent" />
              <span className="text-xs text-text-muted uppercase tracking-widest">Contact</span>
            </div>
            <h2 className="font-display font-black text-4xl md:text-6xl lg:text-7xl tracking-tightest text-text-primary leading-tight">
              Let's make something{' '}
              <span className="text-gradient">worth remembering.</span>
            </h2>
          </motion.div>

          {/* CTA row */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <a
              href={`mailto:${person.email}`}
              className="group flex items-center gap-3 bg-accent hover:bg-accent-dim text-ink font-medium px-6 py-3.5 rounded-full transition-colors duration-200"
            >
              <Envelope size={18} weight="bold" />
              {person.email}
              <ArrowUpRight
                size={16}
                weight="bold"
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>

            {person.socials
              .filter((s) => s.label === 'LinkedIn')
              .map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 border border-subtle text-text-secondary hover:text-text-primary hover:border-text-muted px-6 py-3.5 rounded-full transition-colors duration-200"
                >
                  <LinkedinLogo size={18} />
                  LinkedIn
                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              ))}
          </motion.div>

          {/* Social links row */}
          <motion.div variants={fadeUp} className="mt-16 flex items-center gap-6">
            {person.socials.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors duration-200"
              >
                {social.label}
                <ArrowUpRight size={11} />
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
