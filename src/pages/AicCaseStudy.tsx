import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { MotionConfig, motion } from 'framer-motion'
import { ArrowLeft } from '@phosphor-icons/react'
import '@fontsource-variable/newsreader'
import '@fontsource-variable/instrument-sans'
import { aic, type AicPoint, type AicScreenCard } from '@/data/aic'
import PresentationActions from '@/components/presentation/PresentationActions'
import ZoomFigure from '@/components/presentation/ZoomFigure'
import { workLink, workState } from '@/components/presentation/PresentationOpening'
import { fadeUp } from '@/lib/motion'
import { aicTheme, PresentationThemeContext, type SectionTone } from '@/lib/presentationTheme'

const container = 'mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10'
const label = 'text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--pres-eyebrow)]'
const body = 'max-w-[60ch] text-lg leading-relaxed text-[color:var(--pres-muted)]'
const serif = 'font-wove-display font-normal tracking-[-0.015em]'
const number = (index: number) => String(index + 1).padStart(2, '0')

// A short fade and lift as content enters the viewport; MotionConfig drops the
// movement for visitors who prefer reduced motion.
function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-8%' }} className={className}>
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

interface SectionProps {
  id: string
  index: number
  name: string
  kicker: string
  title: string
  tone: SectionTone
  children: ReactNode
  className?: string
}

// A numbered chapter: the number sits inside a small arch, followed by the
// chapter name, a kicker and a large editorial heading over a fine rule.
function Section({ id, index, name, kicker, title, tone, children, className = '' }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`${aicTheme.tones[tone]} relative overflow-hidden py-20 md:py-28 ${className}`}>
      <div className={container}>
        <Reveal className="mb-12 grid grid-cols-1 gap-6 border-t border-[color:var(--pres-border)] pt-8 md:mb-16 lg:grid-cols-12 lg:gap-10">
          <div className="flex items-end gap-4 lg:col-span-3">
            <span aria-hidden="true" className="relative inline-flex h-16 w-12 shrink-0 items-end justify-center text-[color:var(--pres-accent)]">
              <Arch className="absolute inset-0 h-full w-full" />
              <span className={`${serif} relative pb-2 text-xl`}>{number(index)}</span>
            </span>
            <p className="m-0 pb-2 text-sm text-[color:var(--pres-muted)]">
              <span className="sr-only">Section {number(index)}: </span>
              {name}
            </p>
          </div>
          <div className="lg:col-span-9">
            <p className={`${label} mb-4`}>{kicker}</p>
            <h2 id={`${id}-title`} className={`${aicTheme.heading} max-w-[22ch] text-4xl md:text-6xl`}>
              {title}
            </h2>
          </div>
        </Reveal>
        {children}
      </div>
    </section>
  )
}

