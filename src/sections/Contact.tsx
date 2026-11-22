import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, EnvelopeSimple, WarningCircle } from '@phosphor-icons/react'
import { staggerContainer, fadeUp } from '@/lib/motion'
import { contact } from '@/data/contact'
import AccentLine from '@/components/AccentLine'
import DesignStack from '@/components/contact/DesignStack'
import { useReveal } from '@/hooks/useReveal'

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'

/**
 * Copies text and reports whether it really worked: the async Clipboard API
 * where available, then the older execCommand route, whose return value says
 * whether the browser actually copied.
 */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Permission denied or unavailable: fall through to the older route.
  }
  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;'
    document.body.appendChild(textarea)
    textarea.select()
    const copied = document.execCommand('copy')
    document.body.removeChild(textarea)
    return copied
  } catch {
    return false
  }
}

type CopyState = 'idle' | 'copied' | 'failed'

/** Copy state for the email address; success clears after 2s, failure after 6s. */
function useCopyEmail() {
  const [state, setState] = useState<CopyState>('idle')
  const timer = useRef(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  async function copy() {
    const ok = await copyText(contact.email)
    setState(ok ? 'copied' : 'failed')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), ok ? 2000 : 6000)
  }
  return { state, copy }
}

/**
 * "Let's connect": a white panel with the invitation, the actions and the
 * contact illustration set on the dot-grid work surface used across the page.
 */
export default function Contact() {
  const reveal = useReveal({ once: true, margin: '-10% 0px' })
  const { state: copyState, copy } = useCopyEmail()
  return (
    <section id="contact" aria-labelledby="contact-heading" className="px-6 pb-10 pt-4 md:px-10 md:pb-12">
      <div className="content-wide">
        <div className="grid grid-cols-1 overflow-hidden rounded-[28px] border border-desk-line bg-surface shadow-[0_1px_2px_rgba(46,43,110,0.04),0_30px_60px_-40px_rgba(46,43,110,0.25)] lg:grid-cols-12">
          <motion.div
            variants={staggerContainer}
            {...reveal}
            className="min-w-0 px-5 py-12 sm:px-10 md:px-14 md:py-16 lg:col-span-7 xl:py-20 xl:pl-16"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <AccentLine />
              <p className="text-xs font-medium uppercase tracking-widest text-text-secondary">{contact.label}</p>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              id="contact-heading"
              className="mt-6 font-display text-[clamp(1.875rem,1rem+3.6vw,4.5rem)] font-black leading-[1.02] tracking-[-0.03em] text-text-primary"
            >
              <span className="block">{contact.headline}</span>
              <span className="block text-gradient">{contact.headlineAccent}</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="mt-7 max-w-[34rem] text-pretty text-base leading-relaxed text-text-secondary md:text-lg">
              {contact.body}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9">
              <a
                href={contact.inquiryMailto}
                className={`group inline-flex h-12 items-center gap-2.5 rounded-full bg-accent px-6 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-dim sm:text-base ${focusRing}`}
              >
                <EnvelopeSimple size={18} weight="bold" aria-hidden="true" />
                {contact.primaryCta}
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-3">
              <p className="text-sm text-text-secondary">
                {contact.emailPrefix}{' '}
                {/* Its own line on phones, so the address never splits */}
                <a
                  href={contact.mailto}
                  className={`block w-fit py-1 sm:inline sm:py-0 rounded-sm font-medium text-text-primary underline decoration-subtle underline-offset-4 transition-colors duration-200 hover:decoration-text-primary ${focusRing}`}
                >
                  {contact.email}
                </a>
              </p>
              <button
                type="button"
                onClick={copy}
                className={`inline-flex h-11 items-center justify-center gap-2 rounded-full border border-subtle bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-text-muted hover:text-text-primary ${focusRing}`}
              >
                {copyState === 'copied' ? <Check size={16} weight="bold" aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                {copyState === 'copied' ? contact.copy.done : contact.copy.label}
              </button>
            </motion.div>
            {/* Always present (and its line reserved) so changes are announced
                and a failure message never shifts the layout. Success is
                announced only; a failure is shown too, and never reads as
                "Copied". The address above stays selectable by hand. */}
            <p role="status" className="mt-2 min-h-[1.25rem] text-sm text-text-secondary">
              {copyState === 'failed' && (
                <span className="inline-flex items-center gap-1.5">
                  <WarningCircle size={16} aria-hidden="true" className="shrink-0 text-text-primary" />
                  {contact.copy.failed}
                </span>
              )}
              {copyState === 'copied' && <span className="sr-only">{contact.copy.announceDone}</span>}
            </p>

            <motion.p
              variants={fadeUp}
              className="mt-8 flex items-center gap-2.5 border-t border-desk-line pt-6 text-sm text-text-secondary"
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {contact.opportunities}
            </motion.p>
          </motion.div>

          {/* The illustration on its work surface. Decorative: static on
              phones, Three.js on eligible desktops. */}
          <div className="relative flex items-center justify-center border-t border-desk-line desk-grid px-10 py-12 sm:px-16 lg:col-span-5 lg:border-l lg:border-t-0 lg:px-12">
            <DesignStack className="w-full max-w-[17rem] sm:max-w-[21rem] lg:max-w-[26rem]" />
          </div>
        </div>
      </div>
    </section>
  )
}
