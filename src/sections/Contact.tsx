import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Envelope, LinkedinLogo, GithubLogo, Check } from '@phosphor-icons/react'
import { staggerContainer, fadeUp } from '@/lib/motion'
import { person } from '@/data/person'

function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  }
  return new Promise((resolve) => {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.cssText = 'position:fixed;opacity:0;pointer-events:none;'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    resolve()
  })
}

export default function Contact() {
  const [copied, setCopied] = useState(false)

  function handleEmailCopy() {
    copyToClipboard(person.email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <section id="contact" className="px-6 md:px-10 pt-32 pb-24 md:pt-44 md:pb-32 border-t border-subtle">
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
            {/* Email — copies to clipboard */}
            <motion.button
              onClick={handleEmailCopy}
              className="group flex items-center gap-3 bg-accent hover:bg-accent-dim text-white font-medium px-6 py-3.5 rounded-full transition-colors duration-200"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {copied
                ? <Check size={18} weight="bold" />
                : <Envelope size={18} weight="bold" />}
              {copied ? 'Email copied!' : person.email}
            </motion.button>

            {/* LinkedIn */}
            {person.socials
              .filter((s) => s.label === 'LinkedIn')
              .map((social) => (
                <motion.a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 border border-subtle text-text-secondary hover:text-text-primary hover:border-text-muted px-6 py-3.5 rounded-full transition-colors duration-200"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <LinkedinLogo size={18} />
                  LinkedIn
                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </motion.a>
              ))}

            {/* GitHub */}
            {person.socials
              .filter((s) => s.label === 'GitHub')
              .map((social) => (
                <motion.a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 border border-subtle text-text-secondary hover:text-text-primary hover:border-text-muted px-6 py-3.5 rounded-full transition-colors duration-200"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <GithubLogo size={18} />
                  GitHub
                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </motion.a>
              ))}
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
