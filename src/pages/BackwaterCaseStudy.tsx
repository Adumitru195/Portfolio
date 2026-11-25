import { useEffect, useId, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight } from '@phosphor-icons/react'
import '@fontsource-variable/newsreader'
import '@fontsource-variable/instrument-sans'
import { backwater, type BwScreen } from '@/data/backwater'
import PresentationActions from '@/components/presentation/PresentationActions'
import ZoomFigure from '@/components/presentation/ZoomFigure'
import ResponsiveWalkthrough from '@/components/presentation/ResponsiveWalkthrough'
import MapAttribution from '@/components/MapAttribution'
import { workLink, workState } from '@/components/presentation/PresentationOpening'
import { fadeUp } from '@/lib/motion'
import { backwaterTheme, PresentationThemeContext, type SectionTone } from '@/lib/presentationTheme'
import { useReveal } from '@/hooks/useReveal'

const container = 'mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10'
const label = 'text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--pres-eyebrow)]'
const muted = 'text-[color:var(--pres-muted)]'
const serif = 'font-wove-display font-normal tracking-[-0.015em]'
const number = (index: number) => String(index + 1).padStart(2, '0')
const focus = `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${backwaterTheme.focusRing}`

// A short fade and lift as content enters the viewport. Shown straight away
// under reduced motion (system or footer toggle) or without IntersectionObserver.
function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reveal = useReveal({ once: true, margin: '-8%' })
  return (
    <motion.div variants={fadeUp} {...reveal} className={className}>
      {children}
    </motion.div>
  )
}

// Topographic contour rings: irregular closed curves around one point, drawn
// once at load. Decorative only.
function ring(radius: number, phase: number) {
  const steps = 56
  const points = Array.from({ length: steps }, (_, i) => {
    const angle = (i / steps) * Math.PI * 2
    const wobble = 1 + 0.09 * Math.sin(3 * angle + phase) + 0.05 * Math.sin(5 * angle + phase * 1.7) + 0.03 * Math.cos(7 * angle + phase * 0.6)
    return [300 + Math.cos(angle) * radius * 1.4 * wobble, 300 + Math.sin(angle) * radius * wobble]
  })
  const mid = (a: number[], b: number[]) => `${((a[0] + b[0]) / 2).toFixed(1)} ${((a[1] + b[1]) / 2).toFixed(1)}`
  let path = `M${mid(points[0], points[1])}`
  for (let i = 1; i <= steps; i++) {
    const point = points[i % steps]
    const next = points[(i + 1) % steps]
    path += ` Q${point[0].toFixed(1)} ${point[1].toFixed(1)} ${mid(point, next)}`
  }
  return `${path}Z`
}
const contourPaths = Array.from({ length: 11 }, (_, i) => ring(24 + i * 26, 0.4 + i * 0.22))

