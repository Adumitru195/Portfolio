import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { staggerContainer, fadeUp } from '@/lib/motion'
import { aboutPhotos, aboutPreview } from '@/data/about'
import type { Photo } from '@/data/about'
import AccentLine from '@/components/AccentLine'
import { useReveal } from '@/hooks/useReveal'

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'

/** A personal photo set like a print: white border, slight turn, soft shadow. */
function Print({ photo, sizes, className }: { photo: Photo; sizes: string; className: string }) {
  const largest = photo.sources[photo.sources.length - 1]
  return (
    <figure className={`m-0 rounded-[6px] bg-white p-[3%] shadow-[0_2px_4px_rgba(46,43,110,0.06),0_24px_48px_-22px_rgba(46,43,110,0.35)] ${className}`}>
      <img
        src={largest.src}
        srcSet={photo.sources.map((s) => `${s.src} ${s.width}w`).join(', ')}
        sizes={sizes}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        className="block aspect-[4/5] h-auto w-full rounded-[3px] object-cover"
      />
    </figure>
  )
}

/**
 * "Behind the design": a compact introduction before Contact, linking to the
 * full About page. Two personal photos laid like prints on the desk beside the
 * copy. No decorative animation beyond the shared fade-in.
 */
export default function AboutPreview() {
  const reveal = useReveal({ once: true, margin: '-10% 0px' })
  return (
    <section aria-labelledby="about-preview-heading" className="px-6 pb-[clamp(4rem,2rem+5vw,7rem)] pt-[clamp(1rem,0.5rem+2vw,2.5rem)] md:px-10">
      <motion.div
        variants={staggerContainer}
        {...reveal}
        className="content-wide grid grid-cols-1 items-center gap-y-12 md:grid-cols-12 md:gap-x-10 lg:gap-x-12"
      >
        {/* The prints: the Chicago portrait, with Colorado tucked beside it from 640px */}
        <motion.div variants={fadeUp} className="md:col-span-5 lg:col-span-5">
          <div className="relative mx-auto w-full max-w-[22rem] pb-[12%] pr-[16%] md:mx-0 md:max-w-[30rem]">
            <Print
              photo={aboutPhotos.main}
              sizes="(min-width: 1024px) 400px, (min-width: 768px) 300px, 70vw"
              className="relative -rotate-2"
            />
            <Print
              photo={aboutPhotos.support}
              sizes="(min-width: 768px) 170px, 34vw"
              className="absolute bottom-0 right-0 hidden w-[44%] rotate-3 sm:block"
            />
          </div>
        </motion.div>

        <div className="md:col-span-7 lg:col-span-6 lg:col-start-7">
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <AccentLine />
            <p className="text-xs font-medium uppercase tracking-widest text-text-secondary">{aboutPreview.label}</p>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            id="about-preview-heading"
            className="mt-6 font-display text-[clamp(2.25rem,1.3rem+3vw,4rem)] font-black leading-[1.02] tracking-[-0.03em] text-text-primary"
          >
            {aboutPreview.heading.map((line, i) => (
              <span key={line} className={`block ${i === aboutPreview.heading.length - 1 ? 'text-gradient' : ''}`}>
                {line}
              </span>
            ))}
          </motion.h2>
          <motion.div variants={fadeUp} className="mt-7 max-w-[36rem] space-y-4 text-pretty text-base leading-relaxed text-text-secondary md:text-lg">
            {aboutPreview.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </motion.div>

          <motion.dl variants={fadeUp} className="mt-8 max-w-[36rem] divide-y divide-desk-line border-y border-desk-line">
            {aboutPreview.roles.map((role) => (
              <div key={role.label} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5 py-3">
                <dt className="text-xs uppercase tracking-[0.12em] text-text-secondary">{role.label}</dt>
                <dd className="text-sm font-medium text-text-primary">{role.value}</dd>
              </div>
            ))}
          </motion.dl>

          <motion.div variants={fadeUp} className="mt-8">
            <Link
              to="/about"
              className={`group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-subtle bg-bg px-5 text-sm font-medium text-text-primary transition-colors duration-200 hover:border-text-muted ${focusRing}`}
            >
              {aboutPreview.cta}
              <ArrowRight
                size={14}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:transform-none"
              />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
