import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MotionConfig, motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Check, DownloadSimple, HourglassMedium, MagnifyingGlass, MapPin, X } from '@phosphor-icons/react'
import '@fontsource-variable/fraunces'
import '@fontsource-variable/fraunces/wght-italic.css'
import '@fontsource-variable/instrument-sans'
import { projects } from '@/data/projects'
import { porchlight } from '@/data/porchlight'
import PresentationSection from '@/components/presentation/PresentationSection'
import ShowcaseStage from '@/components/presentation/ShowcaseStage'
import ScreenImage from '@/components/presentation/ScreenImage'
import ComparisonBlock from '@/components/presentation/ComparisonBlock'
import PhoneLineup from '@/components/presentation/PhoneLineup'
import { fadeUp, lineReveal, staggerContainer } from '@/lib/motion'

const workLink = { pathname: '/' }
const workState = { scrollTo: 'work' }

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1A5FB4]'

function Opening() {
  const project = projects.find((p) => p.id === 'porchlight')
  const { showcase, meta, eyebrow } = porchlight
  return (
    <section aria-labelledby="porchlight-title" className="bg-porch-cream text-porch-charcoal">
      <nav aria-label="Case study" className="mx-auto max-w-[1280px] px-4 pt-6 sm:px-6 md:px-10">
        <Link
          to={workLink}
          state={workState}
          className={`inline-flex items-center gap-2 rounded text-sm font-medium text-porch-green hover:underline ${focusRing} focus-visible:ring-offset-porch-cream`}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to work
        </Link>
      </nav>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-[1280px] px-4 pb-16 pt-12 sm:px-6 md:px-10 md:pb-24 md:pt-20"
      >
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.p
              variants={fadeUp}
              className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-porch-brass-text"
            >
              <span aria-hidden="true" className="block h-px w-8 bg-porch-brass" />
              {eyebrow}
            </motion.p>
            <h1 id="porchlight-title" className="font-porch-display text-5xl font-semibold leading-[0.98] tracking-[-0.03em] md:text-7xl lg:text-8xl">
              <span className="block overflow-hidden pb-[0.1em]">
                <motion.span variants={lineReveal} className="block">
                  {project?.title ?? 'Porchlight'}
                </motion.span>
              </span>
            </h1>
            <motion.p variants={fadeUp} className="mt-5 max-w-[34ch] font-porch-display text-xl italic leading-snug text-porch-green md:text-2xl">
              {project?.subtitle}
            </motion.p>
          </div>
          <motion.dl
            variants={fadeUp}
            className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-porch-border pt-6 lg:col-span-5"
          >
            {meta.map((item) => (
              <div key={item.label}>
                <dt className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-porch-muted">{item.label}</dt>
                <dd className="m-0 font-medium">{item.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.figure variants={fadeUp} className="m-0 mt-12 md:mt-16">
          <ShowcaseStage desktop={showcase.desktop} mobile={showcase.mobile} description={showcase.description} />
          <figcaption className="mt-5 text-sm text-porch-muted">{showcase.caption}</figcaption>
        </motion.figure>
      </motion.div>
    </section>
  )
}

function Challenge() {
  const { challenge } = porchlight
  return (
    <PresentationSection id="challenge" tone="white" index="01" label="The challenge" title={challenge.title}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="max-w-[65ch] lg:col-span-6">
          {challenge.body.map((paragraph) => (
            <p key={paragraph} className="mb-5 text-lg leading-relaxed text-porch-muted last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
        <ol className="m-0 list-none p-0 lg:col-span-6">
          {challenge.priorities.map((priority, i) => (
            <li key={priority.title} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-porch-border py-6 last:border-b">
              <span aria-hidden="true" className="font-porch-display text-3xl italic leading-none text-porch-brass">
                {i + 1}
              </span>
              <div>
                <h3 className="mb-2 font-porch-display text-xl font-semibold">{priority.title}</h3>
                <p className="m-0 leading-relaxed text-porch-muted">{priority.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </PresentationSection>
  )
}

function Wireframes() {
  const { wireframes } = porchlight
  return (
    <PresentationSection
      id="wireframes"
      tone="cream"
      index="02"
      label="Structure and wireframes"
      title={wireframes.title}
      intro={wireframes.body}
    >
      <div className="flex flex-col gap-16 md:gap-20">
        {wireframes.studies.map((study, i) => {
          const reverse = i % 2 === 1
          return (
            <article key={study.title} className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14">
              <div
                className={`flex items-end gap-4 sm:gap-6 lg:col-span-8 ${reverse ? 'lg:col-start-5 lg:row-start-1' : ''}`}
              >
                <figure className="m-0 min-w-0 flex-[4]">
                  <img
                    src={study.desktop.src}
                    alt={study.desktop.alt}
                    width={study.desktop.width}
                    height={study.desktop.height}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full max-w-[654px] rounded-md border border-porch-border bg-white shadow-[0_24px_50px_-34px_rgba(30,52,41,0.5)]"
                  />
                  <figcaption className="mt-2 text-xs uppercase tracking-[0.12em] text-porch-muted">Desktop · 1200</figcaption>
                </figure>
                <figure className="m-0 hidden min-w-0 flex-1 sm:block">
                  <img
                    src={study.mobile.src}
                    alt={study.mobile.alt}
                    width={study.mobile.width}
                    height={study.mobile.height}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full max-w-[158px] rounded-md border border-porch-border bg-white shadow-[0_24px_50px_-34px_rgba(30,52,41,0.5)]"
                  />
                  <figcaption className="mt-2 text-xs uppercase tracking-[0.12em] text-porch-muted">Mobile · 390</figcaption>
                </figure>
              </div>
              <div className={`max-w-[65ch] lg:col-span-4 ${reverse ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                <p className="mb-2 font-porch-display text-lg italic text-porch-green">0{i + 1}</p>
                <h3 className="mb-4 font-porch-display text-2xl font-semibold md:text-3xl">{study.title}</h3>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-porch-muted">Layout intent</p>
                <ul className="m-0 list-none space-y-2 p-0">
                  {study.intent.map((line) => (
                    <li key={line} className="flex gap-3 leading-relaxed">
                      <span aria-hidden="true" className="mt-[0.7em] block h-px w-4 shrink-0 bg-porch-brass" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          )
        })}
      </div>

      <div className="mt-16 flex flex-col gap-2 border-t border-porch-border pt-8 sm:flex-row sm:items-center sm:gap-6">
        <a
          href={wireframes.board.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex w-fit items-center gap-2 rounded-[10px] border border-porch-control bg-white px-5 py-3 font-semibold text-porch-charcoal transition-colors hover:border-porch-green hover:text-porch-green ${focusRing} focus-visible:ring-offset-porch-cream`}
        >
          {wireframes.board.label}
          <ArrowUpRight size={16} aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        <span className="text-sm text-porch-muted">{wireframes.board.detail}</span>
      </div>
    </PresentationSection>
  )
}

function Development() {
  const { development } = porchlight
  return (
    <PresentationSection
      id="development"
      tone="white"
      index="03"
      label="Design development"
      title={development.title}
      intro={development.body}
    >
      <div className="flex flex-col gap-20 md:gap-28">
        {development.comparisons.map((comparison, i) => (
          <article key={comparison.title}>
            <ComparisonBlock comparison={comparison} index={i} />
          </article>
        ))}
      </div>
    </PresentationSection>
  )
}

function Identity() {
  const { identity } = porchlight
  return (
    <PresentationSection
      id="identity"
      tone="green"
      index="04"
      label="Visual identity"
      title={identity.title}
      intro={identity.body}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-2xl bg-porch-cream p-6 text-porch-charcoal sm:p-10 lg:col-span-7">
          <h3 className="sr-only">Typography</h3>
          <div className="border-b border-porch-border pb-8">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-porch-brass-text">{identity.displayFont.name}</p>
            <p className="mb-6 text-sm text-porch-muted">{identity.displayFont.role}</p>
            <p className="m-0 font-porch-display text-5xl font-semibold leading-[1.02] tracking-[-0.02em] sm:text-7xl">
              {identity.displayFont.sample}
              <span className="block font-medium italic text-porch-green">{identity.displayFont.accent}</span>
            </p>
            <p aria-hidden="true" className="mt-6 font-porch-display text-2xl tracking-wide text-porch-muted">
              Aa Bb Cc 0123 $1,795
            </p>
          </div>
          <div className="pt-8">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-porch-brass-text">{identity.bodyFont.name}</p>
            <p className="mb-6 text-sm text-porch-muted">{identity.bodyFont.role}</p>
            <p className="m-0 text-xl font-semibold sm:text-2xl">Light-filled one-bedroom near the Rail Trail</p>
            <p className="mt-2 text-base text-porch-muted">{identity.bodyFont.sample}</p>
            <p className="mt-6 max-w-[48ch] text-lg leading-relaxed">{identity.bodyFont.paragraph}</p>
            <p aria-hidden="true" className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-lg text-porch-muted">
              <span className="font-[420]">Regular 420</span>
              <span className="font-[520]">Medium 520</span>
              <span className="font-[620]">Semibold 620</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-5">
          <div className="rounded-2xl bg-porch-cream p-6 text-porch-charcoal sm:p-8">
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.12em] text-porch-brass-text">Palette</h3>
            <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0">
              {identity.swatches.map((swatch) => (
                <li key={swatch.hex}>
                  <span
                    aria-hidden="true"
                    className="mb-3 block h-16 rounded-lg border border-porch-border"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <span className="block font-semibold">{swatch.name}</span>
                  <span className="block font-mono text-sm text-porch-muted">{swatch.hex}</span>
                  <span className="block text-sm text-porch-muted">{swatch.usage}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-porch-cream p-6 text-porch-charcoal sm:p-8">
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.12em] text-porch-brass-text">Components</h3>
            <ul className="m-0 flex list-none flex-col gap-5 p-0">
              <li>
                <span className="mb-2 block text-xs text-porch-muted">Search field and primary action</span>
                <span className="flex gap-2">
                  <span className="relative flex min-h-[3.25rem] min-w-0 flex-1 items-center rounded-[10px] border border-porch-control bg-white pl-10 pr-3 text-porch-muted">
                    <MapPin size={18} aria-hidden="true" className="absolute left-3" />
                    <span className="truncate">Neighborhood or ZIP code</span>
                  </span>
                  <span className="inline-flex min-h-[3.25rem] items-center gap-2 rounded-[10px] bg-porch-green px-4 font-semibold text-white">
                    <MagnifyingGlass size={18} aria-hidden="true" />
                    Search
                  </span>
                </span>
              </li>
              <li>
                <span className="mb-2 block text-xs text-porch-muted">Primary and secondary buttons</span>
                <span className="flex flex-wrap gap-2">
                  <span className="inline-flex min-h-[2.75rem] items-center rounded-[10px] bg-porch-green px-5 font-semibold text-white">
                    Request a tour
                  </span>
                  <span className="inline-flex min-h-[2.75rem] items-center rounded-[10px] border border-[#C7BCAB] bg-white px-5 font-semibold">
                    Save home
                  </span>
                </span>
              </li>
              <li>
                <span className="mb-2 block text-xs text-porch-muted">Filter chip and request status</span>
                <span className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex min-h-[2.25rem] items-center gap-2 rounded-full border border-porch-green bg-porch-green-soft pl-3 pr-2 text-sm font-semibold text-[#143424]">
                    Dogs allowed
                    <X size={14} aria-hidden="true" />
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-porch-pending-border bg-porch-pending-bg py-[0.3rem] pl-[0.55rem] pr-3 text-sm font-semibold text-porch-pending">
                    <HourglassMedium size={16} aria-hidden="true" />
                    Pending confirmation
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p className="mt-8 max-w-[65ch] text-porch-cream/85">{identity.note}</p>
    </PresentationSection>
  )
}

function Journey() {
  const { journey } = porchlight
  const last = journey.steps.length - 1
  return (
    <PresentationSection
      id="journey"
      tone="cream"
      index="05"
      label="The rental journey"
      title={journey.title}
      intro={journey.body}
    >
      <div className="flex flex-col gap-20 md:gap-28">
        {journey.steps.map((step, i) => {
          const reverse = i % 2 === 1
          return (
            <article key={step.eyebrow} className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14">
              <ScreenImage
                image={step.image}
                caption={step.caption}
                chrome
                className={`lg:col-span-7 ${reverse ? 'lg:col-start-6 lg:row-start-1' : ''}`}
              />
              <div className={`max-w-[65ch] lg:col-span-5 ${reverse ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-porch-brass-text">{step.eyebrow}</p>
                <h3 className="mb-5 font-porch-display text-2xl font-semibold leading-tight md:text-3xl">{step.title}</h3>
                <p className="mb-4 border-l-2 border-porch-green pl-4 font-semibold leading-relaxed">{step.decision}</p>
                <p className="m-0 leading-relaxed text-porch-muted">{step.body}</p>
                {i === last && (
                  <div className="mt-8 rounded-2xl border border-porch-border bg-white p-6">
                    <h4 className="mb-5 font-porch-display text-lg font-semibold">{journey.status.title}</h4>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-porch-green">
                          {journey.status.shown.label}
                        </p>
                        <ul className="m-0 list-none space-y-2 p-0">
                          {journey.status.shown.items.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm leading-snug">
                              <Check size={16} weight="bold" aria-hidden="true" className="mt-0.5 shrink-0 text-porch-green" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#A13127]">
                          {journey.status.avoided.label}
                        </p>
                        <ul className="m-0 list-none space-y-2 p-0">
                          {journey.status.avoided.items.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm leading-snug text-porch-muted">
                              <X size={16} weight="bold" aria-hidden="true" className="mt-0.5 shrink-0 text-[#A13127]" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </PresentationSection>
  )
}

function Responsive() {
  const { responsive } = porchlight
  return (
    <PresentationSection
      id="responsive"
      tone="white"
      index="06"
      label="Responsive experience"
      title={responsive.title}
      intro={responsive.body}
    >
      <PhoneLineup screens={responsive.screens} />
      <ul className="m-0 mt-16 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-3">
        {responsive.notes.map((note) => (
          <li key={note.title} className="border-t border-porch-border pt-5">
            <h3 className="mb-2 font-porch-display text-xl font-semibold">{note.title}</h3>
            <p className="m-0 leading-relaxed text-porch-muted">{note.body}</p>
          </li>
        ))}
      </ul>
    </PresentationSection>
  )
}

function Outcome() {
  const { outcome } = porchlight
  return (
    <PresentationSection id="outcome" tone="green" index="07" label="Outcome and reflection" title={outcome.title}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <ol className="m-0 list-none p-0 lg:col-span-6">
          {outcome.achieved.map((item, i) => (
            <li key={item.title} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-porch-cream/25 py-6">
              <span aria-hidden="true" className="font-porch-display text-3xl italic leading-none text-porch-brass-soft">
                {i + 1}
              </span>
              <div>
                <h3 className="mb-2 font-porch-display text-xl font-semibold">{item.title}</h3>
                <p className="m-0 leading-relaxed text-porch-cream/85">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="max-w-[65ch] lg:col-span-6">
          <h3 className="mb-4 font-porch-display text-2xl font-semibold">{outcome.untested.title}</h3>
          {outcome.untested.body.map((paragraph) => (
            <p key={paragraph} className="mb-4 leading-relaxed text-porch-cream/85">
              {paragraph}
            </p>
          ))}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={outcome.pdf.href}
              download
              className={`inline-flex items-center justify-center gap-2 rounded-[10px] bg-porch-cream px-5 py-3.5 font-semibold text-porch-green transition-colors hover:bg-white ${focusRing} focus-visible:ring-offset-porch-green focus-visible:ring-porch-cream`}
            >
              <DownloadSimple size={18} aria-hidden="true" />
              {outcome.pdf.label}
              <span className="font-normal text-porch-muted">({outcome.pdf.detail})</span>
            </a>
            <Link
              to={workLink}
              state={workState}
              className={`inline-flex items-center justify-center gap-2 rounded-[10px] border border-porch-cream/60 px-5 py-3.5 font-semibold text-porch-cream transition-colors hover:bg-porch-green-dark ${focusRing} focus-visible:ring-offset-porch-green focus-visible:ring-porch-cream`}
            >
              <ArrowLeft size={18} aria-hidden="true" />
              Back to Work
            </Link>
          </div>
        </div>
      </div>
    </PresentationSection>
  )
}

export default function PorchlightCaseStudy() {
  useEffect(() => {
    window.scrollTo(0, 0)
    const previous = document.title
    document.title = 'Porchlight · Andrew Dumitru'
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div className="font-porch-body antialiased">
        <main>
          <Opening />
          <Challenge />
          <Wireframes />
          <Development />
          <Identity />
          <Journey />
          <Responsive />
          <Outcome />
        </main>
      </div>
    </MotionConfig>
  )
}