function Contours({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" fill="none" className={`pointer-events-none absolute ${className}`}>
      {contourPaths.map((d) => <path key={d} d={d} stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
    </svg>
  )
}

function ExternalLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${className} ${focus}`}>
      {children}
      <ArrowUpRight size={16} aria-hidden="true" className="shrink-0" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}

function ScreenFigure({ screen, className = '' }: { screen: BwScreen; className?: string }) {
  return <ZoomFigure image={screen.image} captionLabel={screen.label} caption={screen.caption} className={className} portrait />
}

interface SectionProps {
  id: string
  index: number
  name: string
  title: string
  tone: SectionTone
  intro?: string
  children: ReactNode
}

// A numbered chapter: a large brass numeral and the chapter name on the left,
// the editorial heading on the right, all over a fine rule.
function Section({ id, index, name, title, tone, intro, children }: SectionProps) {
  const dark = tone === 'accent'
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`${backwaterTheme.tones[tone]} relative overflow-hidden py-20 md:py-28`}>
      <div className={`${container} relative`}>
        <Reveal className="mb-12 grid grid-cols-1 gap-4 border-t border-[color:var(--pres-border)] pt-8 md:mb-16 lg:grid-cols-12 lg:gap-10">
          <p className="m-0 flex items-baseline gap-3 lg:col-span-3 lg:flex-col lg:gap-2">
            <span aria-hidden="true" className={`${serif} text-4xl leading-none md:text-5xl ${dark ? 'text-[#D9A441]' : 'text-[#A87318]'}`}>{number(index)}</span>
            <span className={`text-sm ${muted}`}>
              <span className="sr-only">Section {number(index)}: </span>
              {name}
            </span>
          </p>
          <div className="lg:col-span-9">
            <h2 id={`${id}-title`} className={`${backwaterTheme.heading} max-w-[22ch] text-4xl md:text-6xl`}>{title}</h2>
            {intro && <p className={`mb-0 mt-6 max-w-[62ch] text-lg leading-relaxed ${muted}`}>{intro}</p>}
          </div>
        </Reveal>
        {children}
      </div>
    </section>
  )
}

function Paragraphs({ items, lead = false }: { items: string[]; lead?: boolean }) {
  return (
    <>
      {items.map((paragraph, index) => (
        <p key={paragraph} className={`mb-5 max-w-[60ch] leading-relaxed ${lead && index === 0 ? 'text-xl' : `text-lg ${muted}`}`}>
          {paragraph}
        </p>
      ))}
    </>
  )
}

// A highlighted sentence: the serif callout used for a section's key idea.
function Callout({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={`${serif} m-0 border-l-2 pl-6 text-2xl leading-snug md:text-3xl ${dark ? 'border-[#D9A441]' : 'border-[#A87318]'}`}>
      {children}
    </p>
  )
}

function Note({ children }: { children: ReactNode }) {
  return (
    <p className={`mb-0 mt-10 max-w-[80ch] border-l-2 border-[#A87318] pl-4 text-sm leading-relaxed ${muted}`}>{children}</p>
  )
}

function Opening() {
  const { opening } = backwater
  const [dock, explore] = opening.screens
  return (
    <section aria-labelledby="backwater-title" className={`${backwaterTheme.tones.base} relative overflow-hidden`}>
      <nav aria-label="Case study" className={`${container} flex items-center justify-between gap-4 border-b border-[#DDD6C8] py-5`}>
        <Link to={workLink} state={workState} className={`inline-flex min-h-11 items-center gap-2 rounded text-sm font-medium text-[#20382F] hover:underline ${focus}`}>
          <ArrowLeft size={16} aria-hidden="true" />
          Back to Work
        </Link>
        <p className="m-0 hidden text-xs uppercase tracking-[0.14em] text-[#5A665E] sm:block">{backwater.runningHead}</p>
      </nav>
      <div className={`${container} grid grid-cols-1 gap-12 pb-16 pt-14 md:pb-10 md:pt-20 lg:grid-cols-12 lg:gap-10`}>
        <Reveal className="lg:col-span-7 lg:pt-4">
          <p className={`${label} mb-8`}>{opening.eyebrow}</p>
          <h1 id="backwater-title" className={`m-0 ${backwaterTheme.title}`}>
            {opening.title.split(' ').map((word) => <span key={word} className="block">{word}</span>)}
          </h1>
          <p className={`mb-0 mt-7 ${backwaterTheme.subtitle}`}>{opening.tagline}</p>
          <p className="mb-0 mt-6 max-w-[42ch] text-xl leading-relaxed md:text-2xl">{opening.lede}</p>
          <div className="mt-10 max-w-[60ch] border-t border-[#DDD6C8] pt-6">
            <p className={`${label} mb-2`}>{opening.roleLabel}</p>
            <p className="m-0 text-lg">{opening.role}</p>
          </div>
          <dl className="m-0 mt-8 grid max-w-[60ch] grid-cols-2 gap-x-6 gap-y-5">
            {opening.meta.map((item) => (
              <div key={item.label}>
                <dt className={`${label} mb-1`}>{item.label}</dt>
                <dd className="m-0 leading-snug">{item.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {opening.links.map((link, index) => (
              <ExternalLink key={link.href} href={link.href}
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] px-5 py-3 font-semibold transition-colors ${index === 0 ? 'bg-[#20382F] text-[#F4F1EA] hover:bg-[#172820]' : 'border border-[#20382F] text-[#20382F] hover:bg-[#EAE5DA]'}`}>
                {link.label}
              </ExternalLink>
            ))}
          </div>
        </Reveal>
        <Reveal className="lg:col-span-5">
          <figure className="relative m-0 overflow-hidden bg-[#EAE5DA] px-5 pb-8 pt-12 sm:px-10">
            <Contours className="inset-0 h-full w-full text-[#CFC6B4]" />
            <div className="relative mx-auto grid max-w-[460px] grid-cols-2 items-start gap-4 sm:gap-8">
              <ScreenFigure screen={dock} className="mt-16" />
              <ScreenFigure screen={explore} />
            </div>
            <figcaption className="relative mt-6">
              <span className={`${label} block text-[#5A665E]`}>{opening.caption}</span>
              <MapAttribution subject="Map in the Explore screen" className="mt-2 text-[#5A665E]" linkClassName={focus} />
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}

// 01. From an idea to a real product
// The product walkthrough, between the opening and section 01. It isn't one of
// the seven numbered sections, so it has an eyebrow instead of a numeral.
function Walkthrough() {
  const { walkthrough } = backwater
  const descriptionId = useId()
  return (
    <section aria-labelledby="walkthrough-title" className={`${backwaterTheme.tones.base} relative pb-20 pt-4 md:pb-28 md:pt-10`}>
      <div className={container}>
        <Reveal className="mb-10 grid grid-cols-1 gap-4 border-t border-[color:var(--pres-border)] pt-8 md:mb-12 lg:grid-cols-12 lg:gap-10">
          <p className={`${label} m-0 lg:col-span-3 lg:pt-3`}>{walkthrough.eyebrow}</p>
          <div className="lg:col-span-9">
            <h2 id="walkthrough-title" className={`${backwaterTheme.heading} m-0 max-w-[22ch] text-3xl md:text-5xl`}>{walkthrough.title}</h2>
            <p className={`mb-0 mt-5 max-w-[62ch] text-lg leading-relaxed ${muted}`}>{walkthrough.body}</p>
          </div>
        </Reveal>
        <Reveal>
          <figure className="relative m-0 overflow-hidden bg-[#EAE5DA] px-4 pb-6 pt-6 sm:px-8 md:px-10 md:pb-8 md:pt-10">
            <Contours className="inset-0 h-full w-full text-[#CFC6B4]" />
            <div className="relative">
              <ResponsiveWalkthrough
                landscape={walkthrough.landscape}
                vertical={walkthrough.vertical}
                label={walkthrough.label}
                playLabel={walkthrough.playLabel}
                playText={walkthrough.playText}
                descriptionId={descriptionId}
              />
            </div>
            <figcaption className="relative mt-5">
              <span className={`${label} block text-[#5A665E]`}>{walkthrough.disclosure}</span>
              <MapAttribution subject="Map in the Explore scene" className="mt-2 text-[#5A665E]" linkClassName={focus} />
            </figcaption>
          </figure>
          <details className="group mt-5 max-w-[70ch]">
            <summary className={`inline-flex min-h-11 cursor-pointer items-center rounded text-sm font-semibold text-[#20382F] underline-offset-2 hover:underline ${focus}`}>
              {walkthrough.descriptionLabel}
            </summary>
            <p id={descriptionId} className={`mb-0 mt-2 text-sm leading-relaxed ${muted}`}>{walkthrough.description}</p>
          </details>
        </Reveal>
      </div>
    </section>
  )
}

function Idea() {
  const { idea } = backwater
  return (
    <Section id="idea" index={0} name={idea.name} title={idea.title} tone="base">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-7">
          <Paragraphs items={idea.body} lead />
        </Reveal>
        <Reveal className="lg:col-span-4 lg:col-start-9">
          <div className="bg-[#EAE5DA] p-6 md:p-8">
            <p className={`${label} mb-4`}>The challenge</p>
            <p className={`${serif} m-0 text-2xl leading-snug`}>{idea.challenge}</p>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

// 02. Designing around the fishing experience
function Structure() {
  const { structure } = backwater
  return (
    <Section id="structure" index={1} name={structure.name} title={structure.title} intro={structure.intro} tone="alt">
      <Contours className="-right-[26rem] -top-56 hidden h-[34rem] w-[46rem] text-[#DCD4C5] lg:block" />
      <ol className="relative m-0 grid list-none grid-cols-1 p-0 md:grid-cols-2 lg:grid-cols-4">
        {structure.steps.map((step, index) => (
          <li key={step.name} className="relative border-l border-[#A87318]/50 pb-8 pl-7 last:pb-0 md:border-l-0 md:pb-10 md:pl-0 md:last:pb-10 lg:pb-0 lg:last:pb-0">
            <span aria-hidden="true" className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#A87318] md:hidden" />
            <Reveal className="md:h-full md:border-t md:border-[#A87318]/60 md:pr-6 md:pt-6">
              <p className="mb-3 text-sm font-semibold text-[#8A5E12]"><span className="sr-only">Step </span>{number(index)}</p>
              <h3 className={`${serif} mb-2 text-3xl`}>{step.name}</h3>
              <p className={`m-0 max-w-[32ch] leading-relaxed ${muted}`}>{step.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>
      <Reveal className="relative mt-14 bg-[#F4F1EA] p-6 md:p-8">
        {structure.body.map((paragraph, index) => (
          <p key={paragraph} className={`max-w-[72ch] text-lg leading-relaxed ${index === 0 ? 'mb-4' : 'm-0'}`}>{paragraph}</p>
        ))}
      </Reveal>
    </Section>
  )
}

// 03. Rethinking Explore
function Explore() {
  const { explore } = backwater
  return (
    <Section id="explore" index={2} name={explore.name} title={explore.title} tone="base">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="relative lg:col-span-6">
          <Contours className="inset-0 h-full w-full text-[#E3DCCD]" />
          <div className="relative mx-auto grid w-full max-w-[560px] grid-cols-2 items-start gap-4 sm:gap-8">
            <ScreenFigure screen={explore.before} />
            <ScreenFigure screen={explore.after} className="mt-16" />
          </div>
          <MapAttribution subject="Maps in both screens" className="relative mx-auto mt-4 max-w-[560px] text-[#5A665E]" linkClassName={focus} />
        </div>
        <div className="lg:col-span-6">
          <Reveal>
            <Paragraphs items={explore.body} lead />
          </Reveal>
          <Reveal className="mt-8">
            <Callout>{explore.goal}</Callout>
          </Reveal>
        </div>
      </div>
      <Reveal className="mt-16 border-t border-[#DDD6C8] pt-10">
        <h3 className={`${label} mb-6`}>{explore.changesLabel}</h3>
        <ol className="m-0 grid list-none grid-cols-1 gap-x-10 p-0 md:grid-cols-2">
          {explore.changes.map((change, index) => (
            <li key={change} className="grid grid-cols-[2.25rem_1fr] gap-3 border-t border-[color:var(--pres-border)] py-5">
              <span aria-hidden="true" className="pt-1 text-sm font-semibold text-[#8A5E12]">{number(index)}</span>
              <span className={`${serif} text-xl leading-snug`}>{change}</span>
            </li>
          ))}
        </ol>
      </Reveal>
      <Reveal className="mt-10 grid grid-cols-1 gap-2 border-t border-[color:var(--pres-border)] pt-6 md:grid-cols-[11rem_1fr] md:gap-8">
        <h3 className={label}>{explore.validateLabel}</h3>
        <p className={`${serif} m-0 text-xl leading-snug`}>{explore.validate}</p>
      </Reveal>
      <Note>{explore.note}</Note>
    </Section>
  )
}

// 04. Building an experience beyond the map
function Beyond() {
  const { beyond } = backwater
  return (
    <Section id="beyond-the-map" index={3} name={beyond.name} title={beyond.title} tone="alt">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <Reveal>
            <Paragraphs items={beyond.body} lead />
          </Reveal>
          <Reveal className="mt-8">
            <Callout>{beyond.closing}</Callout>
          </Reveal>
        </div>
        {/* Two larger phones, the second set lower for depth */}
        <div className="relative lg:col-span-6">
          <Contours className="inset-0 h-full w-full text-[#D8D0C0]" />
          <div className="relative mx-auto grid max-w-[600px] grid-cols-2 items-start gap-5 sm:gap-10">
            {beyond.screens.map((screen, position) => (
              <ScreenFigure key={screen.label} screen={screen} className={position === 1 ? 'mt-20' : ''} />
            ))}
          </div>
        </div>
      </div>

      {/* Catch logging: the product's core record, in brief */}
      <div className="mt-20 border-t border-[#DDD6C8] pt-12 md:mt-24">
        <Reveal>
          <h3 className={`${backwaterTheme.heading} m-0 text-3xl md:text-4xl`}>{beyond.catchLogging.label}</h3>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="mx-auto w-full max-w-[280px] lg:col-span-4 lg:mx-0">
            <ScreenFigure screen={beyond.catchLogging.screen} />
          </div>
          <dl className="m-0 lg:col-span-8">
            {beyond.catchLogging.rows.map((row) => (
              <Reveal key={row.label} className="grid grid-cols-1 gap-2 border-t border-[color:var(--pres-border)] py-6 md:grid-cols-[11rem_1fr] md:gap-8">
                <dt className={label}>{row.label}</dt>
                <dd className="m-0 max-w-[60ch] text-lg leading-relaxed">{row.body}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
      <Note>{beyond.note}</Note>
    </Section>
  )
}

// 05. Continuing to improve after launch
function Release() {
  const { release } = backwater
  return (
    <Section id="release" index={4} name={release.name} title={release.title} intro={release.intro} tone="accent">
      <Contours className="-bottom-72 -left-[28rem] hidden h-[36rem] w-[48rem] text-[#2A4639] md:block" />
      <ol className="relative m-0 grid list-none grid-cols-1 gap-10 p-0 md:grid-cols-3">
        {release.versions.map((version) => (
          <li key={version.name} className="border-l border-[#D9A441]/60 pl-6">
            <Reveal>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#D9A441]">{version.date}</p>
              <h3 className={`${serif} mb-3 text-3xl`}>{version.name}</h3>
              <p className="m-0 max-w-[44ch] leading-relaxed text-[#C9D3CC]">{version.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>
      <Reveal className="relative mt-14 max-w-[56rem]">
        <Callout dark>{release.closing}</Callout>
      </Reveal>
      <p className="relative mb-0 mt-10 text-sm text-[#C9D3CC]">{release.verified}</p>
    </Section>
  )
}

// 06. Trust, privacy, and product boundaries
function Trust() {
  const { trust } = backwater
  return (
    <Section id="trust" index={5} name={trust.name} title={trust.title} tone="base">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-7">
          <Paragraphs items={trust.body} lead />
        </Reveal>
        <Reveal className="lg:col-span-4 lg:col-start-9">
          <div className="bg-[#20382F] p-6 text-[#F4F1EA] md:p-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#D9A441]">Next to evaluate</p>
            <p className={`${serif} m-0 text-xl leading-snug md:text-2xl`}>{trust.next}</p>
          </div>
        </Reveal>
      </div>
      <Note>{trust.sources}</Note>
    </Section>
  )
}

// 07. What I learned
function Learned() {
  const { learned } = backwater
  return (
    <Section id="learned" index={6} name={learned.name} title={learned.title} tone="accent">
      <Contours className="-right-[30rem] -top-48 hidden h-[34rem] w-[46rem] text-[#2A4639] lg:block" />
      <div className="relative grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-7">
          {learned.body.map((paragraph, index) => (
            <p key={paragraph} className={`mb-5 max-w-[58ch] leading-relaxed ${index === 0 ? 'text-2xl leading-snug' : 'text-lg text-[#C9D3CC]'}`}>{paragraph}</p>
          ))}
          <div className="my-10">
            <Callout dark>{learned.lesson}</Callout>
          </div>
          {learned.after.map((paragraph) => (
            <p key={paragraph} className="mb-5 max-w-[58ch] text-lg leading-relaxed text-[#C9D3CC]">{paragraph}</p>
          ))}
        </Reveal>
        <Reveal className="border-t border-[#3E5A4E] pt-8 lg:col-span-4 lg:col-start-9 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#D9A441]">{learned.closingLabel}</p>
          <p className={`${serif} m-0 text-3xl leading-snug md:text-4xl`}>
            {learned.closing.map((line) => <span key={line} className="block">{line}</span>)}
          </p>
        </Reveal>
      </div>
      <div className="relative">
        <PresentationActions contactLabel={learned.contactLabel} />
      </div>
    </Section>
  )
}

export default function BackwaterCaseStudy() {
  useEffect(() => {
    window.scrollTo(0, 0)
    const previous = document.title
    document.title = backwater.documentTitle
    return () => {
      document.title = previous
    }
  }, [])

  // The site-wide MotionConfig in App.tsx applies both the system setting and
  // the footer's Reduce motion toggle, so this page doesn't set its own.
  return (
    <PresentationThemeContext.Provider value={backwaterTheme}>
      <main className="min-h-[100dvh] bg-[#F4F1EA] font-type-body text-[#1F2A24] antialiased">
        <Opening />
        <Walkthrough />
        <Idea />
        <Structure />
        <Explore />
        <Beyond />
        <Release />
        <Trust />
        <Learned />
      </main>
    </PresentationThemeContext.Provider>
  )
}
