import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { MotionConfig, motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight } from '@phosphor-icons/react'
import '@fontsource-variable/newsreader'
import '@fontsource-variable/instrument-sans'
import { backwater, type BwPoint, type BwScreen, type Experience } from '@/data/backwater'
import PresentationActions from '@/components/presentation/PresentationActions'
import ZoomFigure from '@/components/presentation/ZoomFigure'
import { workLink, workState } from '@/components/presentation/PresentationOpening'
import { fadeUp } from '@/lib/motion'
import { backwaterTheme, PresentationThemeContext, type SectionTone } from '@/lib/presentationTheme'

const container = 'mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10'
const label = 'text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--pres-eyebrow)]'
const muted = 'text-[color:var(--pres-muted)]'
const serif = 'font-wove-display font-normal tracking-[-0.015em]'
const number = (index: number) => String(index + 1).padStart(2, '0')
const focus = `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${backwaterTheme.focusRing}`

// A short fade and lift as content enters the viewport; MotionConfig drops the
// movement for visitors who prefer reduced motion.
function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-8%' }} className={className}>
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

function ExternalLink({ href, children, className = '', ring = focus }: { href: string; children: ReactNode; className?: string; ring?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${className} ${ring}`}>
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
  kicker: string
  title: string
  tone: SectionTone
  intro?: string
  children: ReactNode
}

// A numbered chapter: a large brass numeral and the chapter name on the left,
// the kicker and editorial heading on the right, all over a fine rule.
function Section({ id, index, name, kicker, title, tone, intro, children }: SectionProps) {
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
            <p className={`${label} mb-4`}>{kicker}</p>
            <h2 id={`${id}-title`} className={`${backwaterTheme.heading} max-w-[22ch] text-4xl md:text-6xl`}>{title}</h2>
            {intro && <p className={`mb-0 mt-6 max-w-[62ch] text-lg leading-relaxed ${muted}`}>{intro}</p>}
          </div>
        </Reveal>
        {children}
      </div>
    </section>
  )
}

function NumberedPoints({ items, columns = 'md:grid-cols-2', dark = false }: { items: BwPoint[]; columns?: string; dark?: boolean }) {
  return (
    <ol className={`m-0 grid list-none grid-cols-1 gap-x-10 p-0 ${columns}`}>
      {items.map((item, index) => (
        <li key={item.title} className="border-t border-[color:var(--pres-border)] py-6">
          <Reveal className="grid grid-cols-[2.25rem_1fr] gap-3">
            <span aria-hidden="true" className={`pt-1 text-sm font-semibold ${dark ? 'text-[#D9A441]' : 'text-[#8A5E12]'}`}>{number(index)}</span>
            <div>
              <h3 className={`${serif} mb-2 text-2xl leading-tight`}>{item.title}</h3>
              <p className={`m-0 max-w-[52ch] leading-relaxed ${muted}`}>{item.body}</p>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
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
          <p className="mb-0 mt-6 max-w-[38ch] text-xl leading-relaxed md:text-2xl">{opening.lede}</p>
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
            <figcaption className={`${label} relative mt-6 text-[#5A665E]`}>{opening.caption}</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}

function Context() {
  const { context } = backwater
  return (
    <Section id="context" index={0} name={context.label} kicker={context.kicker} title={context.title} tone="base">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <Reveal>
            {context.body.map((paragraph, index) => (
              <p key={paragraph} className={`mb-5 max-w-[60ch] leading-relaxed ${index === 0 ? 'text-xl' : `text-lg ${muted}`}`}>{paragraph}</p>
            ))}
          </Reveal>
          <div className="mt-10">
            <NumberedPoints items={context.roles} columns="" />
          </div>
        </div>
        <Reveal className="lg:col-span-4 lg:col-start-9">
          <div className="bg-[#EAE5DA] p-6 md:p-8">
            <dl className="m-0 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {context.facts.map((item) => (
                <div key={item.label}>
                  <dt className={`${label} mb-1`}>{item.label}</dt>
                  <dd className="m-0 leading-snug">{item.value}</dd>
                </div>
              ))}
            </dl>
            <p className={`mb-0 mt-6 border-t border-[#DDD6C8] pt-4 text-sm ${muted}`}>{context.factsNote}</p>
          </div>
        </Reveal>
      </div>
      {/* The Explore before-and-after sits here, ahead of the structure, as the
          clearest example of a design decision changing after release. */}
      <ExploreComparison />
    </Section>
  )
}

