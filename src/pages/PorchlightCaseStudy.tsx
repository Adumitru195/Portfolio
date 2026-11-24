import { useEffect, useId, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, CheckCircle, ClipboardText, Eye, HourglassMedium, Question, Ruler, X } from '@phosphor-icons/react'
import '@fontsource-variable/fraunces'
import '@fontsource-variable/fraunces/wght-italic.css'
import '@fontsource-variable/instrument-sans'
import { porchlight } from '@/data/porchlight'
import PresentationActions from '@/components/presentation/PresentationActions'
import ZoomFigure from '@/components/presentation/ZoomFigure'
import DemoVideo from '@/components/presentation/DemoVideo'
import { workLink, workState } from '@/components/presentation/PresentationOpening'
import { fadeUp } from '@/lib/motion'
import { PresentationThemeContext, porchlightTheme, type SectionTone } from '@/lib/presentationTheme'
import { useReveal } from '@/hooks/useReveal'
import type { EvidenceKind, PorchPoint, PorchShot, PorchStat, ProblemSection } from '@/types/porchlight'

const container = 'mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10'
const eyebrow = 'text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--pres-eyebrow)]'
const muted = 'text-[color:var(--pres-muted)]'
const heading = porchlightTheme.heading
const focus = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1A5FB4] focus-visible:ring-offset-porch-cream'

// Scroll reveal that follows both reduced-motion settings and never leaves content hidden.
function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reveal = useReveal({ once: true, margin: '-8%' })
  return (
    <motion.div variants={fadeUp} {...reveal} className={className}>
      {children}
    </motion.div>
  )
}

// Short labels on the tags; the key in the opening spells out what each means.
const evidence: Record<EvidenceKind, { label: string; meaning: string; Icon: typeof Eye; className: string }> = {
  observed: { label: 'Observed', meaning: 'seen on a 2024 Arcadian Homes screen', Icon: Eye, className: 'bg-porch-brass-soft text-porch-brass-text' },
  research: { label: '2024 research', meaning: 'from my 2024 usability summary', Icon: ClipboardText, className: 'bg-porch-brass-soft text-porch-brass-text' },
  measured: { label: 'Measured', meaning: 'a measurement of the prototype’s interface', Icon: Ruler, className: 'bg-porch-green-soft text-porch-green-dark' },
  verified: { label: 'Verified', meaning: 'prototype behaviour or an automated technical check', Icon: CheckCircle, className: 'bg-porch-green-soft text-porch-green-dark' },
  hypothesis: { label: 'Needs testing', meaning: 'a hypothesis, not yet tested with renters', Icon: Question, className: 'bg-porch-pending-bg text-porch-pending' },
}