function NumberedPoints({ items, columns = 'md:grid-cols-2 lg:grid-cols-3' }: { items: AicPoint[]; columns?: string }) {
  return (
    <ol className={`m-0 grid list-none grid-cols-1 gap-x-10 gap-y-2 p-0 ${columns}`}>
      {items.map((item, index) => (
        <li key={item.title} className="border-t border-[color:var(--pres-border)] py-7">
          <Reveal className="grid grid-cols-[2.5rem_1fr] gap-3">
            <span aria-hidden="true" className={`${serif} text-2xl leading-none text-[color:var(--pres-accent)]`}>{number(index)}</span>
            <div>
              <h3 className={`${serif} mb-3 text-2xl leading-tight`}>{item.title}</h3>
              <p className="m-0 max-w-[48ch] leading-relaxed text-[color:var(--pres-muted)]">{item.body}</p>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  )
}

function ScreenFigure({ screen, index, className = '' }: { screen: AicScreenCard; index?: number; className?: string }) {
  const prefix = index === undefined ? '' : `${number(index)} / `
  return (
    <ZoomFigure
      image={screen.image}
      captionLabel={`${prefix}${screen.label}`}
      caption={screen.body || undefined}
      className={className}
      portrait
    />
  )
}

function Note({ children }: { children: ReactNode }) {
  return (
    <p className="mb-0 mt-10 max-w-[80ch] border-l-2 border-[color:var(--pres-accent)] pl-4 text-sm leading-relaxed text-[color:var(--pres-muted)]">
      {children}
    </p>
  )
}

function Opening() {
  const { opening } = aic
  const [light, dark] = opening.screens
  return (
    <section aria-labelledby="aic-title" className={`${aicTheme.tones.base} relative overflow-hidden`}>
      <nav aria-label="Case study" className={`${container} flex items-center justify-between gap-4 border-b border-[color:var(--pres-border)] py-5`}>
        <Link to={workLink} state={workState} className={`inline-flex min-h-11 items-center gap-2 rounded text-sm font-medium text-[#842C3B] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${aicTheme.focusRing}`}>
          <ArrowLeft size={16} aria-hidden="true" />
          Back to Work
        </Link>
        <p className="m-0 hidden text-xs uppercase tracking-[0.14em] text-[#615A51] sm:block">{aic.runningHead}</p>
      </nav>
      <div className={`${container} grid grid-cols-1 gap-12 pb-16 pt-14 md:pb-8 md:pt-20 lg:grid-cols-12 lg:gap-10`}>
        <Reveal className="lg:col-span-7 lg:pt-6">
          <p className={`${label} mb-8`}>{opening.eyebrow}</p>
          <h1 id="aic-title" className="m-0">
            <span className={`block ${aicTheme.title} text-[3.25rem] sm:text-7xl md:text-8xl lg:text-[7.25rem]`}>
              {opening.titleLines.map((line) => <span key={line} className="block">{line}</span>)}
            </span>
            <span className={`mt-8 block ${aicTheme.subtitle}`}>{opening.project}</span>
          </h1>
          <p className="mt-6 max-w-[34ch] text-xl leading-relaxed text-[#27231F] md:text-2xl">{opening.lede}</p>
          <div className="mt-12 max-w-[56ch] border-t border-[color:var(--pres-border)] pt-6">
            <p className={`${label} mb-2`}>{opening.roleLabel}</p>
            <p className="m-0 text-lg leading-relaxed text-[#615A51]">{opening.role}</p>
          </div>
        </Reveal>
        <Reveal className="lg:col-span-5">
          <figure className="relative m-0 bg-[#E9E0D4] px-6 pb-8 pt-12 sm:px-12 lg:px-10">
            <Arch className="absolute left-[3%] top-5 h-[calc(100%-6rem)] w-[94%] text-[#C9B9A6]" />
            <div className="relative mx-auto grid max-w-[440px] grid-cols-2 items-start gap-5 sm:gap-8">
              <ScreenFigure screen={light} className="mt-14" />
              <ScreenFigure screen={dark} />
            </div>
            <figcaption className={`${label} relative mt-6 text-[#615A51]`}>{opening.caption}</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}

function Context() {
  const { context } = aic
  return (
    <Section id="context" index={0} name={context.label} kicker={context.kicker} title={context.title} tone="base">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <Reveal><p className={`${body} m-0 text-xl text-[#27231F]`}>{context.body}</p></Reveal>
          <p className={`${label} mb-2 mt-14`}>{context.contributionLabel}</p>
          <ol className="m-0 list-none p-0">
            {context.contribution.map((item, index) => (
              <li key={item.title} className="border-b border-[color:var(--pres-border)] py-6">
                <Reveal className="grid grid-cols-[3rem_1fr] gap-3">
                  <span aria-hidden="true" className={`${serif} text-3xl leading-none text-[#842C3B]`}>{number(index)}</span>
                  <div>
                    <h3 className={`${serif} mb-2 text-2xl`}>{item.title}</h3>
                    <p className="m-0 leading-relaxed text-[#615A51]">{item.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
        <Reveal className="lg:col-span-4 lg:col-start-9">
          <div className="bg-[#E9E0D4] p-6 md:p-8">
            <dl className="m-0 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {context.record.map((item) => (
                <div key={item.label}>
                  <dt className={`${label} mb-1`}>{item.label}</dt>
                  <dd className="m-0 leading-snug">{item.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mb-0 mt-6 border-t border-[#D6CBBC] pt-4 text-sm leading-relaxed text-[#615A51]">{context.disclaimer}</p>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

function Research() {
  const { research } = aic
  return (
    <Section id="research" index={1} name={research.label} kicker={research.kicker} title={research.title} tone="alt">
      <dl className="m-0 grid grid-cols-1 gap-x-10 sm:grid-cols-3">
        {research.stats.map((stat) => (
          <Reveal key={stat.label} className="flex flex-col-reverse border-b border-[color:var(--pres-border)] py-6">
            <dt className="mt-2 text-[#615A51]">{stat.label}</dt>
            <dd className={`${serif} m-0 text-6xl leading-none text-[#842C3B] md:text-7xl`}>{stat.value}</dd>
          </Reveal>
        ))}
      </dl>
      <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-6"><p className={`${body} m-0 text-[#27231F]`}>{research.body}</p></Reveal>
        <Reveal className="lg:col-span-5 lg:col-start-8">
          <h3 className={`${label} mb-2`}>{research.exploredLabel}</h3>
          <ul className="m-0 list-none p-0">
            {research.explored.map((item) => (
              <li key={item} className="border-b border-[color:var(--pres-border)] py-4 text-lg">{item}</li>
            ))}
          </ul>
        </Reveal>
      </div>
      <Reveal className="mt-16">
        <figure className="relative m-0 overflow-hidden bg-[#512632] px-6 py-10 text-[#F6F2EB] sm:px-12 md:py-14">
          <Arch className="absolute -bottom-10 right-8 hidden h-[130%] w-40 text-[#7D5560] md:block" />
          <blockquote className={`${serif} relative m-0 max-w-[28ch] text-3xl leading-snug md:text-5xl`}>
            <p className="m-0">“{research.quote}”</p>
          </blockquote>
          <figcaption className="relative mt-6 text-sm text-[#E6D6D5]">{research.quoteSource}</figcaption>
        </figure>
      </Reveal>
    </Section>
  )
}

function Findings() {
  const { findings } = aic
  return (
    <Section id="findings" index={2} name={findings.label} kicker={findings.kicker} title={findings.title} tone="base">
      <NumberedPoints items={findings.items} />
      <Note>{findings.note}</Note>
    </Section>
  )
}

const stageX = ['left-[10%]', 'left-[30%]', 'left-[50%]', 'left-[70%]', 'left-[90%]']
const stateY = { Neutral: 'top-[30%]', Frustrated: 'top-[78%]' } as const
const lineY = { Neutral: 30, Frustrated: 78 } as const

function Journey() {
  const { journey } = aic
  const points = journey.stages.map((stage, index) => `${10 + index * 20},${lineY[stage.state]}`).join(' ')
  return (
    <Section id="journey" index={3} name={journey.label} kicker={journey.kicker} title={journey.title} tone="alt">
      <Reveal><p className={`${body} m-0 text-[#27231F]`}>{journey.body}</p></Reveal>
      <figure className="m-0 mt-12" aria-labelledby="journey-caption">
        <p id="journey-caption" className={`${label} mb-6 text-[#615A51] lg:text-right`}>{journey.scaleNote}</p>

        {/* Large screens: the emotional line drawn over the five stages. The same
            information is in the stage list below, so this layer is decorative. */}
        <Reveal className="relative hidden h-52 lg:block">
          <div aria-hidden="true" className="absolute inset-0">
            <span className="absolute bottom-0 left-[20.5%] top-0 w-[19%] bg-[#842C3B]/10" />
            <span className="absolute bottom-0 left-[40.5%] top-0 w-[19%] bg-[#842C3B]/10" />
            <span className="absolute inset-x-0 top-[30%] h-px bg-[#D6CBBC]" />
            <span className="absolute inset-x-0 top-[78%] h-px bg-[#D6CBBC]" />
            <span className="absolute left-0 top-[30%] -translate-y-[130%] text-xs uppercase tracking-[0.14em] text-[#615A51]">Neutral</span>
            <span className="absolute left-0 top-[78%] -translate-y-[130%] text-xs uppercase tracking-[0.14em] text-[#615A51]">Frustrated</span>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" fill="none">
              <polyline points={points} stroke="#842C3B" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            </svg>
            {journey.stages.map((stage, index) => (
              <span key={stage.stage} className={`absolute ${stageX[index]} ${stateY[stage.state]} h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#842C3B] ring-4 ring-[#E9E0D4]`} />
            ))}
          </div>
        </Reveal>

        <ol className="m-0 list-none p-0 lg:mt-8 lg:grid lg:grid-cols-5">
          {journey.stages.map((stage) => {
            const low = stage.state === 'Frustrated'
            return (
              <li key={stage.stage} className={`relative border-l border-[#842C3B]/40 pb-8 pl-7 last:pb-2 lg:border-l-0 lg:pb-0 lg:pl-0 lg:pr-6 ${low ? 'max-lg:bg-[#842C3B]/[0.07]' : ''}`}>
                <span aria-hidden="true" className={`absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full border-2 border-[#842C3B] lg:hidden ${low ? 'bg-[#842C3B]' : 'bg-[#E9E0D4]'}`} />
                <Reveal className={low ? 'max-lg:py-4 max-lg:pr-4' : ''}>
                  <h3 className={`${serif} mb-1 text-2xl leading-tight`}>{stage.stage}</h3>
                  <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.12em] ${low ? 'text-[#842C3B]' : 'text-[#615A51]'}`}>
                    <span className="sr-only">Emotional state: </span>
                    {stage.state}{low ? ' · low point' : ''}
                  </p>
                  <p className="m-0 leading-relaxed text-[#615A51]">{stage.body}</p>
                </Reveal>
              </li>
            )
          })}
        </ol>
      </figure>
      <Reveal className="mt-14 border-t border-[color:var(--pres-border)] pt-6">
        <p className="m-0 max-w-[60ch] text-xl leading-relaxed text-[#842C3B]">{journey.opportunity}</p>
      </Reveal>
    </Section>
  )
}

function Direction() {
  const { direction } = aic
  const { columns } = direction
  return (
    <Section id="direction" index={4} name={direction.label} kicker={direction.kicker} title={direction.title} tone="base">
      <div aria-hidden="true" className={`${label} hidden grid-cols-3 gap-8 pb-4 md:grid`}>
        <span>{columns.theme}</span>
        <span>{columns.response}</span>
        <span>{columns.test}</span>
      </div>
      <ul className="m-0 list-none p-0">
        {direction.rows.map((row) => (
          <li key={row.theme} className="border-t border-[color:var(--pres-border)] py-7 last:border-b">
            <Reveal>
              <dl className="m-0 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
                <div>
                  <dt className={`${label} mb-1 md:sr-only`}>{columns.theme}</dt>
                  <dd className={`${serif} m-0 text-2xl leading-tight`}>{row.theme}</dd>
                </div>
                <div>
                  <dt className={`${label} mb-1 md:sr-only`}>{columns.response}</dt>
                  <dd className="m-0 text-lg leading-relaxed text-[#27231F]">{row.response}</dd>
                </div>
                <div>
                  <dt className={`${label} mb-1 md:sr-only`}>{columns.test}</dt>
                  <dd className="m-0 text-lg leading-relaxed text-[#615A51]">{row.test}</dd>
                </div>
              </dl>
            </Reveal>
          </li>
        ))}
      </ul>
      <p className="mb-0 mt-8 bg-[#E9E0D4] px-4 py-3 text-sm leading-relaxed text-[#615A51]">{direction.note}</p>
    </Section>
  )
}

function Onboarding() {
  const { onboarding } = aic
  return (
    <Section id="onboarding" index={5} name={onboarding.label} kicker={onboarding.kicker} title={onboarding.title} tone="alt">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="grid grid-cols-2 items-start gap-x-5 gap-y-12 sm:grid-cols-3 sm:gap-x-8 lg:col-span-9">
          {onboarding.screens.map((screen, index) => (
            <ScreenFigure key={screen.label} screen={screen} index={index} className={index === 1 ? 'sm:mt-12' : ''} />
          ))}
        </div>
        <Reveal className="lg:col-span-3">
          <aside aria-labelledby="onboarding-next" className="bg-[#F6F2EB] p-6 lg:mt-24">
            <h3 id="onboarding-next" className={`${label} mb-4`}>{onboarding.nextLabel}</h3>
            <p className={`${serif} m-0 text-2xl leading-snug`}>{onboarding.next}</p>
          </aside>
        </Reveal>
      </div>
    </Section>
  )
}

function Discovery() {
  const { discovery } = aic
  return (
    <Section id="discovery" index={6} name={discovery.label} kicker={discovery.kicker} title={discovery.title} tone="base">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="relative bg-[#E9E0D4] px-5 pb-10 pt-10 sm:px-10 lg:col-span-6">
          <Arch className="absolute left-[3%] top-4 h-[calc(100%-1rem)] w-[94%] text-[#C9B9A6]" />
          <div className="relative mx-auto grid max-w-[460px] grid-cols-2 items-start gap-5 sm:gap-8">
            {discovery.screens.map((screen, index) => (
              <ScreenFigure key={screen.label} screen={screen} className={index === 1 ? 'mt-16' : ''} />
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8 lg:pt-6">
          <NumberedPoints items={discovery.points} columns="" />
        </div>
      </div>
    </Section>
  )
}

function Collecting() {
  const { collecting } = aic
  return (
    <Section id="collecting" index={7} name={collecting.label} kicker={collecting.kicker} title={collecting.title} tone="accent">
      <p className="relative -mt-4 mb-12 inline-flex items-center rounded-full border border-[#EBC9CD]/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#EBC9CD]">
        {collecting.badge}
      </p>
      <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="grid grid-cols-2 items-start gap-x-5 gap-y-12 sm:grid-cols-3 sm:gap-x-8 lg:col-span-8">
          {collecting.screens.map((screen, index) => (
            <ScreenFigure key={screen.label} screen={screen} className={index === 1 ? 'sm:mt-10' : ''} />
          ))}
        </div>
        <Reveal className="lg:col-span-4">
          <p className="m-0 text-xl leading-relaxed">{collecting.body}</p>
          <p className="mb-0 mt-8 border-t border-[#7D5560] pt-8 text-lg leading-relaxed text-[#E6D6D5]">{collecting.next}</p>
        </Reveal>
      </div>
    </Section>
  )
}

const swatchFill: Record<string, string> = {
  'Warm paper': 'bg-[#F6F2EB]',
  Burgundy: 'bg-[#842C3B]',
  'Gallery ink': 'bg-[#27231F]',
}

function Visual() {
  const { visual } = aic
  return (
    <Section id="visual" index={8} name={visual.label} kicker={visual.kicker} title={visual.title} tone="base">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="mx-auto grid w-full max-w-[460px] grid-cols-2 items-start gap-5 sm:gap-8 lg:col-span-5 lg:mx-0">
          {visual.screens.map((screen, index) => (
            <ScreenFigure key={screen.label} screen={screen} className={index === 1 ? 'mt-12' : ''} />
          ))}
        </div>
        <Reveal className="lg:col-span-6 lg:col-start-7">
          <h3 className={`${serif} mb-4 text-3xl`}>{visual.subtitle}</h3>
          <p className={`${body} m-0`}>{visual.body}</p>
          <ul className="m-0 mt-10 grid list-none grid-cols-3 gap-4 p-0">
            {visual.swatches.map((swatch) => (
              <li key={swatch.name}>
                <span aria-hidden="true" className={`block h-16 border border-[#D6CBBC] md:h-20 ${swatchFill[swatch.name]}`} />
                <span className="mt-3 block text-xs font-semibold uppercase tracking-[0.12em] text-[#615A51]">{swatch.name}</span>
                <span className="mt-1 block font-mono text-xs text-[#615A51]">{swatch.hex}</span>
              </li>
            ))}
          </ul>
          <p className={`${body} mb-0 mt-10`}>{visual.framing}</p>
        </Reveal>
      </div>
    </Section>
  )
}

function NextIteration() {
  const { nextIteration } = aic
  return (
    <Section id="next-iteration" index={9} name={nextIteration.label} kicker={nextIteration.kicker} title={nextIteration.title} tone="alt">
      <NumberedPoints items={nextIteration.items} columns="md:grid-cols-2" />
      <Note>{nextIteration.note}</Note>
    </Section>
  )
}

function Outcome() {
  const { outcome } = aic
  return (
    <Section id="outcome" index={10} name={outcome.label} kicker={outcome.kicker} title={outcome.title} tone="accent">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-7">
          <p className="m-0 max-w-[40ch] text-2xl leading-snug">{outcome.lead}</p>
          <p className="mb-0 mt-8 max-w-[58ch] text-lg leading-relaxed text-[#E6D6D5]">{outcome.body}</p>
          <p className={`${serif} mb-0 mt-14 text-3xl leading-snug md:text-4xl`}>
            {outcome.closing.map((line) => <span key={line} className="block">{line}</span>)}
          </p>
        </Reveal>
        <Reveal className="border-t border-[#7D5560] pt-8 lg:col-span-4 lg:col-start-9 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <h3 className={`${label} mb-3`}>{outcome.recordLabel}</h3>
          <ul className="m-0 list-none p-0 leading-relaxed">
            {outcome.record.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <h3 className={`${label} mb-3 mt-10`}>{outcome.sourcesLabel}</h3>
          <ul className="m-0 list-none space-y-3 p-0 text-sm leading-relaxed text-[#E6D6D5]">
            {outcome.sources.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className="mb-0 mt-8 text-xs leading-relaxed text-[#E6D6D5]">{outcome.affiliation}</p>
        </Reveal>
      </div>
      <PresentationActions pdf={outcome.pdf} />
    </Section>
  )
}

export default function AicCaseStudy() {
  useEffect(() => {
    window.scrollTo(0, 0)
    const previous = document.title
    document.title = aic.documentTitle
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <PresentationThemeContext.Provider value={aicTheme}>
        <main className="min-h-[100dvh] bg-[#F6F2EB] font-type-body text-[#27231F] antialiased">
          <Opening />
          <Context />
          <Research />
          <Findings />
          <Journey />
          <Direction />
          <Onboarding />
          <Discovery />
          <Collecting />
          <Visual />
          <NextIteration />
          <Outcome />
        </main>
      </PresentationThemeContext.Provider>
    </MotionConfig>
  )
}
