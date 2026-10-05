import { useEffect } from 'react'
import { MotionConfig, motion } from 'framer-motion'
import { ArrowRight, Check } from '@phosphor-icons/react'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/inter'
import { projects } from '@/data/projects'
import { afterglow } from '@/data/afterglow'
import PresentationOpening from '@/components/presentation/PresentationOpening'
import PresentationActions from '@/components/presentation/PresentationActions'
import PresentationSection from '@/components/presentation/PresentationSection'
import ScreenImage from '@/components/presentation/ScreenImage'
import PhoneLineup from '@/components/presentation/PhoneLineup'
import DemoVideo from '@/components/presentation/DemoVideo'
import { fadeUp, staggerContainer } from '@/lib/motion'
import { PresentationThemeContext, afterglowTheme } from '@/lib/presentationTheme'

const display = 'font-glow-display font-semibold leading-[1.15] tracking-[-0.01em]'

// Specimen of the product's date grid, matching the dates in the screenshots.
const sampleDates = [
  { day: 'Today', num: '4', selected: false },
  { day: 'Mon', num: '5', selected: true },
  { day: 'Tue', num: '6', selected: false },
  { day: 'Wed', num: '7', selected: false },
]

// Once-only reveal for groups of items, matching the section headers.
const revealList = {
  variants: staggerContainer,
  initial: 'hidden' as const,
  whileInView: 'visible' as const,
  viewport: { once: true, margin: '-10%' },
}

function Opening() {
  const project = projects.find((p) => p.id === 'afterglow-cinema')
  return (
    <PresentationOpening
      title={project?.title ?? 'Afterglow Cinema'}
      subtitle={afterglow.subtitle}
      eyebrow={afterglow.eyebrow}
      meta={afterglow.meta}
      showcase={afterglow.showcase}
      note={afterglow.artworkNote}
    />
  )
}

