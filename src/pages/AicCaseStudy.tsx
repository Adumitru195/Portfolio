import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle,
  CircleHalf,
  Info,
  Lightbulb,
  PencilRuler,
  Question,
  Scissors,
  WarningCircle,
  type Icon,
} from '@phosphor-icons/react'
import '@fontsource-variable/newsreader'
import '@fontsource-variable/instrument-sans'
import { aic, supportLabels } from '@/data/aic'
import type { Artwork, ConceptVisual, JourneyStage, SupportLevel } from '@/types/aic'
import Wireframe from '@/components/aic/Wireframe'
import { workLink, workState } from '@/components/presentation/PresentationOpening'
import { useReveal } from '@/hooks/useReveal'
import { fadeUp } from '@/lib/motion'

/* Tokens ---------------------------------------------------------------- */

// Warm paper, stone, burgundy and gallery ink. Each room sets its own text,
// muted, accent and rule colours; every pairing meets WCAG AA for its size.
type Tone = 'paper' | 'stone' | 'wine' | 'ink'

const tones: Record<Tone, string> = {
  paper: 'bg-[#F6F2EB] text-[#27231F] [--m:#5E574E] [--a:#842C3B] [--r:#DCD2C4]',
  stone: 'bg-[#E9E0D4] text-[#27231F] [--m:#574F47] [--a:#7A2836] [--r:#CFC2B1]',
  wine: 'bg-[#4A2230] text-[#F6F2EB] [--m:#E3D3D2] [--a:#F0C9CE] [--r:#734756]',
  ink: 'bg-[#27231F] text-[#F6F2EB] [--m:#D6CEC3] [--a:#EBC9CD] [--r:#4A433C]',
}

const container = 'mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10'
const serif = 'font-wove-display font-normal'
const label = 'text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--a)]'
const muted = 'text-[color:var(--m)]'
const rule = 'border-[color:var(--r)]'
const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--a)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'

const levelIcons: Record<SupportLevel, Icon> = {
  response: CheckCircle,
  hypothesis: Lightbulb,
  partial: CircleHalf,
  gap: WarningCircle,
  speculative: Question,
}

/* Building blocks ------------------------------------------------------- */

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reveal = useReveal({ once: true, margin: '0px 0px -8% 0px' })
  return (
    <motion.div variants={fadeUp} {...reveal} className={className}>
      {children}
    </motion.div>
  )
}

// The architectural motif: a thin round-headed arch, echoing the museum's
// galleries. Purely decorative.
function Arch({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 300" preserveAspectRatio="none" fill="none" className={`pointer-events-none ${className}`}>
      <path d="M1 300V100a99 99 0 0 1 198 0v200" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

interface RoomProps {
  id: string
  index: number
  name: string
  title: string
  tone: Tone
  intro?: string
  children: ReactNode
}

/** A numbered gallery room: the number in an arch, the room name, and a large heading. */
function Room({ id, index, name, title, tone, intro, children }: RoomProps) {
  const n = String(index).padStart(2, '0')
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`${tones[tone]} py-16 md:py-24`}>
      <div className={container}>
        <Reveal className={`mb-10 grid grid-cols-1 gap-6 border-t ${rule} pt-8 md:mb-14 lg:grid-cols-12 lg:gap-10`}>
          <div className="flex items-end gap-4 lg:col-span-3 lg:self-start">
            <span aria-hidden="true" className="relative inline-flex h-16 w-12 shrink-0 items-end justify-center text-[color:var(--a)]">
              <Arch className="absolute inset-0 h-full w-full" />
              <span className={`${serif} relative pb-2 text-xl`}>{n}</span>
            </span>
            <p className={`m-0 pb-2 text-sm ${muted}`}>
              <span className="sr-only">Room {n}: </span>
              {name}
            </p>
          </div>
          <div className="lg:col-span-9">
            <h2 id={`${id}-title`} className={`${serif} m-0 max-w-[24ch] text-4xl leading-[1.06] tracking-[-0.02em] md:text-6xl`}>
              {title}
            </h2>
            {intro && <p className={`m-0 mt-6 max-w-[62ch] text-lg leading-relaxed ${muted}`}>{intro}</p>}
          </div>
        </Reveal>
        {children}
      </div>
    </section>
  )
}