function EvidenceKey() {
  return (
    <div className="mt-6">
      <h2 className={`${eyebrow} mb-3 mt-0`}>How to read the evidence</h2>
      <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-3 p-0 text-sm">
        {(Object.keys(evidence) as EvidenceKind[]).map((kind) => (
          <li key={kind} className="flex items-center gap-2">
            <EvidenceTag kind={kind} />
            <span className={muted}>{evidence[kind].meaning}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function EvidenceTag({ kind }: { kind: EvidenceKind }) {
  const { label, Icon, className } = evidence[kind]
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 align-middle text-xs font-semibold ${className}`}>
      <Icon size={14} weight="bold" aria-hidden="true" />
      {label}
    </span>
  )
}

function Stat({ stat, size = 'lg' }: { stat: PorchStat; size?: 'lg' | 'md' }) {
  return (
    <div className="border-t border-[color:var(--pres-border)] pt-5">
      <p className={`m-0 font-porch-display font-semibold leading-none tracking-[-0.02em] text-porch-green ${size === 'lg' ? 'text-4xl md:text-5xl' : 'text-4xl md:text-5xl'}`}>
        {stat.value}
      </p>
      <p className="mb-0 mt-3 font-semibold leading-snug">{stat.label}</p>
      <p className={`mb-0 mt-1 text-sm leading-relaxed ${muted}`}>
        {stat.detail && <span className="mr-2">{stat.detail}</span>}
        <EvidenceTag kind={stat.kind} />
      </p>
    </div>
  )
}

function Shot({ shot, className = '' }: { shot: PorchShot; className?: string }) {
  return (
    <ZoomFigure
      image={shot.image}
      captionLabel={shot.label}
      caption={shot.caption}
      portrait={shot.portrait}
      className={`${shot.desktopOnly ? 'hidden md:block' : ''} ${className}`}
    />
  )
}

// Phones in a row: a swipeable strip below 768px, so each screen stays large
// enough to read, and a grid above it.
const gridCols = {
  1: 'md:grid-cols-[minmax(0,260px)]',
  2: 'md:grid-cols-[repeat(2,minmax(0,260px))]',
  3: 'md:grid-cols-[repeat(3,minmax(0,260px))]',
} as const

function ShotRow({ shots, columns, label, className = '', strip = false }: { shots: PorchShot[]; columns: 1 | 2 | 3; label: string; className?: string; strip?: boolean }) {
  const list = strip
    ? 'relative -mx-4 flex min-w-0 snap-x snap-mandatory list-none gap-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 md:mx-0 md:px-0'
    : `relative -mx-4 flex min-w-0 snap-x snap-mandatory list-none gap-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:overflow-visible md:p-0 ${gridCols[columns]} md:items-start md:gap-6`
  const item = strip ? 'w-[66%] max-w-[280px] md:w-[32%] md:max-w-[260px]' : 'w-[72%] max-w-[300px] md:w-auto md:max-w-none'
  return (
    <ul aria-label={label} className={`${list} ${className}`}>
      {shots.map((shot) => (
        <li key={shot.image.src} className={`${item} shrink-0 snap-start ${shot.desktopOnly ? 'hidden md:block' : ''}`}>
          <Shot shot={shot} />
        </li>
      ))}
    </ul>
  )
}

function Section({ id, tone, index, label, title, intro, aside, children }: { id: string; tone: SectionTone; index: string; label: string; title: string; intro?: string; aside?: ReactNode; children: ReactNode }) {
  const header = (
    <Reveal className="max-w-[68ch]">
          <p className={`mb-4 flex items-center gap-3 ${eyebrow}`}>
            <span aria-hidden="true" className="block h-px w-8 bg-current" />
            <span>
              <span className="sr-only">Section </span>
              {index} · {label}
            </span>
          </p>
          <h2 id={`${id}-title`} className={`${heading} m-0 text-3xl md:text-5xl`}>{title}</h2>
          {intro && <p className={`mb-0 mt-5 text-lg leading-relaxed ${muted}`}>{intro}</p>}
    </Reveal>
  )
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`${porchlightTheme.tones[tone]} py-10 md:py-20`}>
      <div className={container}>
        {aside ? (
          <div className="mb-8 grid grid-cols-1 gap-8 md:mb-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">{header}</div>
            <div className="min-w-0 lg:col-span-6">{aside}</div>
          </div>
        ) : (
          <div className="mb-8 md:mb-12">{header}</div>
        )}
        {children}
      </div>
    </section>
  )
}

function Points({ items }: { items: PorchPoint[] }) {
  return (
    <ul className="m-0 list-none space-y-4 p-0">
      {items.map((item) => (
        <li key={item.text} className="border-l-2 border-porch-brass pl-4 leading-relaxed">
          {item.text} <EvidenceTag kind={item.kind} />
        </li>
      ))}
    </ul>
  )
}

function Panel({ kind, heading: title, children, className = '' }: { kind: 'before' | 'after'; heading: string; children: ReactNode; className?: string }) {
  const before = kind === 'before'
  return (
    <div className={`min-w-0 rounded-2xl p-4 sm:p-6 ${before ? 'bg-porch-sunken' : 'border border-porch-border bg-white'} ${className}`}>
      <p className="mb-5 mt-0 flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] ${before ? porchlightTheme.labelBefore : porchlightTheme.labelAfter}`}>
          {before ? 'Before' : 'After'}
        </span>
        <span className="text-sm font-semibold">{title}</span>
      </p>
      {children}
    </div>
  )
}

function StatsRow({ stats }: { stats: PorchStat[] }) {
  return (
    <Reveal className="grid grid-cols-2 gap-x-5 gap-y-6">
      {stats.map((stat) => <Stat key={stat.label} stat={stat} />)}
    </Reveal>
  )
}

const span = { 4: 'lg:col-span-4', 5: 'lg:col-span-5', 6: 'lg:col-span-6', 7: 'lg:col-span-7', 8: 'lg:col-span-8' } as const

// Before panel: the original screens and what goes wrong on them. After panel:
// the redesigned screens and the decisions behind them.
function Comparison({ section, extraAfter = [], split }: { section: ProblemSection; extraAfter?: PorchShot[]; split: [keyof typeof span, keyof typeof span] }) {
  const after = [...section.after.shots, ...extraAfter]
  const cols = (n: number) => (n >= 3 ? 3 : n === 2 ? 2 : 1) as 1 | 2 | 3
  const combined = [
    ...section.before.shots.map((shot) => ({ ...shot, label: `Before · ${shot.label}` })),
    ...after.filter((shot) => !shot.desktopOnly).map((shot) => ({ ...shot, label: `After · ${shot.label}` })),
  ]
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
      <ShotRow shots={combined} columns={3} strip label="Before and after, swipe to compare" className="md:col-span-2 lg:hidden" />
      <Panel kind="before" heading={section.before.heading} className={span[split[0]]}>
        {/* Wrapped: the row's own md:grid would otherwise override max-lg:hidden. */}
        <div className="max-lg:hidden">
          <ShotRow shots={section.before.shots} columns={cols(section.before.shots.length)} label={`Before: ${section.before.heading}`} />
        </div>
        <h3 className={`${heading} mb-4 mt-0 text-xl lg:mt-6`}>The problem</h3>
        <Points items={section.problems} />
      </Panel>
      <Panel kind="after" heading={section.after.heading} className={span[split[1]]}>
        <div className="max-lg:hidden">
          <ShotRow shots={after} columns={cols(after.length)} label={`After: ${section.after.heading}`} />
        </div>
        <h3 className={`${heading} mb-4 mt-0 text-xl lg:mt-6`}>The redesign</h3>
        <ol className="m-0 list-none space-y-3 p-0">
          {section.decisions.map((decision, i) => (
            <li key={decision} className="grid grid-cols-[1.75rem_1fr] gap-2 leading-relaxed">
              <span aria-hidden="true" className="font-porch-display text-xl italic leading-tight text-porch-brass-text">{i + 1}</span>
              {decision}
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  )
}

function Validate({ items }: { items: string[] }) {
  return (
    <Reveal className="mt-6 flex flex-col gap-3 rounded-2xl border border-porch-pending-border bg-porch-pending-bg p-5 text-porch-charcoal sm:flex-row sm:items-center sm:gap-5">
      <EvidenceTag kind="hypothesis" />
      <p className="m-0 leading-relaxed">
        <span className="font-semibold">Still to validate with renters: </span>
        {items.join(' ')}
      </p>
    </Reveal>
  )
}

function Opening() {
  const { opening } = porchlight
  return (
    <section aria-labelledby="presentation-title" className={porchlightTheme.tones.base}>
      <nav aria-label="Case study" className={`${container} pt-6`}>
        <Link to={workLink} state={workState} className={`inline-flex min-h-11 items-center gap-2 rounded text-sm font-medium text-porch-green hover:underline ${focus}`}>
          <ArrowLeft size={16} aria-hidden="true" />
          Back to Work
        </Link>
      </nav>
      <div className={`${container} pb-14 pt-8 md:pb-20 md:pt-14`}>
        <Reveal className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className={`mb-5 flex items-center gap-3 ${eyebrow}`}>
              <span aria-hidden="true" className="block h-px w-8 bg-current" />
              {opening.eyebrow}
            </p>
            <h1 id="presentation-title" className={`m-0 ${porchlightTheme.title}`}>Porchlight</h1>
            <p className={`mb-0 mt-5 max-w-[34ch] ${porchlightTheme.subtitle}`}>{opening.subtitle}</p>
            <p className="mb-0 mt-6 max-w-[56ch] text-lg leading-relaxed">{opening.lede}</p>
          </div>
          <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[color:var(--pres-border)] pt-6 lg:col-span-5">
            {opening.meta.map((item, i) => (
              <div key={item.label} className={i === 0 ? 'col-span-2' : undefined}>
                <dt className={`mb-1 text-xs font-semibold uppercase tracking-[0.12em] ${muted}`}>{item.label}</dt>
                <dd className="m-0 font-medium leading-snug">{item.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="mt-12 md:mt-16">
          <h2 className={`${eyebrow} mb-5 mt-0`}>{opening.summaryLabel}</h2>
          <ol className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3 md:gap-6">
            {opening.summary.map((item, i) => (
              <li key={item.problem}>
                <a
                  href={`#${['costs', 'discovery', 'tours'][i]}`}
                  onClick={(event) => {
                    // Hash routing: scroll in place rather than changing the route.
                    event.preventDefault()
                    document.getElementById(['costs', 'discovery', 'tours'][i])?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className={`group grid h-full grid-cols-[auto_1fr] gap-x-4 rounded-2xl border border-porch-border bg-white p-5 transition-colors hover:border-porch-green md:flex md:flex-col md:p-6 ${focus}`}
                >
                  <span className="row-span-4 min-w-[4.5rem] font-porch-display text-4xl font-semibold leading-none tracking-[-0.02em] text-porch-green md:order-3 md:mt-auto">{item.stat.value}</span>
                  <span className={`${eyebrow} mb-1 md:order-1 md:mb-2`}>0{i + 2} · {item.problem}</span>
                  <span className="leading-snug md:order-2 md:mb-5">{item.change}</span>
                  <span className={`mt-1 text-sm leading-snug md:order-4 md:mt-2 ${muted}`}>{item.stat.label}</span>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-porch-green md:order-5 md:mt-4">
                    See the redesign
                    <ArrowRight size={14} aria-hidden="true" className="transition-transform motion-safe:group-hover:translate-x-0.5" />
                  </span>
                </a>
              </li>
            ))}
          </ol>
          <p className={`mb-0 mt-5 text-sm ${muted}`}>{opening.dataNote}</p>
          <EvidenceKey />
        </Reveal>
      </div>
    </section>
  )
}

function Walkthrough() {
  const { walkthrough } = porchlight
  const titleId = useId()
  return (
    <section aria-labelledby={titleId} className={`${porchlightTheme.tones.alt} py-16 md:py-24`}>
      <div className={`${container} grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-14`}>
        <Reveal className="max-w-[60ch] lg:col-span-4">
          <p className={`mb-3 mt-0 ${eyebrow}`}>{walkthrough.eyebrow}</p>
          <h2 id={titleId} className={`${heading} mb-5 mt-0 text-3xl md:text-4xl`}>{walkthrough.title}</h2>
          <p className={`m-0 leading-relaxed ${muted}`}>{walkthrough.body}</p>
        </Reveal>
        <div className="lg:col-span-8">
          <DemoVideo video={walkthrough.video} descriptionSummary={walkthrough.descriptionSummary} />
        </div>
      </div>
    </section>
  )
}

function Origin() {
  const { origin } = porchlight
  return (
    <Section id="origin" tone="base" index="01" label="Where the project started" title={origin.title}>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-6">
          {origin.body.map((paragraph, i) => (
            <p key={paragraph} className={`mb-5 mt-0 leading-relaxed ${i === 0 ? 'text-lg' : muted}`}>{paragraph}</p>
          ))}
          <div className="mt-8 rounded-2xl border border-porch-border bg-white p-6">
            <h3 className="mb-4 mt-0 text-base font-semibold">{origin.research.title}</h3>
            <ol className="m-0 list-decimal space-y-2 pl-5 leading-relaxed">
              {origin.research.points.map((point) => <li key={point}>{point}</li>)}
            </ol>
            <p className={`mb-4 mt-5 text-sm leading-relaxed ${muted}`}>{origin.research.attribution}</p>
            <EvidenceTag kind="research" />
          </div>
          <div className="mt-8">
            <Stat stat={origin.stat} size="md" />
          </div>
        </Reveal>
        <div className="lg:col-span-6">
          <Shot shot={origin.cover} />
        </div>
      </div>
    </Section>
  )
}

function Costs() {
  const { costs } = porchlight
  return (
    <Section id={costs.id} tone="alt" index={costs.index} label={costs.label} title={costs.title} intro={costs.intro} aside={<StatsRow stats={costs.stats} />}>
      <Comparison section={costs} extraAfter={[costs.breakdown]} split={[6, 6]} />
      <Validate items={costs.validate} />
    </Section>
  )
}

function Discovery() {
  const { discovery } = porchlight
  return (
    <Section id={discovery.id} tone="base" index={discovery.index} label={discovery.label} title={discovery.title} intro={discovery.intro} aside={<StatsRow stats={discovery.stats} />}>
      <Comparison section={discovery} split={[4, 8]} />
      <Validate items={discovery.validate} />
    </Section>
  )
}

function Tours() {
  const { tours } = porchlight
  return (
    <Section id={tours.id} tone="alt" index={tours.index} label={tours.label} title={tours.title} intro={tours.intro} aside={<StatsRow stats={tours.stats} />}>
      <Comparison section={tours} split={[5, 7]} />
      <Reveal className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <Shot shot={tours.disclosure} className="max-w-[400px] lg:col-span-4" />
        <div className="rounded-2xl border border-porch-border bg-porch-cream p-6 lg:col-span-8">
          <h3 className="mb-5 mt-0 font-porch-display text-xl font-semibold">{tours.status.title}</h3>
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div>
              <p className="mb-3 mt-0 text-xs font-semibold uppercase tracking-[0.12em] text-porch-green">{tours.status.shown.label}</p>
              <ul className="m-0 list-none space-y-2 p-0">
                {tours.status.shown.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 leading-snug">
                    {item === 'Pending confirmation' ? (
                      <HourglassMedium size={16} weight="bold" aria-hidden="true" className="mt-0.5 shrink-0 text-porch-pending" />
                    ) : (
                      <Check size={16} weight="bold" aria-hidden="true" className="mt-0.5 shrink-0 text-porch-green" />
                    )}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 mt-0 text-xs font-semibold uppercase tracking-[0.12em] text-[#A13127]">{tours.status.avoided.label}</p>
              <ul className="m-0 list-none space-y-2 p-0">
                {tours.status.avoided.items.map((item) => (
                  <li key={item} className={`flex items-start gap-2 leading-snug ${muted}`}>
                    <X size={16} weight="bold" aria-hidden="true" className="mt-0.5 shrink-0 text-[#A13127]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>
      <Validate items={tours.validate} />
    </Section>
  )
}

function Process() {
  const { process } = porchlight
  return (
    <Section id="process" tone="base" index="05" label="Supporting process" title={process.title} intro={process.intro}>
      <h3 className={`${eyebrow} mb-5 mt-0`}>Wireframes</h3>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {process.wireframes.shots.map((shot) => <Shot key={shot.image.src} shot={shot} />)}
      </div>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
        <a
          href={process.wireframes.board.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex min-h-11 w-fit items-center gap-2 rounded-[10px] border border-porch-control bg-white px-4 py-2 text-sm font-semibold transition-colors hover:border-porch-green hover:text-porch-green ${focus}`}
        >
          {process.wireframes.board.label}
          <ArrowUpRight size={14} aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        <span className={`text-sm ${muted}`}>{process.wireframes.note}</span>
      </div>

      <Reveal className="mt-12">
        <h3 className={`${eyebrow} mb-5 mt-0`}>Visual system</h3>
        <div className="grid grid-cols-1 gap-6 rounded-2xl border border-porch-border bg-white p-6 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.12em] text-porch-brass-text">{process.identity.fonts[0].name}</p>
            <p className={`mb-2 mt-1 text-sm ${muted}`}>{process.identity.fonts[0].role}</p>
            <p className="m-0 font-porch-display text-3xl font-semibold leading-tight">
              Find your <span className="font-medium italic text-porch-green">next home.</span>
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.12em] text-porch-brass-text">{process.identity.fonts[1].name}</p>
            <p className={`mb-2 mt-1 text-sm ${muted}`}>{process.identity.fonts[1].role}</p>
            <p className="m-0 text-lg">2 beds · 1 bath · ~1,080 sq ft</p>
          </div>
          <ul className="m-0 grid list-none grid-cols-4 gap-3 p-0 md:col-span-5">
            {process.identity.swatches.map((swatch) => (
              <li key={swatch.hex} className="min-w-0">
                <span aria-hidden="true" className="mb-2 block h-10 rounded-md border border-porch-border" style={{ backgroundColor: swatch.hex }} />
                <span className="block text-sm font-semibold leading-tight">{swatch.name}</span>
                <span className={`block font-mono text-xs ${muted}`}>{swatch.hex}</span>
                <span className={`block text-xs leading-tight ${muted}`}>{swatch.usage}</span>
              </li>
            ))}
          </ul>
          <p className={`m-0 text-sm leading-relaxed md:col-span-12 ${muted}`}>{process.identity.note}</p>
        </div>
      </Reveal>
    </Section>
  )
}

function Quality() {
  const { quality } = porchlight
  return (
    <Section id="quality" tone="alt" index="06" label="Responsive design and accessibility" title={quality.title} intro={quality.intro}>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-4">
          <ShotRow shots={quality.phones} columns={2} label="Phone layouts" />
        </div>
        <Reveal className="lg:col-span-8">
          <dl className="m-0 grid grid-cols-2 gap-x-5 sm:gap-x-8">
            {quality.checks.map((check) => (
              <div key={check.label} className="border-t border-porch-border py-4">
                <dt className="font-porch-display text-2xl font-semibold leading-none tracking-[-0.02em] text-porch-green sm:text-3xl">{check.value}</dt>
                <dd className="m-0">
                  <span className="mt-2 block font-semibold leading-snug">{check.label}</span>
                  <span className={`mb-2 mt-1 block text-sm leading-snug ${muted}`}>{check.detail}</span>
                  <EvidenceTag kind={check.kind} />
                </dd>
              </div>
            ))}
            <div className="border-t border-porch-border py-4">
              <dt className="flex items-center gap-2 font-semibold">
                <Question size={18} weight="bold" aria-hidden="true" className="text-porch-pending" />
                {quality.notDone.title}
              </dt>
              <dd className="m-0">
                <ul className={`m-0 mt-2 list-disc space-y-1 pl-5 text-sm leading-snug ${muted}`}>
                  {quality.notDone.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </dd>
            </div>
          </dl>
          <p className={`mb-0 mt-6 max-w-[68ch] text-sm leading-relaxed ${muted}`}>{quality.attribution}</p>
        </Reveal>
      </div>
    </Section>
  )
}

function Reflection() {
  const { reflection } = porchlight
  return (
    <Section id="reflection" tone="accent" index="07" label="Reflection and next steps" title={reflection.title}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-6">
          <ol className="m-0 list-none p-0">
            {reflection.accomplished.map((item, i) => (
              <li key={item.title} className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-porch-cream/25 py-5">
                <span aria-hidden="true" className="font-porch-display text-3xl italic leading-none text-porch-brass-soft">{i + 1}</span>
                <div>
                  <h3 className="mb-1 mt-0 font-porch-display text-xl font-semibold">{item.title}</h3>
                  <p className="m-0 leading-relaxed text-porch-cream/85">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mb-0 mt-6 border-l-2 border-porch-brass pl-4 font-porch-display text-xl leading-snug">{reflection.learned}</p>
        </Reveal>
        <Reveal className="lg:col-span-6">
          <h3 className="mb-3 mt-0 font-porch-display text-2xl font-semibold">{reflection.next.title}</h3>
          <p className="mb-4 mt-0 leading-relaxed text-porch-cream/85">{reflection.next.intro}</p>
          <ol className="m-0 list-decimal space-y-2 pl-5 leading-relaxed">
            {reflection.next.questions.map((question) => <li key={question}>{question}</li>)}
          </ol>
          <PresentationActions contactLabel={reflection.contactLabel} />
        </Reveal>
      </div>
    </Section>
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
    <PresentationThemeContext.Provider value={porchlightTheme}>
      <div className="font-porch-body text-porch-charcoal antialiased">
        <main>
          <Opening />
          <Walkthrough />
          <Origin />
          <Costs />
          <Discovery />
          <Tours />
          <Process />
          <Quality />
          <Reflection />
        </main>
      </div>
    </PresentationThemeContext.Provider>
  )
}