function Brief() {
  const { brief } = afterglow
  return (
    <PresentationSection id="brief" tone="alt" index="01" label="The brief" title={brief.title}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="max-w-[65ch] space-y-8 lg:col-span-6">
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-glow-accent">The challenge</h3>
            <p className="m-0 text-lg leading-relaxed text-glow-muted">{brief.challenge}</p>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-glow-accent">The design goal</h3>
            <p className="m-0 text-lg leading-relaxed">{brief.goal}</p>
          </div>
        </div>
        <motion.ol {...revealList} className="m-0 list-none p-0 lg:col-span-6">
          {brief.priorities.map((priority, i) => (
            <motion.li
              key={priority.title}
              variants={fadeUp}
              className="grid grid-cols-[3rem_1fr] gap-4 border-t border-glow-line py-6 last:border-b"
            >
              <span aria-hidden="true" className={`${display} text-3xl text-glow-accent`}>
                {i + 1}
              </span>
              <div>
                <h3 className={`${display} mb-2 text-xl`}>{priority.title}</h3>
                <p className="m-0 leading-relaxed text-glow-muted">{priority.body}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </PresentationSection>
  )
}

function Structure() {
  const { structure } = afterglow
  return (
    <PresentationSection
      id="structure"
      tone="base"
      index="02"
      label="Experience structure"
      title={structure.title}
      intro={structure.body}
    >
      <motion.ol {...revealList} className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        {structure.steps.map((step, i) => (
          <motion.li key={step.title} variants={fadeUp} className="relative lg:pr-8">
            <div className="mb-5 flex items-center gap-4">
              <span
                aria-hidden="true"
                className={`${display} flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-glow-accent text-xl text-glow-accent`}
              >
                {i + 1}
              </span>
              {i < structure.steps.length - 1 && (
                <span aria-hidden="true" className="hidden h-px flex-1 bg-glow-line-strong lg:block" />
              )}
            </div>
            <h3 className={`${display} mb-1 text-xl md:text-2xl`}>{step.title}</h3>
            <p className="m-0 text-glow-muted">{step.body}</p>
          </motion.li>
        ))}
      </motion.ol>
      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
        {structure.principles.map((principle) => (
          <div key={principle.title} className="border-t-2 border-glow-accent pt-5">
            <h3 className={`${display} mb-2 text-xl`}>{principle.title}</h3>
            <p className="m-0 max-w-[60ch] leading-relaxed text-glow-muted">{principle.body}</p>
          </div>
        ))}
      </div>
    </PresentationSection>
  )
}

function Identity() {
  const { identity } = afterglow
  return (
    <PresentationSection
      id="identity"
      tone="accent"
      index="03"
      label="Visual direction"
      title={identity.title}
      intro={identity.body}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-2xl bg-glow-bg p-6 text-glow-text sm:p-10 lg:col-span-7">
          <h3 className="sr-only">Typography</h3>
          <div className="border-b border-glow-line pb-8">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-glow-accent">{identity.displayFont.name}</p>
            <p className="mb-6 text-sm text-glow-muted">{identity.displayFont.role}</p>
            <p className="m-0 font-glow-display text-5xl font-semibold leading-[1.05] tracking-[-0.015em] sm:text-7xl">What’s on</p>
            <p aria-hidden="true" className="mt-5 font-glow-display text-2xl font-medium text-glow-muted">
              Aa Bb Cc 0123 Interstellar
            </p>
            <p aria-hidden="true" className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-glow-display text-xl text-glow-muted">
              <span className="font-medium">Medium 500</span>
              <span className="font-semibold">Semibold 600</span>
            </p>
            <p className="mb-1 mt-8 text-xs text-glow-muted">Long titles wrap rather than clip</p>
            <p className={`${display} m-0 max-w-[16ch] text-3xl [text-wrap:balance]`}>Spider-Man: Across the Spider-Verse</p>
          </div>
          <div className="pt-8">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-glow-accent">{identity.bodyFont.name}</p>
            <p className="mb-6 text-sm text-glow-muted">{identity.bodyFont.role}</p>
            <p className="m-0 text-base text-glow-muted">{identity.bodyFont.sample}</p>
            <p className="mt-4 max-w-[48ch] text-lg leading-relaxed">{identity.bodyFont.paragraph}</p>
            <p aria-hidden="true" className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-lg text-glow-muted">
              <span className="font-normal">Regular 400</span>
              <span className="font-medium">Medium 500</span>
              <span className="font-semibold">Semibold 600</span>
            </p>
            <p aria-hidden="true" className="mt-3 text-lg tabular-nums text-glow-muted">
              11:40 AM · 1:15 PM · From $12.50
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-5">
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--pres-eyebrow)]">Palette</h3>
            <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0">
              {identity.swatches.map((swatch) => (
                <li key={swatch.hex}>
                  <span
                    aria-hidden="true"
                    className="mb-3 block h-16 rounded-lg border border-[#D9D3C7]"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <span className="block font-semibold">{swatch.name}</span>
                  <span className="block font-mono text-sm text-glow-paper-muted">{swatch.hex}</span>
                  <span className="block text-sm text-glow-paper-muted">{swatch.usage}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 rounded-2xl bg-glow-bg p-6 text-glow-text sm:p-8">
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.14em] text-glow-accent">Components</h3>
            <ul className="m-0 flex list-none flex-col gap-6 p-0">
              <li>
                <span className="mb-2 block text-xs text-glow-muted">Date grid, selected day with an underline bar</span>
                <span className="flex gap-1.5">
                  {sampleDates.map(({ day, num, selected }) => (
                    <span key={num} className="flex flex-col items-center">
                      <span
                        className={`flex w-14 flex-col items-center rounded-md border py-1 leading-tight ${
                          selected
                            ? 'border-glow-accent bg-glow-accent text-glow-ink'
                            : 'border-glow-line-strong bg-glow-surface text-glow-text'
                        }`}
                      >
                        <span className="text-xs font-medium">{day}</span>
                        <span className="text-lg font-semibold tabular-nums">{num}</span>
                      </span>
                      <span className={`mt-1.5 block h-[3px] w-5 rounded-full ${selected ? 'bg-glow-text' : 'bg-transparent'}`} />
                    </span>
                  ))}
                </span>
              </li>
              <li>
                <span className="mb-2 block text-xs text-glow-muted">Showtimes, selected with a check and a word</span>
                <span className="flex flex-wrap gap-2">
                  <span className="flex min-w-[7rem] flex-col rounded-md border-2 border-glow-text bg-glow-accent px-3 py-2 text-glow-ink">
                    <span className="font-semibold tabular-nums">11:40 AM</span>
                    <span className="flex items-center gap-1 text-xs font-semibold">
                      <Check size={12} weight="bold" aria-hidden="true" />
                      Selected
                    </span>
                  </span>
                  <span className="flex min-w-[7rem] flex-col rounded-md border border-glow-line-strong bg-glow-surface px-3 py-2">
                    <span className="font-semibold tabular-nums">8:15 PM</span>
                    <span className="text-xs text-glow-accent">Few seats left</span>
                  </span>
                </span>
              </li>
              <li>
                <span className="mb-2 block text-xs text-glow-muted">Format chips and rating</span>
                <span className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-glow-accent px-4 py-2 text-sm font-semibold text-glow-ink">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-glow-ink" />
                    All formats
                  </span>
                  <span className="inline-flex items-center rounded-full border border-glow-line-strong px-4 py-2 text-sm font-semibold">IMAX</span>
                  <span className="rounded-[3px] border-[1.5px] border-glow-muted px-1.5 text-sm font-semibold leading-normal">PG-13</span>
                </span>
              </li>
              <li>
                <span className="mb-2 block text-xs text-glow-muted">Ticket summary</span>
                <span className="relative block rounded-md bg-glow-paper px-5 pb-4 pt-3 text-glow-ink">
                  <span className={`${display} block text-xl`}>Interstellar</span>
                  <span aria-hidden="true" className="absolute -left-2 top-[2.9rem] h-4 w-4 rounded-full bg-glow-bg" />
                  <span aria-hidden="true" className="absolute -right-2 top-[2.9rem] h-4 w-4 rounded-full bg-glow-bg" />
                  <span aria-hidden="true" className="my-2.5 block border-t-2 border-dashed border-[#B9B4AA]" />
                  <span className="grid grid-cols-[4.5rem_1fr] gap-y-1 text-sm">
                    <span className="font-medium text-glow-paper-muted">Date</span>
                    <span className="font-semibold">Monday, October 5</span>
                    <span className="font-medium text-glow-paper-muted">Time</span>
                    <span className="font-semibold tabular-nums">11:40 AM</span>
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p className="mt-8 max-w-[65ch] text-glow-paper-muted">{identity.note}</p>
    </PresentationSection>
  )
}

function Discovery() {
  const { discovery } = afterglow
  return (
    <PresentationSection
      id="discovery"
      tone="base"
      index="04"
      label="Film discovery"
      title={discovery.title}
      intro={discovery.body}
    >
      <ScreenImage image={discovery.image} caption={discovery.caption} chrome />
      <motion.ol {...revealList} className="m-0 mt-14 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-3">
        {discovery.notes.map((note, i) => (
          <motion.li key={note.title} variants={fadeUp} className="border-t border-glow-line pt-5">
            <p className={`${display} mb-1 text-base text-glow-accent`}>0{i + 1}</p>
            <h3 className={`${display} mb-2 text-xl md:text-2xl`}>{note.title}</h3>
            <p className="m-0 leading-relaxed text-glow-muted">{note.body}</p>
          </motion.li>
        ))}
      </motion.ol>
    </PresentationSection>
  )
}

function Details() {
  const { details } = afterglow
  return (
    <PresentationSection id="details" tone="alt" index="05" label="Details and selection" title={details.title} intro={details.body}>
      <div className="flex flex-col gap-20 md:gap-28">
        {details.steps.map((step, i) => {
          const reverse = i % 2 === 1
          return (
            <article key={step.eyebrow} className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14">
              <ScreenImage
                image={step.image}
                caption={step.caption}
                chrome
                className={`lg:col-span-8 ${reverse ? 'lg:col-start-5 lg:row-start-1' : ''}`}
              />
              <div className={`max-w-[65ch] lg:col-span-4 ${reverse ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-glow-accent">{step.eyebrow}</p>
                <h3 className={`${display} mb-5 text-2xl md:text-3xl`}>{step.title}</h3>
                <p className="mb-4 border-l-2 border-glow-accent pl-4 font-semibold leading-relaxed">{step.decision}</p>
                <p className="m-0 leading-relaxed text-glow-muted">{step.body}</p>
              </div>
            </article>
          )
        })}
      </div>
    </PresentationSection>
  )
}

function Motion() {
  const { motion: section } = afterglow
  return (
    <PresentationSection
      id="motion"
      tone="base"
      index="06"
      label="Motion and interaction"
      title={section.title}
      intro={section.body}
    >
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <DemoVideo
            mp4={section.video.mp4}
            webm={section.video.webm}
            poster={section.video.poster}
            caption={section.video.caption}
            description={section.video.description}
            label="motion demo"
          />
        </div>
        <div className="lg:col-span-5">
          <motion.ul {...revealList} className="m-0 list-none p-0">
            {section.effects.map((effect) => (
              <motion.li key={effect.title} variants={fadeUp} className="border-t border-glow-line py-5 first:border-t-0 first:pt-0">
                <h3 className={`${display} mb-1.5 text-lg md:text-xl`}>{effect.title}</h3>
                <p className="m-0 leading-relaxed text-glow-muted">{effect.body}</p>
              </motion.li>
            ))}
          </motion.ul>
          <p className="mt-2 rounded-xl border border-glow-line-strong p-5 text-sm leading-relaxed text-glow-muted">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-glow-accent">Reduced motion</span>
            {section.reducedMotion}
          </p>
        </div>
      </div>
    </PresentationSection>
  )
}

function Recovery() {
  const { recovery } = afterglow
  return (
    <PresentationSection id="recovery" tone="alt" index="07" label="Recovery and alternatives" title={recovery.title} intro={recovery.body}>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-8">
        {recovery.screens.map((screen) => (
          <article key={screen.title}>
            <ScreenImage image={screen.image} chrome />
            <h3 className={`${display} mb-2 mt-6 text-xl md:text-2xl`}>{screen.title}</h3>
            <p className="m-0 max-w-[60ch] leading-relaxed text-glow-muted">{screen.body}</p>
          </article>
        ))}
      </div>
      <p className="mt-12 flex max-w-[75ch] gap-3 border-t border-glow-line pt-6 text-glow-muted">
        <ArrowRight size={18} aria-hidden="true" className="mt-1 shrink-0 text-glow-accent" />
        {recovery.alternatives}
      </p>
    </PresentationSection>
  )
}

function Responsive() {
  const { responsive } = afterglow
  return (
    <PresentationSection
      id="responsive"
      tone="base"
      index="08"
      label="Responsive behaviour"
      title={responsive.title}
      intro={responsive.body}
    >
      <PhoneLineup screens={responsive.screens} />
      <ul className="m-0 mt-16 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-3">
        {responsive.notes.map((note) => (
          <li key={note.title} className="border-t border-glow-line pt-5">
            <h3 className={`${display} mb-2 text-xl`}>{note.title}</h3>
            <p className="m-0 leading-relaxed text-glow-muted">{note.body}</p>
          </li>
        ))}
      </ul>
    </PresentationSection>
  )
}

function Outcome() {
  const { outcome } = afterglow
  return (
    <PresentationSection id="outcome" tone="accent" index="09" label="Outcome and reflection" title={outcome.title}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--pres-eyebrow)]">What changed</h3>
          <ul className="m-0 list-none p-0">
            {outcome.changed.map((item) => (
              <li key={item} className="flex gap-3 border-t border-[#D9D3C7] py-4 text-lg">
                <Check size={20} weight="bold" aria-hidden="true" className="mt-1 shrink-0 text-glow-flag" />
                {item}
              </li>
            ))}
          </ul>
          <h3 className={`${display} mb-3 mt-10 text-2xl`}>{outcome.learned.title}</h3>
          <p className="m-0 max-w-[60ch] leading-relaxed text-glow-paper-muted">{outcome.learned.body}</p>
        </div>
        <div className="max-w-[65ch] lg:col-span-6">
          <h3 className={`${display} mb-3 text-2xl`}>{outcome.evidence.title}</h3>
          <p className="m-0 leading-relaxed text-glow-paper-muted">{outcome.evidence.body}</p>
          <p className="mt-6 rounded-xl bg-glow-bg p-5 text-glow-text">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-glow-accent">Success to evaluate</span>
            {outcome.evidence.measure}
          </p>
          <PresentationActions />
        </div>
      </div>
    </PresentationSection>
  )
}

export default function AfterglowCaseStudy() {
  useEffect(() => {
    window.scrollTo(0, 0)
    const previous = document.title
    document.title = 'Afterglow Cinema · Andrew Dumitru'
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <PresentationThemeContext.Provider value={afterglowTheme}>
        <div className="font-glow-body antialiased [color-scheme:dark]">
          <main>
            <Opening />
            <Brief />
            <Structure />
            <Identity />
            <Discovery />
            <Details />
            <Motion />
            <Recovery />
            <Responsive />
            <Outcome />
          </main>
        </div>
      </PresentationThemeContext.Provider>
    </MotionConfig>
  )
}