/** A museum wall label for public-domain presentation artwork. */
function WallLabel({ artwork, className = '' }: { artwork: Artwork; className?: string }) {
  return (
    <div className={`max-w-[26rem] border-l-2 border-[color:var(--a)] pl-4 text-sm leading-snug ${className}`}>
      <p className="m-0 font-semibold">{artwork.artist}</p>
      <p className={`${serif} m-0 mt-1 text-lg italic leading-snug`}>
        {artwork.title}, {artwork.date}
      </p>
      <p className={`m-0 mt-1 ${muted}`}>
        {artwork.medium}. Art Institute of Chicago, {artwork.credit}, {artwork.reference}.
      </p>
      <p className={`m-0 mt-2 ${muted}`}>
        Public domain (CC0).{' '}
        <a href={artwork.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1 underline underline-offset-4 ${focusRing}`}>
          Collection record
          <ArrowUpRight size={14} aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </p>
    </div>
  )
}

/** A painting hung on the wall: a thin dark frame and a soft, warm shadow. */
function Painting({ artwork, sizes, eager = false }: { artwork: Artwork; sizes: string; eager?: boolean }) {
  return (
    <div className="border-[6px] border-[#2B2420] bg-[#2B2420] shadow-[0_34px_60px_-30px_rgba(74,34,48,0.55)]">
      <img
        src={artwork.src.md}
        srcSet={`${artwork.src.sm} 640w, ${artwork.src.md} 1100w, ${artwork.src.lg} 1686w`}
        sizes={sizes}
        width={artwork.width}
        height={artwork.height}
        alt={artwork.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="block h-auto w-full"
      />
    </div>
  )
}

function LevelTag({ level, className = '' }: { level: SupportLevel; className?: string }) {
  const Icon = levelIcons[level]
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-[color:var(--a)] ${className}`}>
      <Icon size={16} weight={level === 'response' ? 'fill' : 'regular'} aria-hidden="true" className="shrink-0" />
      {supportLabels[level].label}
    </span>
  )
}

/* Opening --------------------------------------------------------------- */

