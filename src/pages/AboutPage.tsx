import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUpRight, EnvelopeSimple } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AccentLine from '@/components/AccentLine'
import AboutPhotoStage from '@/components/about/AboutPhotoStage'
import BackwaterFrames from '@/components/about/BackwaterFrames'
import { aboutPage, aboutPhotos } from '@/data/about'
import type { Strength } from '@/data/about'
import { contact } from '@/data/contact'
import { person } from '@/data/person'
import { fadeUp, lineMask, lineReveal, staggerContainer } from '@/lib/motion'
import { useReveal, useRevealsEnabled } from '@/hooks/useReveal'

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'

// The homepage's button styles.
const primaryButton = `group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-dim ${focusRing}`
const secondaryButton = `group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-subtle bg-bg px-5 text-sm font-medium text-text-primary transition-colors duration-200 hover:border-text-muted ${focusRing}`
const sectionHeading = 'font-display font-black text-[clamp(2.25rem,1.3rem+3vw,4rem)] tracking-[-0.03em] leading-[1.02] text-text-primary'
const cardShadow = 'shadow-[0_1px_2px_rgba(46,43,110,0.06),0_22px_40px_-22px_rgba(46,43,110,0.38)]'

function Label({ children }: { children: string }) {
  return (
    <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
      <AccentLine />
      <span className="text-xs font-medium uppercase tracking-widest text-text-secondary">{children}</span>
    </motion.div>
  )
}

/**
 * One step of "How I approach design": its number on a rule that runs on to
 * the next step, a project detail set on the homepage's dot-grid work
 * surface, then the step's title and text. Wide details sit on the surface as
 * a card; the tall mobile screen stands upright like a phone.
 */
function ApproachStep({ item, index, last }: { item: Strength; index: number; last: boolean }) {
  const d = item.detail
  const phone = d.presentation === 'phone'
  return (
    <motion.li variants={fadeUp} className="flex max-w-[34rem] flex-col lg:max-w-none">
      <div className="mb-6 flex items-center gap-4" aria-hidden="true">
        <span className="font-display text-sm font-bold tabular-nums text-accent">{String(index + 1).padStart(2, '0')}</span>
        <span className={`h-px flex-1 ${last ? 'bg-transparent' : 'bg-desk-line'}`} />
      </div>

      <figure className="m-0">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] border border-desk-line desk-grid">
          <div
            className={
              phone
                ? `absolute bottom-[-4%] left-1/2 top-[9%] aspect-[390/560] -translate-x-1/2 overflow-hidden rounded-t-[16px] border border-desk-line bg-white ${cardShadow}`
                : `absolute inset-x-[7%] bottom-[9%] top-[9%] overflow-hidden rounded-[10px] border border-desk-line bg-white ${cardShadow}`
            }
          >
            <img
              src={d.src}
              width={d.width}
              height={d.height}
              alt={d.alt}
              loading="lazy"
              decoding="async"
              style={{ objectPosition: d.focus }}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <figcaption className="mt-3 text-xs text-text-secondary">
          <Link
            to={`/project/${d.projectId}`}
            className={`inline-flex min-h-[24px] items-center gap-1 rounded-sm transition-colors duration-200 hover:text-accent ${focusRing}`}
          >
            {d.caption}
            <ArrowUpRight size={11} weight="bold" aria-hidden="true" />
          </Link>
        </figcaption>
      </figure>

      <h3 className="mt-7 font-display text-2xl font-bold tracking-tight text-text-primary">{item.title}</h3>
      <p className="mt-3 max-w-[30rem] text-pretty text-base leading-relaxed text-text-secondary md:text-[1.0625rem]">{item.body}</p>
    </motion.li>
  )
}

/**
 * The About page (#/about): a personal introduction in the homepage's
 * Tactile Digital Workspace language. Motion is limited to the opening
 * entrance, the portrait's pointer depth (Three.js on eligible desktops, see
 * AboutPhotoStage) and once-only reveals. The site-wide MotionConfig in
 * App.tsx applies both the system setting and the footer's Reduce motion
 * toggle, so this page must not set its own.
 */
