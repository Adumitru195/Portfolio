import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, Envelope } from '@phosphor-icons/react'
import { staggerContainer, fadeUp } from '@/lib/motion'
import { contact } from '@/data/contact'
import AccentLine from '@/components/AccentLine'
import ArrowDisc from '@/components/contact/ArrowDisc'

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'

function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  }
  return new Promise((resolve) => {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.cssText = 'position:fixed;opacity:0;pointer-events:none;'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    resolve()
  })
}

// Copies the address, for visitors without a mail app set up.
function CopyEmailButton({ className = '' }: { className?: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  function handleCopy() {
    copyToClipboard(contact.email).then(() => {
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        className={`inline-flex items-center justify-center gap-2 h-12 px-4 rounded-full border border-subtle text-sm text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors duration-200 ${focusRing} ${className}`}
      >
        {copied ? <Check size={16} weight="bold" aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        {copied ? 'Copied' : 'Copy'}
        <span className="sr-only"> email address</span>
      </button>
      <span className="sr-only" role="status">
        {copied ? contact.copiedLabel : ''}
      </span>
    </>
  )
}

export default function Contact() {
  return (
    <section id="contact" className="px-6 md:px-10 pt-24 pb-20 md:pt-32 md:pb-28 border-t border-subtle bg-bg">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10% 0px' }}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-10 items-center"
      >
        <div className="md:col-span-7 lg:col-span-8 min-w-0">
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5">
            <AccentLine />
            <span className="text-xs text-text-muted uppercase tracking-widest">{contact.label}</span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="font-display font-black text-[2.5rem] leading-[1] sm:text-5xl md:text-6xl lg:text-7xl tracking-tightest text-text-primary max-w-[15ch] mb-6"
          >
            {contact.headline} <span className="text-gradient">{contact.headlineAccent}</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-lg md:text-xl leading-relaxed text-text-secondary max-w-[32rem] mb-9">
            {contact.body}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
            <motion.a
              href={contact.mailto}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`inline-flex max-w-full items-center gap-2.5 h-12 px-5 sm:px-6 rounded-full bg-accent hover:bg-accent-dim text-white text-sm sm:text-base font-medium transition-colors duration-200 ${focusRing}`}
            >
              <Envelope size={18} weight="bold" aria-hidden="true" className="shrink-0" />
              <span className="min-w-0 break-all sm:break-normal select-text">{contact.email}</span>
            </motion.a>
            <CopyEmailButton className="hidden md:inline-flex" />
          </motion.div>

          {/* Phones: the copy action and a smaller disc share one row */}
          <div className="md:hidden mt-6 flex items-center justify-between gap-4">
            <CopyEmailButton />
            <ArrowDisc href={contact.mailto} label={contact.discLabel} allowScene={false} className="w-24 sm:w-28" />
          </div>
        </div>

        <motion.div
          variants={fadeUp}
          className="hidden md:flex md:col-span-5 lg:col-span-4 justify-center lg:justify-end"
        >
          <ArrowDisc href={contact.mailto} label={contact.discLabel} className="w-[15rem] lg:w-[19rem] xl:w-[21rem]" />
        </motion.div>
      </motion.div>
    </section>
  )
}