function Opening() {
  const { opening } = aic
  return (
    <section aria-labelledby="aic-title" className={`${tones.paper} relative overflow-hidden`}>
      <div className={`${container} pt-6`}>
        <Link to={workLink} state={workState} className={`inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[color:var(--a)] hover:underline ${focusRing}`}>
          <ArrowLeft size={16} aria-hidden="true" />
          Back to work
        </Link>
      </div>
      <div className={`${container} grid grid-cols-1 gap-12 pb-16 pt-8 md:pb-24 lg:grid-cols-12 lg:gap-12`}>
        <Reveal className="flex flex-col lg:col-span-7">
          <p className={`${label} mb-8 flex items-center gap-3`}>
            <span aria-hidden="true" className="block h-px w-10 bg-current" />
            {opening.eyebrow}
          </p>
          <h1 id="aic-title" className={`${serif} m-0 text-[clamp(3.4rem,10vw,7.25rem)] leading-[0.92] tracking-[-0.03em]`}>
            <span className="block">{opening.titleLines[0]}</span>
            <span className="block italic text-[color:var(--a)]">{opening.titleLines[1]}</span>
            <span className="sr-only"> — {opening.project}</span>
          </h1>
          <p className={`${serif} m-0 mt-6 text-2xl md:text-3xl`} aria-hidden="true">
            {opening.project}
          </p>
          <p className={`m-0 mt-5 max-w-[48ch] text-lg leading-relaxed ${muted}`}>{opening.lede}</p>
          <dl className={`m-0 mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t ${rule} pt-6 sm:grid-cols-3`}>
            {opening.meta.map((item) => (
              <div key={item.label}>
                <dt className={`text-xs font-semibold uppercase tracking-[0.12em] ${muted}`}>{item.label}</dt>
                <dd className="m-0 mt-1 text-sm font-medium">{item.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="lg:col-span-5 lg:pt-10">
          <figure className="m-0">
            <div className="relative bg-[#E9E0D4] p-5 sm:p-10">
              <Arch className="absolute inset-x-6 top-3 h-[calc(100%-1.5rem)] w-[calc(100%-3rem)] text-[#C7B9A6]" />
              <div className="relative">
                <Painting artwork={opening.artwork} sizes="(min-width: 1024px) 480px, 92vw" eager />
              </div>
            </div>
            <figcaption className="mt-5">
              <WallLabel artwork={opening.artwork} />
            </figcaption>
          </figure>
        </Reveal>

        <Reveal className="lg:col-span-12">
          <Contributions />
        </Reveal>

        <Reveal className="lg:col-span-12">
          <p className={`m-0 flex max-w-[90ch] gap-3 border-t ${rule} pt-5 text-sm leading-relaxed ${muted}`}>
            <Info size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-[color:var(--a)]" />
            {opening.disclaimer}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/** Team work and Andrew's individual contributions, side by side. */
function Contributions() {
  const { contributions } = aic
  const columns = [
    { ...contributions.team, accent: false },
    { ...contributions.andrew, accent: true },
  ]
  return (
    <section aria-labelledby="contributions-title" className={`border-t ${rule} pt-6`}>
      <h2 id="contributions-title" className={`${label} m-0 mb-5`}>
        {contributions.title}
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {columns.map((column) => (
          <div key={column.label} className={column.accent ? 'border-l-2 border-[color:var(--a)] bg-white/60 p-5' : `border-l-2 ${rule} p-5`}>
            <h3 className={`${serif} m-0 text-2xl`}>{column.label}</h3>
            <ul className="m-0 mt-3 list-none space-y-2 p-0 leading-snug">
              {column.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="text-[color:var(--a)]">–</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className={`m-0 mt-3 text-sm ${muted}`}>{contributions.note}</p>
    </section>
  )
}

/* 01 The question -------------------------------------------------------- */

function TheQuestion() {
  const { question } = aic
  return (
    <Room id="question" index={1} name={question.room} title={question.title} tone="paper" intro={question.body}>
      <Reveal>
        <h3 className={`${label} m-0 mb-4`}>{question.focusLabel}</h3>
        <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {question.focus.map((item, i) => (
            <li key={item} className={`flex items-baseline gap-3 border-t ${rule} pt-4 text-lg leading-snug`}>
              <span aria-hidden="true" className={`${serif} text-sm text-[color:var(--a)]`}>
                {String.fromCharCode(97 + i)}.
              </span>
              {item}
            </li>
          ))}
        </ul>
      </Reveal>
    </Room>
  )
}

/* 02 Listening ----------------------------------------------------------- */

/** Who was interviewed (18–25) against the audience proposed later (16–25), on one age scale. */
function AgeScale() {
  const min = 15
  const max = 26
  const pct = (age: number) => `${((age - min) / (max - min)) * 100}%`
  const ranges = [
    { name: 'People interviewed', from: 18, to: 25, solid: true },
    { name: 'Proposed product audience', from: 16, to: 25, solid: false },
  ]
  return (
    <figure className="m-0">
      <figcaption className={`${label} mb-5`}>Interviewed versus intended</figcaption>
      <div className="space-y-5">
        {ranges.map((range) => (
          <div key={range.name}>
            <p className="m-0 mb-2 flex justify-between gap-4 text-sm">
              <span className="font-semibold">{range.name}</span>
              <span className={muted}>
                Ages {range.from}–{range.to}
              </span>
            </p>
            <div aria-hidden="true" className="relative h-3 rounded-full bg-[#DCD0BF]">
              <span
                className={`absolute inset-y-0 rounded-full ${range.solid ? 'bg-[#7A2836]' : 'border-2 border-dashed border-[#7A2836] bg-transparent'}`}
                style={{ left: pct(range.from), width: `calc(${pct(range.to)} - ${pct(range.from)})` }}
              />
            </div>
          </div>
        ))}
        <div aria-hidden="true" className={`relative h-4 text-xs ${muted}`}>
          {[16, 18, 25].map((age) => (
            <span key={age} className="absolute -translate-x-1/2" style={{ left: pct(age) }}>
              {age}
            </span>
          ))}
        </div>
      </div>
    </figure>
  )
}

function Listening() {
  const { listening } = aic
  return (
    <Room id="listening" index={2} name={listening.room} title={listening.title} tone="stone">
      <Reveal>
        <dl className="m-0 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {listening.stats.map((stat) => (
            <div key={stat.label} className={`flex flex-col border-t ${rule} pt-5`}>
              <dt className={`order-2 m-0 mt-2 text-base ${muted}`}>{stat.label}</dt>
              <dd className={`${serif} m-0 text-6xl leading-none tracking-[-0.02em] text-[color:var(--a)] md:text-7xl`}>{stat.value}</dd>
            </div>
          ))}
        </dl>
        <p className={`m-0 mt-4 text-sm ${muted}`}>As documented in the team’s research presentation.</p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-6">
          <p className="m-0 text-lg leading-relaxed">{listening.sample}</p>
          <p className={`m-0 mt-6 flex gap-3 bg-[#F6F2EB] p-5 text-sm leading-relaxed text-[#3F3933]`}>
            <Info size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-[#7A2836]" />
            {listening.sourceNote}
          </p>
        </Reveal>
        <Reveal className="lg:col-span-6">
          <AgeScale />
          <p className={`m-0 mt-5 text-sm leading-relaxed ${muted}`}>{listening.audienceNote}</p>
        </Reveal>
      </div>

      <Reveal className={`mt-16 border-t ${rule} pt-10`}>
        <p className={`${serif} m-0 max-w-[30ch] text-3xl leading-[1.2] tracking-[-0.01em] md:text-5xl`}>{listening.theme}</p>
        <p className={`m-0 mt-4 text-sm ${muted}`}>{listening.themeNote}</p>
      </Reveal>
    </Room>
  )
}

/* 03 What we heard ------------------------------------------------------- */

function Findings() {
  const { findings } = aic
  return (
    <Room id="findings" index={3} name={findings.room} title={findings.title} tone="paper" intro={findings.intro}>
      <ol className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {findings.items.map((item, i) => (
          <li key={item.title}>
            <Reveal className={`h-full border-t-2 border-[color:var(--a)] bg-white/60 p-6 shadow-[0_18px_36px_-30px_rgba(74,34,48,0.45)]`}>
              <p className={`${label} m-0`}>Finding {String(i + 1).padStart(2, '0')}</p>
              <h3 className={`${serif} m-0 mt-3 text-2xl leading-tight`}>{item.title}</h3>
              <p className={`m-0 mt-3 leading-relaxed ${muted}`}>{item.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>
      <Reveal>
        <p className={`m-0 mt-8 text-sm ${muted}`}>{findings.note}</p>
      </Reveal>
    </Room>
  )
}

/* 04 The visit, mapped ---------------------------------------------------- */

/** The qualitative line through the five stages: two levels, no scores. */
function JourneyLine({ stages }: { stages: JourneyStage[] }) {
  const step = 100 / stages.length
  const y = (stage: JourneyStage) => (stage.state === 'Neutral' ? 18 : 62)
  const points = stages.map((stage, i) => `${step * i + step / 2},${y(stage)}`).join(' ')
  return (
    <div aria-hidden="true" className="relative hidden md:block">
      <div className={`absolute left-0 top-[18%] -translate-y-1/2 text-xs uppercase tracking-[0.12em] ${muted}`}>Neutral</div>
      <div className={`absolute left-0 top-[62%] -translate-y-1/2 text-xs uppercase tracking-[0.12em] ${muted}`}>Frustrated</div>
      <svg viewBox="0 0 100 80" preserveAspectRatio="none" className="block h-32 w-full">
        <line x1="0" x2="100" y1="18" y2="18" stroke="#734756" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="3 4" />
        <line x1="0" x2="100" y1="62" y2="62" stroke="#734756" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="3 4" />
        <polyline points={points} fill="none" stroke="#F0C9CE" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      {stages.map((stage, i) => (
        <span
          key={stage.stage}
          className={`absolute -translate-x-1/2 -translate-y-1/2 ${stage.state === 'Neutral' ? 'h-3.5 w-3.5 rounded-full border-2 border-[#F0C9CE] bg-[#4A2230]' : 'h-4 w-4 rotate-45 bg-[#F0C9CE]'}`}
          style={{ left: `${step * i + step / 2}%`, top: `${(y(stage) / 80) * 100}%` }}
        />
      ))}
    </div>
  )
}

function Journey() {
  const { journey } = aic
  return (
    <Room id="journey" index={4} name={journey.room} title={journey.title} tone="wine" intro={journey.intro}>
      <Reveal>
        <JourneyLine stages={journey.stages} />
        <ol className="m-0 mt-2 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-5 md:gap-5">
          {journey.stages.map((stage, i) => (
            <li key={stage.stage} className={`border-t ${rule} pt-4`}>
              <p className={`m-0 text-xs font-semibold uppercase tracking-[0.12em] ${muted}`}>Stage {i + 1}</p>
              <h3 className={`${serif} m-0 mt-1 text-2xl leading-tight`}>{stage.stage}</h3>
              <p className="m-0 mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--a)]">
                <span
                  aria-hidden="true"
                  className={stage.state === 'Neutral' ? 'h-2.5 w-2.5 rounded-full border-2 border-current' : 'h-2.5 w-2.5 rotate-45 bg-current'}
                />
                {stage.state}
              </p>
              <ul className={`m-0 mt-3 list-none space-y-2 p-0 text-sm leading-snug ${muted}`}>
                {stage.notes.map((note) => (
                  <li key={note} className="flex gap-2">
                    <span aria-hidden="true">–</span>
                    {note}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Reveal>
      <Reveal className={`mt-12 border-t ${rule} pt-8`}>
        <p className={`${serif} m-0 max-w-[40ch] text-2xl leading-snug md:text-3xl`}>{journey.opportunity}</p>
      </Reveal>
    </Room>
  )
}

/* 05 From finding to feature -------------------------------------------- */

function Connections() {
  const { connections } = aic
  const levels = Object.keys(supportLabels) as SupportLevel[]
  return (
    <Room id="connections" index={5} name={connections.room} title={connections.title} tone="paper" intro={connections.intro}>
      <Reveal className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h3 className={`${label} m-0 mb-3`}>{connections.principlesLabel}</h3>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {connections.principles.map((principle) => (
              <li key={principle} className={`border ${rule} px-3 py-1.5 text-sm`}>
                {principle}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-7">
          <h3 className={`${label} m-0 mb-3`}>Key</h3>
          <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-2 p-0 sm:grid-cols-2">
            {levels.map((level) => (
              <li key={level}>
                <LevelTag level={level} />
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal>
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Each part of the original concept, the documented finding it relates to, and how well the research supports it</caption>
          <thead className="hidden md:table-header-group">
            <tr className={`border-b ${rule} text-xs uppercase tracking-[0.12em] ${muted}`}>
              <th scope="col" className="w-[26%] py-3 pr-6 font-semibold">Concept feature</th>
              <th scope="col" className="w-[22%] py-3 pr-6 font-semibold">Support</th>
              <th scope="col" className="w-[20%] py-3 pr-6 font-semibold">Related finding</th>
              <th scope="col" className="py-3 font-semibold">What the evidence shows</th>
            </tr>
          </thead>
          <tbody>
            {connections.rows.map((row) => (
              <tr
                key={row.feature}
                className={`grid grid-cols-1 gap-2 border-b ${rule} py-6 md:table-row md:py-0 ${row.level === 'speculative' ? 'bg-[#EFE6E0] px-4 md:px-0' : ''} ${row.level === 'gap' ? 'bg-[#F1ECE3] px-4 md:px-0' : ''}`}
              >
                <th scope="row" className={`${serif} py-0 pr-6 align-top text-2xl font-normal leading-tight md:py-6 ${row.level === 'speculative' || row.level === 'gap' ? 'md:pl-4' : ''}`}>
                  {row.feature}
                </th>
                <td className="py-0 pr-6 align-top md:py-6">
                  <LevelTag level={row.level} />
                </td>
                <td className="py-0 pr-6 align-top text-sm font-medium md:py-6">
                  <span className={`md:hidden ${muted}`}>Related finding: </span>
                  {row.evidence}
                </td>
                <td className={`py-0 align-top leading-relaxed md:py-6 md:pr-4 ${muted}`}>{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </Room>
  )
}

/* 06 The original concept ------------------------------------------------ */

const visualLabels = {
  reconstruction: { text: 'Reconstruction', Icon: PencilRuler },
  'original-crop': { text: 'Original, cropped', Icon: Scissors },
} as const

/** A reconstruction or an original crop, with its provenance label. */
function ConceptFigure({ visual }: { visual: ConceptVisual }) {
  const { text, Icon } = visualLabels[visual.kind]
  const title = visual.kind === 'reconstruction' ? visual.screen.title : visual.title
  return (
    <figure className="m-0">
      {visual.kind === 'reconstruction' ? (
        <Wireframe screen={visual.screen} />
      ) : (
        <img
          src={visual.src}
          width={visual.width}
          height={visual.height}
          alt={visual.alt}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full rounded-[28px] border-[6px] border-[#D9D1C5] bg-white"
        />
      )}
      <figcaption className="mt-3">
        <span className={`${serif} block text-lg leading-tight`}>{title}</span>
        <span className="mt-1.5 inline-flex items-center gap-1.5 border border-[#6B6157] px-2 py-0.5 text-xs text-[#EDE6DC]">
          <Icon size={13} aria-hidden="true" className="shrink-0" />
          {text}
          {visual.kind === 'reconstruction' && <span className="text-[#BDB3A7]">· from {visual.screen.source}</span>}
        </span>
        {visual.kind === 'original-crop' && <span className={`mt-1.5 block text-xs leading-snug ${muted}`}>{visual.note}</span>}
      </figcaption>
    </figure>
  )
}

function Concept() {
  const { concept } = aic
  return (
    <Room id="concept" index={6} name={concept.room} title={concept.title} tone="ink" intro={concept.intro}>
      <Reveal className={`mb-14 grid grid-cols-1 gap-8 border-y ${rule} py-6 lg:grid-cols-12`}>
        <div className="lg:col-span-4">
          <h3 className={`${label} m-0`}>{concept.labelsTitle}</h3>
          <p className={`m-0 mt-3 text-sm leading-relaxed ${muted}`}>{concept.whyNote}</p>
        </div>
        <dl className="m-0 grid grid-cols-1 gap-5 text-sm sm:grid-cols-3 lg:col-span-8">
          {concept.labels.map((item, i) => (
            <div key={item.name}>
              <dt className="flex items-center gap-2 font-semibold">
                {i === 2 ? (
                  <span aria-hidden="true" className="inline-block h-4 w-4 border border-[#A39A8E] bg-[repeating-linear-gradient(45deg,#EFE9E0_0_3px,#C9BFB2_3px_5px)]" />
                ) : i === 0 ? (
                  <PencilRuler size={16} aria-hidden="true" />
                ) : (
                  <Scissors size={16} aria-hidden="true" />
                )}
                {item.name}
              </dt>
              <dd className={`m-0 mt-1 leading-snug ${muted}`}>{item.body}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <ol className="m-0 list-none space-y-16 p-0 md:space-y-20">
        {concept.flows.map((flow, i) => (
          <li key={flow.id} className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-4">
              <p className={`m-0 text-xs font-semibold uppercase tracking-[0.14em] ${muted}`}>Flow {String.fromCharCode(65 + i)}</p>
              <h3 className={`${serif} m-0 mt-2 text-3xl leading-tight md:text-4xl`}>{flow.title}</h3>
              <LevelTag level={flow.level} className="mt-3" />
              <p className={`m-0 mt-4 max-w-[46ch] leading-relaxed ${muted}`}>{flow.body}</p>
            </Reveal>
            <Reveal className="lg:col-span-8">
              <ul
                className={`m-0 grid list-none gap-5 p-0 ${
                  flow.visuals.length === 1 ? 'max-w-[20rem] grid-cols-1' : 'grid-cols-2 sm:grid-cols-3'
                }`}
              >
                {flow.visuals.map((visual) => (
                  <li key={visual.kind === 'reconstruction' ? visual.screen.id : visual.id}>
                    <ConceptFigure visual={visual} />
                  </li>
                ))}
              </ul>
            </Reveal>
          </li>
        ))}
      </ol>
    </Room>
  )
}

/* 07 Andrew's follow-up --------------------------------------------------- */

function FollowUp() {
  const { followUp } = aic
  return (
    <Room id="follow-up" index={7} name={followUp.room} title={followUp.title} tone="stone" intro={followUp.intro}>
      <ol className="m-0 list-none space-y-16 p-0 md:space-y-24">
        {followUp.designs.map((design, i) => (
          <li key={design.id} className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <Reveal className={`lg:col-span-7 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
              <div className="flex items-end gap-4 sm:gap-6">
                <figure className="m-0 w-[24%] shrink-0 sm:w-[20%]">
                  <Wireframe screen={design.before} />
                  <figcaption className={`mt-2 text-xs leading-snug ${muted}`}>
                    Before: team original
                    <span className="block">Reconstruction · from {design.before.source}</span>
                  </figcaption>
                </figure>
                <figure className="m-0 min-w-0 flex-1">
                  <img
                    src={design.src.md}
                    srcSet={`${design.src.md} 901w, ${design.src.lg} 1501w`}
                    sizes="(min-width: 1024px) 560px, 70vw"
                    width={design.width}
                    height={design.height}
                    alt={design.alt}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full"
                  />
                  <figcaption className={`mt-2 text-xs leading-snug ${muted}`}>After: {followUp.sourceLabel}</figcaption>
                </figure>
              </div>
            </Reveal>
            <Reveal className={`lg:col-span-5 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
              <p className={`${label} m-0`}>Redesign {String(i + 1).padStart(2, '0')}</p>
              <h3 className={`${serif} m-0 mt-2 text-3xl leading-tight md:text-4xl`}>{design.title}</h3>
              <LevelTag level={design.level} className="mt-3" />
              <dl className="m-0 mt-5 space-y-4 leading-relaxed">
                <div>
                  <dt className="text-sm font-semibold">What changed</dt>
                  <dd className={`m-0 mt-1 ${muted}`}>{design.change}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold">Why, from the research</dt>
                  <dd className={`m-0 mt-1 ${muted}`}>{design.research}</dd>
                </div>
              </dl>
            </Reveal>
          </li>
        ))}
      </ol>
      <Reveal>
        <p className={`m-0 mt-12 flex max-w-[80ch] gap-3 border-t ${rule} pt-5 text-sm leading-relaxed ${muted}`}>
          <Info size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-[color:var(--a)]" />
          Untested design hypotheses: no usability results exist for these designs. {followUp.sampleNote}
        </p>
      </Reveal>
    </Room>
  )
}

/* Interlude --------------------------------------------------------------- */

function Interlude() {
  const artwork = aic.about.credits[1]
  return (
    <section aria-label="Interlude" className={`${tones.stone} py-16 md:py-20`}>
      <div className={`${container} grid grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-12`}>
        <Reveal className="lg:col-span-7">
          <Painting artwork={artwork} sizes="(min-width: 1024px) 700px, 92vw" />
        </Reveal>
        <Reveal className="lg:col-span-5">
          <p className={`${serif} m-0 text-3xl leading-[1.2] md:text-4xl`}>The real test happens outside the gallery, with people on their own terms.</p>
          <WallLabel artwork={artwork} className="mt-8" />
        </Reveal>
      </div>
    </section>
  )
}

/* 07 Testing what we assumed ---------------------------------------------- */

function Evaluation() {
  const { evaluation } = aic
  return (
    <Room id="evaluation" index={8} name={evaluation.room} title={evaluation.title} tone="paper" intro={evaluation.intro}>
      <Reveal>
        <p role="note" className="m-0 mb-10 flex items-start gap-3 border-2 border-[color:var(--a)] p-5 text-lg font-semibold leading-snug">
          <WarningCircle size={22} aria-hidden="true" className="mt-0.5 shrink-0 text-[color:var(--a)]" />
          {evaluation.banner}
        </p>
      </Reveal>
      <ol className="m-0 grid list-none grid-cols-1 gap-6 p-0 lg:grid-cols-3">
        {evaluation.plans.map((plan, i) => (
          <li key={plan.area}>
            <Reveal className={`h-full border-t-2 border-[color:var(--a)] bg-white/60 p-6`}>
              <p className={`${label} m-0`}>Study {i + 1} · {plan.area}</p>
              <h3 className={`${serif} m-0 mt-3 text-2xl leading-tight`}>{plan.question}</h3>
              <dl className="m-0 mt-5 space-y-4 text-sm leading-relaxed">
                <div>
                  <dt className="font-semibold">Task</dt>
                  <dd className={`m-0 mt-1 ${muted}`}>“{plan.task}”</dd>
                </div>
                <div>
                  <dt className="font-semibold">Observe</dt>
                  <dd className="m-0 mt-1">
                    <ul className={`m-0 list-none space-y-1.5 p-0 ${muted}`}>
                      {plan.observe.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span aria-hidden="true">–</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Success</dt>
                  <dd className={`m-0 mt-1 ${muted}`}>{plan.success}</dd>
                </div>
              </dl>
            </Reveal>
          </li>
        ))}
      </ol>
    </Room>
  )
}

/* 08 Looking back ----------------------------------------------------------- */

function Reflection() {
  const { reflection } = aic
  return (
    <Room id="reflection" index={9} name={reflection.room} title={reflection.title} tone="stone" intro={reflection.note}>
      <ul className="m-0 grid list-none grid-cols-1 gap-x-12 gap-y-10 p-0 md:grid-cols-2">
        {reflection.notes.map((note) => (
          <li key={note.title}>
            <Reveal className={`border-t ${rule} pt-5`}>
              <p className={`${label} m-0`}>{note.eyebrow}</p>
              <h3 className={`${serif} m-0 mt-3 text-2xl leading-tight md:text-3xl`}>{note.title}</h3>
              <p className={`m-0 mt-3 max-w-[56ch] leading-relaxed ${muted}`}>{note.body}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </Room>
  )
}

/* Closing ----------------------------------------------------------------- */

function About() {
  const { about } = aic
  return (
    <section aria-labelledby="about-title" className={`${tones.ink} py-16 md:py-20`}>
      <div className={`${container} grid grid-cols-1 gap-10 lg:grid-cols-12`}>
        <h2 id="about-title" className={`${serif} m-0 text-3xl leading-tight lg:col-span-4`}>
          {about.title}
        </h2>
        <div className="lg:col-span-8">
          <ul className="m-0 list-none space-y-3 p-0">
            {about.items.map((item) => (
              <li key={item} className={`border-t ${rule} pt-3 leading-relaxed ${muted}`}>
                {item}
              </li>
            ))}
          </ul>
          <h3 className={`${label} m-0 mt-10`}>{about.creditsLabel}</h3>
          <ul className="m-0 mt-4 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2">
            {about.credits.map((artwork) => (
              <li key={artwork.reference}>
                <WallLabel artwork={artwork} />
              </li>
            ))}
          </ul>
          <p className={`m-0 mt-6 text-sm ${muted}`}>{about.licence}</p>
          <Link
            to={workLink}
            state={workState}
            className="mt-10 inline-flex min-h-11 items-center gap-2 bg-[#F6F2EB] px-5 py-3 font-semibold text-[#27231F] transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F6F2EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#27231F]"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            Back to Work
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function AicCaseStudy() {
  useEffect(() => {
    const previous = document.title
    document.title = aic.documentTitle
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <div className="font-type-body antialiased">
      <main>
        <Opening />
        <TheQuestion />
        <Listening />
        <Findings />
        <Journey />
        <Connections />
        <Concept />
        <FollowUp />
        <Interlude />
        <Evaluation />
        <Reflection />
        <About />
      </main>
    </div>
  )
}