export default function AboutPage() {
  const { opening, strengths, education, backwater, beyond, closing } = aboutPage
  // Blocks fade up once as they enter the viewport; shown straight away
  // under reduced motion or without IntersectionObserver.
  const reveal = { variants: staggerContainer, ...useReveal({ once: true, margin: '-12% 0px' }) }
  const revealsEnabled = useRevealsEnabled()
  const [lead, ...story] = backwater.body

  useEffect(() => {
    const previous = document.title
    document.title = `About | ${person.name}`
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <>
      <Navbar />
      <main className="overflow-x-clip">
        {/* 1. Opening */}
        <section aria-labelledby="about-heading" className="px-6 md:px-10 pt-28 md:pt-36 pb-[clamp(4rem,2rem+5vw,7rem)]">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="content-wide grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-16 lg:gap-y-0 items-center"
          >
            <div className="lg:col-span-7">
              <Label>{opening.label}</Label>
              <motion.h1
                id="about-heading"
                variants={lineMask}
                className="font-display font-black text-[clamp(2.75rem,1.5rem+3.4vw,4.5rem)] tracking-tightest leading-[0.94] text-text-primary mb-10"
              >
                {opening.headline.map((line, i) => (
                  <span key={line} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                    <motion.span variants={lineReveal} className={`block ${i === 1 ? 'text-accent' : ''}`}>
                      {line}
                    </motion.span>
                  </span>
                ))}
              </motion.h1>

              <div className="max-w-[36rem] flex flex-col gap-5">
                <motion.p variants={fadeUp} className="text-pretty text-xl leading-relaxed text-text-primary md:text-[1.375rem]">
                  {opening.intro}
                </motion.p>
                {opening.supporting.map((paragraph) => (
                  <motion.p key={paragraph} variants={fadeUp} className="text-pretty text-lg leading-relaxed text-text-secondary">
                    {paragraph}
                  </motion.p>
                ))}
              </div>

              <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link to="/" state={{ scrollTo: 'contact' }} className={primaryButton}>
                  {opening.contactLabel}
                  <ArrowRight
                    size={14}
                    weight="bold"
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:transform-none"
                  />
                </Link>
                <Link to="/" state={{ scrollTo: 'work' }} className={secondaryButton}>
                  {opening.workLabel}
                  <ArrowDown
                    size={14}
                    weight="bold"
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-y-0.5 motion-reduce:transition-none motion-reduce:transform-none"
                  />
                </Link>
              </motion.div>
            </div>

            <div className="lg:col-span-5 lg:col-start-8 xl:col-span-4 xl:col-start-9 w-full max-w-[24rem] sm:max-w-[30rem] mx-auto lg:max-w-[25rem] xl:max-w-[26rem] lg:mr-0 lg:justify-self-end">
              <AboutPhotoStage main={aboutPhotos.main} support={aboutPhotos.support} location={opening.location} />
            </div>
          </motion.div>
        </section>

        {/* 2. How I approach design: three steps read left to right, each with a detail from a project */}
        <section aria-labelledby="approach-heading" className="px-6 md:px-10 section-space">
          <div className="content-wide">
            <motion.header {...reveal} className="grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:gap-x-12">
              <div className="lg:col-span-7">
                <Label>{strengths.label}</Label>
                <motion.h2 variants={fadeUp} id="approach-heading" className={`${sectionHeading} max-w-[16ch] text-balance`}>
                  {strengths.heading}
                </motion.h2>
              </div>
              <motion.p
                variants={fadeUp}
                className="max-w-[30rem] text-pretty text-base leading-relaxed text-text-secondary md:text-lg lg:col-span-4 lg:col-start-9 lg:self-end"
              >
                {strengths.intro}
              </motion.p>
            </motion.header>

            <motion.ol
              {...reveal}
              className="m-0 mt-14 grid list-none grid-cols-1 gap-x-8 gap-y-16 p-0 md:mt-16 lg:mt-20 lg:grid-cols-3 lg:gap-x-10"
            >
              {strengths.items.map((item, i) => (
                <ApproachStep key={item.title} item={item} index={i} last={i === strengths.items.length - 1} />
              ))}
            </motion.ol>
          </div>
        </section>

        {/* 3. Education & Certifications: the degree as the lead card, the two specializations as a matched pair */}
        <section aria-labelledby="education-heading" className="px-6 md:px-10 section-space">
          <div className="content-wide">
            <motion.header {...reveal} className="grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:gap-x-12">
              <div className="lg:col-span-7">
                <Label>{education.label}</Label>
                <motion.h2 variants={fadeUp} id="education-heading" className={`${sectionHeading} max-w-[14ch]`}>
                  {education.heading}
                </motion.h2>
              </div>
              <motion.p
                variants={fadeUp}
                className="max-w-[30rem] text-pretty text-base leading-relaxed text-text-secondary md:text-lg lg:col-span-4 lg:col-start-9 lg:self-end"
              >
                {education.intro}
              </motion.p>
            </motion.header>

            <motion.div {...reveal} className="mt-12 grid grid-cols-1 gap-5 md:mt-16 lg:grid-cols-12 lg:gap-6">
              <motion.article
                variants={fadeUp}
                aria-labelledby="degree-school"
                className="relative flex flex-col overflow-hidden rounded-[22px] border border-desk-line bg-surface p-7 shadow-[0_1px_2px_rgba(46,43,110,0.04),0_30px_60px_-44px_rgba(46,43,110,0.3)] sm:p-10 lg:col-span-7 lg:p-12"
              >
                <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-accent" />
                <p className="text-xs font-medium uppercase tracking-widest text-text-secondary">{education.degree.kind}</p>
                <h3
                  id="degree-school"
                  className="mt-5 font-display text-[clamp(2rem,1.4rem+2vw,3.25rem)] font-black leading-[1.02] tracking-[-0.025em] text-text-primary"
                >
                  {education.degree.school}
                </h3>
                <p className="mt-4 max-w-[30rem] text-pretty text-lg leading-relaxed text-text-primary md:text-xl">{education.degree.title}</p>
                {/* Dates · status. The separator sits just left of the pill, and the row is
                    shifted left and clipped, so if the pill wraps onto its own line the
                    separator falls outside the clip instead of stranding after the dates. */}
                <div className="mt-10 overflow-hidden border-t border-desk-line pt-6 text-sm text-text-secondary lg:mt-auto">
                  <div className="-ml-[27px] flex flex-wrap items-center gap-y-3">
                    <span className="ml-[27px]">{education.degree.dates}</span>
                    <span className="relative ml-[27px] inline-flex items-center gap-2 rounded-full bg-accent-highlight px-3 py-1 font-medium text-accent-dim">
                      <span aria-hidden="true" className="absolute -left-[15px] top-1/2 -translate-y-1/2 font-normal text-text-secondary">
                        ·
                      </span>
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {education.degree.status}
                    </span>
                  </div>
                </div>
              </motion.article>

              <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:gap-6">
                {education.certifications.map((cert) => (
                  <motion.li
                    key={cert.title}
                    variants={fadeUp}
                    className="flex min-h-[11rem] flex-col rounded-[22px] border border-lavender-line bg-lavender-soft p-7 sm:p-8"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs font-medium uppercase tracking-widest text-text-secondary">{education.certificationKind}</p>
                      <p className="rounded-full border border-lavender-line bg-white/70 px-2.5 py-0.5 text-xs font-medium tabular-nums text-text-primary">
                        {cert.year}
                      </p>
                    </div>
                    <h3 className="mt-auto pt-8 font-display text-xl font-bold leading-snug tracking-tight text-text-primary text-balance md:text-2xl">
                      {cert.title}
                    </h3>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* 4. The story behind Backwater Journal: a personal story on the app's paper */}
        <section aria-labelledby="backwater-heading" className="px-6 md:px-10 section-space bg-backwater-paper border-y border-backwater-edge">
          <div className="content-wide">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-14 items-center">
              <motion.div {...reveal} className="lg:col-span-6">
                <Label>{backwater.label}</Label>
                <motion.h2 variants={fadeUp} id="backwater-heading" className={`${sectionHeading} max-w-[14ch] text-balance`}>
                  {backwater.heading}
                </motion.h2>
                {/* The story's first line, set as a pull quote */}
                <motion.p
                  variants={fadeUp}
                  className="mt-10 max-w-[30rem] border-l-2 border-backwater-brass pl-6 font-display text-2xl font-bold leading-snug tracking-tight text-backwater-ink md:text-[1.875rem]"
                >
                  {lead}
                </motion.p>
              </motion.div>

              <div className="lg:col-span-6 xl:col-span-5 xl:col-start-8">
                <BackwaterFrames frames={backwater.frames} className="mx-auto lg:mr-0" />
              </div>
            </div>

            <motion.div {...reveal} className="mt-14 border-t border-backwater-edge pt-10 md:mt-16 md:pt-12">
              <div className="gap-x-12 md:columns-2 lg:max-w-[64rem]">
                {story.map((paragraph) => (
                  <motion.p
                    key={paragraph}
                    variants={fadeUp}
                    className="mb-5 break-inside-avoid text-pretty text-lg leading-relaxed text-backwater-ink/80"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
              <motion.div variants={fadeUp} className="mt-4">
                <Link
                  to={`/project/${backwater.projectId}`}
                  className={`group inline-flex min-h-[44px] items-center gap-2 rounded-sm text-sm font-medium text-backwater-forest underline decoration-backwater-forest/30 underline-offset-4 transition-colors duration-200 hover:decoration-backwater-forest ${focusRing}`}
                >
                  {backwater.linkLabel}
                  <ArrowRight
                    size={14}
                    weight="bold"
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:transform-none"
                  />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 5. Beyond the screen: a short personal note beside the photograph, set as a print */}
        <section aria-labelledby="beyond-heading" className="px-6 md:px-10 section-space">
          <div className="content-wide grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-14 items-center">
            <motion.div {...reveal} className="lg:col-span-5 max-w-[32rem]">
              <Label>{beyond.label}</Label>
              <motion.h2 variants={fadeUp} id="beyond-heading" className={`${sectionHeading} text-balance`}>
                {beyond.heading}
              </motion.h2>
              <div className="mt-7 flex flex-col gap-4">
                {beyond.body.map((paragraph) => (
                  <motion.p key={paragraph} variants={fadeUp} className="text-pretty text-lg leading-relaxed text-text-secondary">
                    {paragraph}
                  </motion.p>
                ))}
              </div>
              <motion.ul variants={fadeUp} aria-label="Interests" className="m-0 mt-8 flex list-none flex-wrap gap-2 p-0">
                {beyond.interests.map((interest) => (
                  <li
                    key={interest}
                    className="inline-flex items-center gap-2 rounded-full border border-desk-line bg-surface px-3.5 py-1.5 text-sm font-medium text-text-primary"
                  >
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {interest}
                  </li>
                ))}
              </motion.ul>
            </motion.div>

            <div className="lg:col-span-6 lg:col-start-7">
              <motion.figure
                initial={revealsEnabled ? { opacity: 0, y: 24 } : false}
                whileInView={revealsEnabled ? { opacity: 1, y: 0 } : undefined}
                viewport={{ once: true, margin: '-15% 0px' }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="m-0 mx-auto max-w-[40rem] rotate-[1.5deg] rounded-[8px] bg-white p-[2.5%] shadow-[0_2px_4px_rgba(46,43,110,0.06),0_36px_64px_-30px_rgba(46,43,110,0.4)]"
              >
                <img
                  src={aboutPhotos.beyond.sources[aboutPhotos.beyond.sources.length - 1].src}
                  srcSet={aboutPhotos.beyond.sources.map((s) => `${s.src} ${s.width}w`).join(', ')}
                  sizes="(min-width: 1280px) 620px, (min-width: 1024px) 46vw, calc(100vw - 48px)"
                  width={aboutPhotos.beyond.width}
                  height={aboutPhotos.beyond.height}
                  alt={aboutPhotos.beyond.alt}
                  loading="lazy"
                  decoding="async"
                  className="block aspect-[4/5] w-full rounded-[4px] object-cover object-[52%_50%] sm:aspect-[4/3]"
                />
              </motion.figure>
            </div>
          </div>
        </section>

        {/* 6. Closing: the homepage contact panel's language */}
        <section aria-labelledby="closing-heading" className="px-6 pb-10 pt-4 md:px-10 md:pb-12">
          <div className="content-wide">
            <div className="grid grid-cols-1 overflow-hidden rounded-[28px] border border-desk-line bg-surface shadow-[0_1px_2px_rgba(46,43,110,0.04),0_30px_60px_-40px_rgba(46,43,110,0.25)] lg:grid-cols-12">
              <motion.div {...reveal} className="min-w-0 px-5 py-12 sm:px-10 md:px-14 md:py-16 lg:col-span-7 xl:py-20 xl:pl-16">
                <Label>{closing.label}</Label>
                <motion.h2
                  variants={fadeUp}
                  id="closing-heading"
                  className="font-display text-[clamp(1.875rem,1rem+3.6vw,4.5rem)] font-black leading-[1.02] tracking-[-0.03em] text-text-primary"
                >
                  {closing.heading}
                </motion.h2>
                <div className="mt-7 flex max-w-[34rem] flex-col gap-4">
                  {closing.body.map((paragraph) => (
                    <motion.p key={paragraph} variants={fadeUp} className="text-pretty text-base leading-relaxed text-text-secondary md:text-lg">
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
                <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
                  <a href={contact.inquiryMailto} className={`${primaryButton} h-12 px-6 sm:text-base`}>
                    <EnvelopeSimple size={18} weight="bold" aria-hidden="true" />
                    {closing.buttonLabel}
                  </a>
                  <Link to="/" state={{ scrollTo: 'work' }} className={`${secondaryButton} h-12`}>
                    {closing.workLabel}
                    <ArrowDown size={14} weight="bold" aria-hidden="true" />
                  </Link>
                </motion.div>
                <motion.p
                  variants={fadeUp}
                  className="mt-10 flex items-center gap-2.5 border-t border-desk-line pt-6 text-sm text-text-secondary"
                >
                  <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {closing.opportunities}
                </motion.p>
              </motion.div>

              {/* The email that "Start a project" opens, drawn on the work surface. Decorative. */}
              <div
                aria-hidden="true"
                className="relative flex items-center justify-center border-t border-desk-line desk-grid px-8 py-12 sm:px-16 lg:col-span-5 lg:border-l lg:border-t-0 lg:px-10"
              >
                <div className={`w-full max-w-[22rem] -rotate-2 rounded-[14px] border border-desk-line bg-white ${cardShadow}`}>
                  <div className="flex items-center gap-1.5 border-b border-desk-line px-4 py-3">
                    <span className="h-2 w-2 rounded-full bg-sketch" />
                    <span className="h-2 w-2 rounded-full bg-sketch" />
                    <span className="h-2 w-2 rounded-full bg-sketch" />
                  </div>
                  <div className="divide-y divide-desk-line px-4 text-[0.8125rem]">
                    <p className="flex gap-3 py-2.5">
                      <span className="w-14 shrink-0 text-text-secondary">To</span>
                      <span className="min-w-0 truncate text-text-primary">{contact.email}</span>
                    </p>
                    <p className="flex gap-3 py-2.5">
                      <span className="w-14 shrink-0 text-text-secondary">Subject</span>
                      <span className="font-medium text-text-primary">{contact.inquirySubject}</span>
                    </p>
                  </div>
                  <div className="space-y-2.5 px-4 pb-5 pt-4">
                    <span className="block h-2 w-[42%] rounded-full bg-text-secondary/25" />
                    <span className="block h-2 w-[88%] rounded-full bg-sketch" />
                    <span className="block h-2 w-[70%] rounded-full bg-sketch" />
                    <span className="!mt-5 block h-2 w-[54%] rounded-full bg-text-secondary/25" />
                    <span className="block h-2 w-[80%] rounded-full bg-sketch" />
                    <div className="flex justify-end pt-3">
                      <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-accent px-3 text-[0.6875rem] font-medium text-white">
                        <EnvelopeSimple size={12} weight="bold" />
                        Send
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