function Structure() {
  const { structure } = backwater
  return (
    <Section id="structure" index={1} name={structure.label} kicker={structure.kicker} title={structure.title} intro={structure.intro} tone="alt">
      <Contours className="-right-[26rem] -top-56 hidden h-[34rem] w-[46rem] text-[#DCD4C5] lg:block" />
      <ol className="relative m-0 grid list-none grid-cols-1 p-0 md:grid-cols-2 lg:grid-cols-4">
        {structure.steps.map((step, index) => (
          <li key={step.name} className="relative border-l border-[#A87318]/50 pb-8 pl-7 last:pb-0 md:border-l-0 md:pb-10 md:pl-0 md:last:pb-10 lg:pb-0 lg:last:pb-0">
            <span aria-hidden="true" className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#A87318] md:hidden" />
            <Reveal className="md:h-full md:border-t md:border-[#A87318]/60 md:pr-6 md:pt-6">
              <p className="mb-3 text-sm font-semibold text-[#8A5E12]"><span className="sr-only">Step </span>{number(index)}</p>
              <h3 className={`${serif} mb-1 text-3xl`}>{step.name}</h3>
              <p className="mb-3 font-medium">{step.parts}</p>
              <p className={`m-0 max-w-[32ch] leading-relaxed ${muted}`}>{step.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>
      <Reveal className="relative mt-14 bg-[#F4F1EA] p-6 md:p-8">
        <h3 className={`${label} mb-2`}>{structure.navLabel}</h3>
        <p className="m-0 max-w-[72ch] text-lg leading-relaxed">{structure.nav}</p>
      </Reveal>
      <div className="relative mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-7">
          <h3 className={`${label} mb-2`}>{structure.recordsLabel}</h3>
          <dl className="m-0">
            {structure.records.map((record) => (
              <div key={record.title} className="grid grid-cols-1 gap-1 border-b border-[#DDD6C8] py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <dt className={`${serif} text-2xl`}>{record.title}</dt>
                <dd className={`m-0 leading-relaxed ${muted}`}>{record.body}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal className="lg:col-span-4 lg:col-start-9">
          <h3 className={`${label} mb-3`}>{structure.principleLabel}</h3>
          <p className={`${serif} m-0 text-2xl leading-snug md:text-3xl`}>{structure.principle}</p>
        </Reveal>
      </div>
    </Section>
  )
}

function ExperienceDetails({ experience }: { experience: Experience }) {
  const labels = backwater.experienceLabels
  const row = 'grid grid-cols-1 gap-2 border-t border-[color:var(--pres-border)] py-6 md:grid-cols-[11rem_1fr] md:gap-8'
  return (
    <dl className="m-0">
      <Reveal className={row}>
        <dt className={label}>{labels.task}</dt>
        <dd className="m-0 text-lg leading-relaxed">{experience.task}</dd>
      </Reveal>
      <Reveal className={row}>
        <dt className={label}>{labels.decision}</dt>
        <dd className="m-0 space-y-4">
          {experience.decision.map((paragraph) => <p key={paragraph} className="m-0 leading-relaxed">{paragraph}</p>)}
        </dd>
      </Reveal>
      <Reveal className={row}>
        <dt className={label}>{labels.evidence}</dt>
        <dd className="m-0">
          <ul className="m-0 list-none space-y-3 p-0">
            {experience.evidence.map((item) => (
              <li key={item} className={`relative pl-5 leading-relaxed ${muted}`}>
                <span aria-hidden="true" className="absolute left-0 top-[0.7em] h-px w-2.5 bg-[#A87318]" />
                {item}
              </li>
            ))}
          </ul>
        </dd>
      </Reveal>
      <Reveal className={row}>
        <dt className={label}>{labels.next}</dt>
        <dd className={`${serif} m-0 text-xl leading-snug`}>{experience.next}</dd>
      </Reveal>
    </dl>
  )
}

function ExperienceSection({ experience, index, tone, reverse, children }: { experience: Experience; index: number; tone: SectionTone; reverse: boolean; children?: ReactNode }) {
  const pair = experience.screens.length > 1
  return (
    <Section id={experience.id} index={index} name={experience.label} kicker={experience.kicker} title={experience.title} intro={experience.intro} tone={tone}>
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10">
        <div className={`relative lg:col-span-5 ${reverse ? 'lg:order-2 lg:col-start-8' : ''}`}>
          <Contours className={`inset-0 h-full w-full ${tone === 'alt' ? 'text-[#D8D0C0]' : 'text-[#E3DCCD]'}`} />
          <div className={`relative mx-auto grid items-start gap-4 sm:gap-8 ${pair ? 'max-w-[480px] grid-cols-2' : 'max-w-[300px] grid-cols-1 sm:max-w-[320px]'}`}>
            {experience.screens.map((screen, position) => (
              <ScreenFigure key={screen.label} screen={screen} className={pair && position === 1 ? 'mt-16' : ''} />
            ))}
          </div>
        </div>
        <div className={`lg:col-span-7 ${reverse ? 'lg:order-1' : 'lg:col-start-6 lg:pl-6'}`}>
          <ExperienceDetails experience={experience} />
          {experience.note && <Note>{experience.note}</Note>}
        </div>
      </div>
      {children}
    </Section>
  )
}

function ExploreComparison() {
  const comparison = backwater.exploreComparison
  return (
    <div className="mt-20 border-t border-[#DDD6C8] pt-12 md:mt-28">
      <Reveal>
        <p className={`${label} mb-3`}>{comparison.label}</p>
        <h3 className={`${backwaterTheme.heading} m-0 text-3xl md:text-4xl`}>{comparison.title}</h3>
      </Reveal>
      <div className="mt-10 grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="mx-auto grid w-full max-w-[560px] grid-cols-2 items-start gap-4 sm:gap-8 lg:col-span-6 lg:mx-0">
          <ScreenFigure screen={comparison.before} />
          <ScreenFigure screen={comparison.after} />
        </div>
        <div className="lg:col-span-6">
          <NumberedPoints items={comparison.changes} columns="" />
          <Reveal className="mt-8 bg-[#EAE5DA] p-6">
            <p className={`${label} mb-3`}>{comparison.reasonLabel}</p>
            <blockquote className="m-0">
              <p className={`${serif} m-0 text-xl leading-snug`}>{comparison.reason}</p>
            </blockquote>
            <p className={`mb-0 mt-3 text-sm ${muted}`}>{comparison.reasonSource}</p>
          </Reveal>
          <Note>{comparison.reading}</Note>
        </div>
      </div>
    </div>
  )
}

function MarketBoundary() {
  const { marketBoundary } = backwater
  return (
    <Reveal className="mt-14 bg-[#20382F] p-6 text-[#F4F1EA] md:p-8 lg:ml-[calc(41.666%+1rem)]">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#D9A441]">{marketBoundary.label}</p>
      <p className={`${serif} m-0 text-xl leading-snug md:text-2xl`}>{marketBoundary.body}</p>
    </Reveal>
  )
}

function Release({ index }: { index: number }) {
  const { release } = backwater
  return (
    <Section id="release" index={index} name={release.label} kicker={release.kicker} title={release.title} tone="accent">
      <Contours className="-bottom-72 -left-[28rem] hidden h-[36rem] w-[48rem] text-[#2A4639] md:block" />
      <ol className="relative m-0 grid list-none grid-cols-1 gap-10 p-0 md:grid-cols-2">
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
      <div className="relative mt-14">
        <NumberedPoints items={release.changes} dark />
      </div>
      <p className="relative mb-0 mt-8 text-sm text-[#F4F1EA]">{release.verified}</p>
      <p className="relative mb-0 mt-2 max-w-[80ch] text-sm leading-relaxed text-[#C9D3CC]">{release.note}</p>
    </Section>
  )
}

const swatchFill: Record<string, string> = {
  Paper: 'bg-[#F4F1EA]',
  Forest: 'bg-[#20382F]',
  Brass: 'bg-[#D9A441]',
  Ink: 'bg-[#1F2A24]',
}

function Visual({ index }: { index: number }) {
  const { visual } = backwater
  return (
    <Section id="visual" index={index} name={visual.label} kicker={visual.kicker} title={visual.title} tone="base">
      <Reveal>
        <h3 className={`${label} mb-4`}>{visual.paletteLabel}</h3>
        <ul className="m-0 grid list-none grid-cols-2 gap-5 p-0 md:grid-cols-4">
          {visual.swatches.map((swatch) => (
            <li key={swatch.name}>
              <span aria-hidden="true" className={`block h-20 border border-[#DDD6C8] md:h-24 ${swatchFill[swatch.name]}`} />
              <span className={`${serif} mt-3 block text-xl`}>{swatch.name}</span>
              <span className={`mt-1 block font-mono text-sm ${muted}`}>{swatch.hex}</span>
            </li>
          ))}
        </ul>
      </Reveal>
      <div className="mt-16 grid grid-cols-1 gap-12 border-t border-[#DDD6C8] pt-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-6">
          <p aria-hidden="true" className={`${serif} m-0 text-7xl leading-none text-[#20382F] md:text-8xl`}>Aa</p>
          <h3 className={`${serif} mb-4 mt-6 text-3xl md:text-4xl`}>{visual.typeTitle}</h3>
          <p className={`m-0 max-w-[52ch] text-lg leading-relaxed ${muted}`}>{visual.typeBody}</p>
        </Reveal>
        <Reveal className="space-y-10 lg:col-span-5 lg:col-start-8">
          <div>
            <h3 className={`${label} mb-3`}>{visual.inAppLabel}</h3>
            <p className="m-0 text-lg leading-relaxed">{visual.inApp}</p>
          </div>
          <div>
            <h3 className={`${label} mb-3`}>{visual.approachLabel}</h3>
            <p className="m-0 text-lg leading-relaxed">{visual.approach}</p>
          </div>
        </Reveal>
      </div>
      <Note>{visual.note}</Note>
    </Section>
  )
}

function Trust({ index }: { index: number }) {
  const { trust } = backwater
  return (
    <Section id="trust" index={index} name={trust.label} kicker={trust.kicker} title={trust.title} tone="alt">
      <NumberedPoints items={trust.items} />
      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <Reveal className="bg-[#F4F1EA] p-6 md:p-8 lg:col-span-7">
          <h3 className={`${label} mb-4`}>{trust.tasksLabel}</h3>
          <ol className="m-0 list-none space-y-4 p-0">
            {trust.tasks.map((task, position) => (
              <li key={task} className="grid grid-cols-[2rem_1fr] gap-2 text-lg leading-snug">
                <span aria-hidden="true" className="text-sm font-semibold leading-7 text-[#8A5E12]">{number(position)}</span>
                {task}
              </li>
            ))}
          </ol>
        </Reveal>
        <Reveal className="lg:col-span-4 lg:col-start-9">
          <h3 className={`${label} mb-3`}>{trust.checksLabel}</h3>
          <p className="m-0 text-lg leading-relaxed">{trust.checks}</p>
        </Reveal>
      </div>
      <Note>{trust.note}</Note>
    </Section>
  )
}

function Outcome({ index }: { index: number }) {
  const { outcome } = backwater
  return (
    <Section id="outcome" index={index} name={outcome.label} kicker={outcome.kicker} title={outcome.title} tone="accent">
      <Contours className="-right-[30rem] -top-48 hidden h-[34rem] w-[46rem] text-[#2A4639] lg:block" />
      <div className="relative grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-7">
          <p className="m-0 max-w-[42ch] text-2xl leading-snug">{outcome.delivered}</p>
          <p className="mb-0 mt-8 max-w-[58ch] text-lg leading-relaxed text-[#C9D3CC]">{outcome.next}</p>
          <p className={`${serif} mb-0 mt-12 text-3xl leading-snug md:text-4xl`}>
            {outcome.closing.map((line) => <span key={line} className="block">{line}</span>)}
          </p>
        </Reveal>
        <Reveal className="border-t border-[#3E5A4E] pt-8 lg:col-span-4 lg:col-start-9 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#D9A441]">{outcome.sourcesLabel}</h3>
          <ul className="m-0 list-none space-y-4 p-0">
            {outcome.sources.map((source) => (
              <li key={source.href}>
                <ExternalLink href={source.href} ring="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F1EA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#20382F]" className="inline-flex min-h-11 items-center gap-2 rounded font-semibold text-[#F4F1EA] underline decoration-[#D9A441] underline-offset-4 hover:decoration-2">
                  {source.label}
                </ExternalLink>
                <p className="m-0 text-sm text-[#C9D3CC]">{source.detail}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
      <div className="relative">
        <PresentationActions pdf={outcome.pdf} />
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

  const [dock, catchLogging, explore, species, market] = backwater.experiences
  return (
    <MotionConfig reducedMotion="user">
      <PresentationThemeContext.Provider value={backwaterTheme}>
        <main className="min-h-[100dvh] bg-[#F4F1EA] font-type-body text-[#1F2A24] antialiased">
          <Opening />
          <Context />
          <Structure />
          <ExperienceSection experience={dock} index={2} tone="base" reverse={false} />
          <ExperienceSection experience={catchLogging} index={3} tone="alt" reverse />
          <ExperienceSection experience={explore} index={4} tone="base" reverse={false} />
          <ExperienceSection experience={species} index={5} tone="alt" reverse />
          <ExperienceSection experience={market} index={6} tone="base" reverse={false}>
            <MarketBoundary />
          </ExperienceSection>
          <Release index={7} />
          <Visual index={8} />
          <Trust index={9} />
          <Outcome index={10} />
        </main>
      </PresentationThemeContext.Provider>
    </MotionConfig>
  )
}
