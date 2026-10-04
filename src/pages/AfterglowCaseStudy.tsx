import { useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import { ArrowRight, Check } from '@phosphor-icons/react'
import '@fontsource-variable/big-shoulders-display'
import '@fontsource-variable/atkinson-hyperlegible-next'
import { projects } from '@/data/projects'
import { afterglow } from '@/data/afterglow'
import PresentationOpening from '@/components/presentation/PresentationOpening'
import PresentationActions from '@/components/presentation/PresentationActions'
import PresentationSection from '@/components/presentation/PresentationSection'
import ScreenImage from '@/components/presentation/ScreenImage'
import PhoneLineup from '@/components/presentation/PhoneLineup'
import { PresentationThemeContext, afterglowTheme } from '@/lib/presentationTheme'

const display = 'font-glow-display font-extrabold leading-[0.98]'

// Specimen of the product's date grid, matching the dates in the screenshots.
const sampleDates = [
  { day: 'Today', num: '3', selected: false },
  { day: 'Sun', num: '4', selected: true },
  { day: 'Mon', num: '5', selected: false },
  { day: 'Tue', num: '6', selected: false },
]

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
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-glow-amber">The challenge</h3>
            <p className="m-0 text-lg leading-relaxed text-glow-ivory-muted">{brief.challenge}</p>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-glow-amber">The design goal</h3>
            <p className="m-0 text-lg leading-relaxed">{brief.goal}</p>
          </div>
        </div>
        <ol className="m-0 list-none p-0 lg:col-span-6">
          {brief.priorities.map((priority, i) => (
            <li key={priority.title} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-glow-line py-6 last:border-b">
              <span aria-hidden="true" className={`${display} text-4xl text-glow-amber`}>
                {i + 1}
              </span>
              <div>
                <h3 className={`${display} mb-2 text-2xl`}>{priority.title}</h3>
                <p className="m-0 leading-relaxed text-glow-ivory-muted">{priority.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </PresentationSection>
  )
}

function Origin() {
  const { origin } = afterglow
  return (
    <PresentationSection id="origin" tone="base" index="02" label="Where it started" title={origin.title} intro={origin.body}>
      <ScreenImage image={origin.image} caption={origin.caption} />
      <div className="mt-14">
        <div aria-hidden="true" className="hidden grid-cols-2 gap-10 pb-3 md:grid">
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-glow-ivory-faint">ReelHouse</p>
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-glow-amber">Afterglow</p>
        </div>
        <ul className="m-0 list-none p-0">
          {origin.rows.map((row) => (
            <li key={row.problem} className="grid grid-cols-1 gap-3 border-t border-glow-line py-6 md:grid-cols-2 md:gap-10">
              <p className="m-0 leading-relaxed text-glow-ivory-muted">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-glow-ivory-faint md:sr-only">
                  ReelHouse
                </span>
                {row.problem}
              </p>
              <p className="m-0 flex gap-3 leading-relaxed">
                <ArrowRight size={18} aria-hidden="true" className="mt-1 hidden shrink-0 text-glow-amber md:block" />
                <span>
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-glow-amber md:sr-only">
                    Afterglow
                  </span>
                  {row.response}
                </span>
              </p>
            </li>
          ))}
        </ul>
        <p className="m-0 border-t border-glow-line pt-6 text-sm text-glow-ivory-faint">{origin.note}</p>
      </div>
    </PresentationSection>
  )
}

function Structure() {
  const { structure } = afterglow
  return (
    <PresentationSection
      id="structure"
      tone="alt"
      index="03"
      label="Experience structure"
      title={structure.title}
      intro={structure.body}
    >
      <ol className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        {structure.steps.map((step, i) => (
          <li key={step.title} className="relative lg:pr-8">
            <div className="mb-5 flex items-center gap-4">
              <span
                aria-hidden="true"
                className={`${display} flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-glow-amber text-2xl text-glow-amber`}
              >
                {i + 1}
              </span>
              {i < structure.steps.length - 1 && (
                <span aria-hidden="true" className="hidden h-px flex-1 bg-glow-line-strong lg:block" />
              )}
            </div>
            <h3 className={`${display} mb-1 text-2xl md:text-3xl`}>{step.title}</h3>
            <p className="m-0 text-glow-ivory-muted">{step.body}</p>
          </li>
        ))}
      </ol>
      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
        {structure.principles.map((principle) => (
          <div key={principle.title} className="border-t-2 border-glow-amber pt-5">
            <h3 className={`${display} mb-2 text-2xl`}>{principle.title}</h3>
            <p className="m-0 max-w-[60ch] leading-relaxed text-glow-ivory-muted">{principle.body}</p>
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
      index="04"
      label="Visual direction"
      title={identity.title}
      intro={identity.body}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-2xl bg-glow-charcoal p-6 text-glow-ivory sm:p-10 lg:col-span-7">
          <h3 className="sr-only">Typography</h3>
          <div className="border-b border-glow-line pb-8">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-glow-amber">{identity.displayFont.name}</p>
            <p className="mb-6 text-sm text-glow-ivory-muted">{identity.displayFont.role}</p>
            <p className={`${display} m-0 text-6xl sm:text-8xl`}>What’s on</p>
            <p aria-hidden="true" className="mt-4 font-glow-display text-3xl font-medium tracking-wide text-glow-ivory-muted">
              Aa Bb Cc 0123 Interstellar
            </p>
            <p aria-hidden="true" className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-glow-display text-2xl text-glow-ivory-muted">
              <span className="font-medium">Medium 500</span>
              <span className="font-bold">Bold 700</span>
              <span className="font-extrabold">Extrabold 800</span>
            </p>
            <p className="mb-1 mt-8 text-xs text-glow-ivory-muted">Long titles wrap rather than clip</p>
            <p className={`${display} m-0 max-w-[14ch] text-4xl`}>Spider-Man: Across the Spider-Verse</p>
          </div>
          <div className="pt-8">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-glow-amber">{identity.bodyFont.name}</p>
            <p className="mb-6 text-sm text-glow-ivory-muted">{identity.bodyFont.role}</p>
            <p className="m-0 text-base text-glow-ivory-muted">{identity.bodyFont.sample}</p>
            <p className="mt-4 max-w-[48ch] text-lg leading-relaxed">{identity.bodyFont.paragraph}</p>
            <p aria-hidden="true" className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-lg text-glow-ivory-muted">
              <span className="font-normal">Regular</span>
              <span className="font-semibold">Semibold</span>
              <span className="font-bold">Bold</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-5">
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--pres-eyebrow)]">Palette</h3>
            <ul className="m-0 grid list-none grid-cols-3 gap-4 p-0">
              {identity.swatches.map((swatch) => (
                <li key={swatch.hex}>
                  <span
                    aria-hidden="true"
                    className="mb-3 block h-20 rounded-lg border border-[#D8CCB8]"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <span className="block font-semibold">{swatch.name}</span>
                  <span className="block font-mono text-sm text-glow-paper-muted">{swatch.hex}</span>
                  <span className="block text-sm text-glow-paper-muted">{swatch.usage}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 rounded-2xl bg-glow-charcoal p-6 text-glow-ivory sm:p-8">
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.14em] text-glow-amber">Components</h3>
            <ul className="m-0 flex list-none flex-col gap-6 p-0">
              <li>
                <span className="mb-2 block text-xs text-glow-ivory-muted">Date grid, selected day with an underline bar</span>
                <span className="flex gap-1.5">
                  {sampleDates.map(({ day, num, selected }) => (
                    <span key={num} className="flex flex-col items-center">
                      <span
                        className={`flex w-14 flex-col items-center rounded-md border py-1 leading-tight ${
                          selected
                            ? 'border-glow-amber bg-glow-amber text-glow-charcoal'
                            : 'border-glow-line bg-glow-surface text-glow-ivory'
                        }`}
                      >
                        <span className="text-xs font-semibold">{day}</span>
                        <span className="text-lg font-bold">{num}</span>
                      </span>
                      <span className={`mt-1.5 block h-[3px] w-5 rounded-full ${selected ? 'bg-glow-ivory' : 'bg-transparent'}`} />
                    </span>
                  ))}
                </span>
              </li>
              <li>
                <span className="mb-2 block text-xs text-glow-ivory-muted">Showtimes, selected with a check and a word</span>
                <span className="flex flex-wrap gap-2">
                  <span className="flex min-w-[7rem] flex-col rounded-md border-2 border-glow-amber bg-glow-amber px-3 py-2 text-glow-charcoal">
                    <span className="font-bold">1:15 PM</span>
                    <span className="flex items-center gap-1 text-xs font-semibold">
                      <Check size={12} weight="bold" aria-hidden="true" />
                      Selected
                    </span>
                  </span>
                  <span className="flex min-w-[7rem] flex-col rounded-md border border-glow-line-strong bg-glow-surface px-3 py-2">
                    <span className="font-bold">2:30 PM</span>
                    <span className="text-xs text-glow-ivory-muted">Standard</span>
                  </span>
                </span>
              </li>
              <li>
                <span className="mb-2 block text-xs text-glow-ivory-muted">Format chips and rating</span>
                <span className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-glow-ivory px-4 py-2 text-sm font-bold text-glow-charcoal">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-glow-charcoal" />
                    All formats
                  </span>
                  <span className="inline-flex items-center rounded-full border border-glow-line-strong px-4 py-2 text-sm font-bold">IMAX</span>
                  <span className="rounded-[3px] border-[1.5px] border-glow-ivory-muted px-1.5 text-sm font-bold leading-normal">PG-13</span>
                </span>
              </li>
              <li>
                <span className="mb-2 block text-xs text-glow-ivory-muted">Ticket summary</span>
                <span className="relative block rounded-md bg-glow-ivory px-5 pb-4 pt-3 text-glow-ink">
                  <span className={`${display} block text-2xl`}>Interstellar</span>
                  <span aria-hidden="true" className="absolute -left-2 top-[3.05rem] h-4 w-4 rounded-full bg-glow-charcoal" />
                  <span aria-hidden="true" className="absolute -right-2 top-[3.05rem] h-4 w-4 rounded-full bg-glow-charcoal" />
                  <span aria-hidden="true" className="my-2.5 block border-t-2 border-dashed border-[#BDB09B]" />
                  <span className="grid grid-cols-[4.5rem_1fr] gap-y-1 text-sm">
                    <span className="font-semibold text-glow-paper-muted">Date</span>
                    <span className="font-bold">Sunday, October 4</span>
                    <span className="font-semibold text-glow-paper-muted">Time</span>
                    <span className="font-bold">1:15 PM</span>
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
      index="05"
      label="Film discovery"
      title={discovery.title}
      intro={discovery.body}
    >
      <ScreenImage image={discovery.image} caption={discovery.caption} chrome />
      <ol className="m-0 mt-14 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-3">
        {discovery.notes.map((note, i) => (
          <li key={note.title} className="border-t border-glow-line pt-5">
            <p className={`${display} mb-1 text-lg text-glow-amber`}>0{i + 1}</p>
            <h3 className={`${display} mb-2 text-2xl md:text-3xl`}>{note.title}</h3>
            <p className="m-0 leading-relaxed text-glow-ivory-muted">{note.body}</p>
          </li>
        ))}
      </ol>
    </PresentationSection>
  )
}

function Details() {
  const { details } = afterglow
  return (
    <PresentationSection id="details" tone="alt" index="06" label="Details and selection" title={details.title} intro={details.body}>
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
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-glow-amber">{step.eyebrow}</p>
                <h3 className={`${display} mb-5 text-3xl md:text-4xl`}>{step.title}</h3>
                <p className="mb-4 border-l-2 border-glow-amber pl-4 font-semibold leading-relaxed">{step.decision}</p>
                <p className="m-0 leading-relaxed text-glow-ivory-muted">{step.body}</p>
              </div>
            </article>
          )
        })}
      </div>
    </PresentationSection>
  )
}

function Recovery() {
  const { recovery } = afterglow
  return (
    <PresentationSection id="recovery" tone="base" index="07" label="Recovery and alternatives" title={recovery.title} intro={recovery.body}>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-8">
        {recovery.screens.map((screen) => (
          <article key={screen.title}>
            <ScreenImage image={screen.image} chrome />
            <h3 className={`${display} mb-2 mt-6 text-2xl md:text-3xl`}>{screen.title}</h3>
            <p className="m-0 max-w-[60ch] leading-relaxed text-glow-ivory-muted">{screen.body}</p>
          </article>
        ))}
      </div>
      <p className="mt-12 flex max-w-[75ch] gap-3 border-t border-glow-line pt-6 text-glow-ivory-muted">
        <ArrowRight size={18} aria-hidden="true" className="mt-1 shrink-0 text-glow-amber" />
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
      tone="alt"
      index="08"
      label="Responsive behaviour"
      title={responsive.title}
      intro={responsive.body}
    >
      <PhoneLineup screens={responsive.screens} />
      <ul className="m-0 mt-16 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-3">
        {responsive.notes.map((note) => (
          <li key={note.title} className="border-t border-glow-line pt-5">
            <h3 className={`${display} mb-2 text-2xl`}>{note.title}</h3>
            <p className="m-0 leading-relaxed text-glow-ivory-muted">{note.body}</p>
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
              <li key={item} className="flex gap-3 border-t border-[#D8CCB8] py-4 text-lg">
                <Check size={20} weight="bold" aria-hidden="true" className="mt-1 shrink-0 text-[#8A5A00]" />
                {item}
              </li>
            ))}
          </ul>
          <h3 className={`${display} mb-3 mt-10 text-3xl`}>{outcome.learned.title}</h3>
          <p className="m-0 max-w-[60ch] leading-relaxed text-glow-paper-muted">{outcome.learned.body}</p>
        </div>
        <div className="max-w-[65ch] lg:col-span-6">
          <h3 className={`${display} mb-3 text-3xl`}>{outcome.evidence.title}</h3>
          <p className="m-0 leading-relaxed text-glow-paper-muted">{outcome.evidence.body}</p>
          <p className="mt-6 rounded-xl bg-glow-charcoal p-5 text-glow-ivory">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-glow-amber">Success to evaluate</span>
            {outcome.evidence.measure}
          </p>
          <PresentationActions pdf={outcome.pdf} />
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
            <Origin />
            <Structure />
            <Identity />
            <Discovery />
            <Details />
            <Recovery />
            <Responsive />
            <Outcome />
          </main>
        </div>
      </PresentationThemeContext.Provider>
    </MotionConfig>
  )
}
