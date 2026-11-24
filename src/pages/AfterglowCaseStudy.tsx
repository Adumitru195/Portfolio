import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle, NotePencil, Question, Ruler } from '@phosphor-icons/react'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/inter'
import { afterglow } from '@/data/afterglow'
import PresentationActions from '@/components/presentation/PresentationActions'
import ZoomFigure from '@/components/presentation/ZoomFigure'
import DemoVideo from '@/components/presentation/DemoVideo'
import { workLink, workState } from '@/components/presentation/PresentationOpening'
import { fadeUp } from '@/lib/motion'
import { PresentationThemeContext, afterglowTheme, type SectionTone } from '@/lib/presentationTheme'
import { useReveal } from '@/hooks/useReveal'
import type { GlowEvidence, GlowProblem, GlowShot, GlowStat } from '@/types/afterglow'

const container = 'mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10'
const display = 'font-glow-display font-semibold leading-[1.1] tracking-[-0.01em]'
const kicker = 'text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--pres-eyebrow)]'
const muted = 'text-[color:var(--pres-muted)]'
const focus = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glow-text focus-visible:ring-offset-2 focus-visible:ring-offset-glow-bg'

// Scroll reveal that follows both reduced-motion settings and never leaves content hidden.
function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reveal = useReveal({ once: true, margin: '-8%' })
  return (
    <motion.div variants={fadeUp} {...reveal} className={className}>
      {children}
    </motion.div>
  )
}

const evidence: Record<GlowEvidence, { label: string; meaning: string; Icon: typeof Ruler }> = {
  measured: { label: 'Measured', meaning: 'a measurement of the prototype’s interface', Icon: Ruler },
  verified: { label: 'Verified', meaning: 'prototype behaviour or an automated check', Icon: CheckCircle },
  recorded: { label: 'Recorded', meaning: 'documented in the prototype’s design log', Icon: NotePencil },
  hypothesis: { label: 'Needs testing', meaning: 'a design intention, not yet tested with people', Icon: Question },
}

function Tag({ kind, onPaper = false }: { kind: GlowEvidence; onPaper?: boolean }) {
  const { label, Icon } = evidence[kind]
  const tone = onPaper ? 'border-glow-flag text-glow-flag' : 'border-glow-line-strong text-glow-accent'
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 align-middle text-xs font-semibold ${tone}`}>
      <Icon size={13} weight="bold" aria-hidden="true" />
      {label}
    </span>
  )
}

function EvidenceKey() {
  return (
    <div className="mt-8">
      <h2 className={`${kicker} mb-3 mt-0`}>How to read the numbers</h2>
      <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-3 p-0 text-sm">
        {(['measured', 'verified', 'recorded'] as GlowEvidence[]).map((kind) => (
          <li key={kind} className="flex items-center gap-2">
            <Tag kind={kind} />
            <span className="text-glow-muted">{evidence[kind].meaning}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// A statistic printed as a ticket stub: the value above a perforation, the label below.
// Below 640px a compact stub puts the value beside the label, with a vertical perforation.
function TicketStat({ stat, compact = false }: { stat: GlowStat; compact?: boolean }) {
  return (
    <div className={`relative h-full rounded-lg bg-glow-paper text-glow-ink ${compact ? 'grid grid-cols-[minmax(5.5rem,auto)_1fr] gap-x-4 px-4 py-4 sm:block sm:px-5' : 'px-5 py-4'}`}>
      <span aria-hidden="true" className={`absolute h-4 w-4 rounded-full bg-[color:var(--ticket-cut)] ${compact ? 'max-sm:-top-2 max-sm:left-[6.6rem] sm:-left-2 sm:top-[3.6rem]' : '-left-2 top-[3.6rem]'}`} />
      <span aria-hidden="true" className={`absolute h-4 w-4 rounded-full bg-[color:var(--ticket-cut)] ${compact ? 'max-sm:-bottom-2 max-sm:left-[6.6rem] sm:-right-2 sm:top-[3.6rem]' : '-right-2 top-[3.6rem]'}`} />
      <p className={`${display} m-0 whitespace-nowrap tabular-nums leading-[1.3] ${compact ? 'self-center text-2xl sm:text-3xl' : 'text-3xl md:text-4xl'}`}>{stat.value}</p>
      <span aria-hidden="true" className={compact ? 'hidden sm:my-3 sm:block sm:border-t-2 sm:border-dashed sm:border-[#B9B4AA]' : 'my-3 block border-t-2 border-dashed border-[#B9B4AA]'} />
      <div className={compact ? 'border-l-2 border-dashed border-[#B9B4AA] pl-4 sm:border-l-0 sm:pl-0' : ''}>
        <p className="m-0 font-semibold leading-snug">{stat.label}</p>
        {stat.detail && <p className="mb-0 mt-1 text-sm leading-snug text-glow-paper-muted">{stat.detail}</p>}
        <p className="mb-0 mt-2 sm:mt-3">
          <Tag kind={stat.kind} onPaper />
        </p>
      </div>
    </div>
  )
}

function Shot({ shot, chrome = false, className = '' }: { shot: GlowShot; chrome?: boolean; className?: string }) {
  return <ZoomFigure image={shot.image} captionLabel={shot.label} caption={shot.caption} portrait={shot.portrait} chrome={chrome} className={className} />
}

// Phones: a swipeable strip on small screens so each stays readable, a pair above.
function PhoneStrip({ phones, label }: { phones: GlowShot[]; label: string }) {
  return (
    <ul aria-label={label} className="relative -mx-4 flex min-w-0 snap-x snap-mandatory list-none gap-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:p-0 md:gap-6">
      {phones.map((shot) => (
        <li key={shot.image.src} className="w-[70%] max-w-[300px] shrink-0 snap-start md:w-auto md:max-w-[300px]">
          <Shot shot={shot} />
        </li>
      ))}
    </ul>
  )
}

const ticketCut: Record<SectionTone, string> = {
  base: '[--ticket-cut:#141827]',
  alt: '[--ticket-cut:#0E111C]',
  accent: '[--ticket-cut:#F5F2EB]',
}

function Section({ id, tone, index, label, title, intro, children }: { id: string; tone: SectionTone; index: string; label: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`${afterglowTheme.tones[tone]} ${ticketCut[tone]} py-12 md:py-24`}>
      <div className={container}>
        <Reveal className="mb-10 max-w-[70ch] md:mb-14">
          <p className={`mb-4 flex items-center gap-3 ${kicker}`}>
            <span className="tabular-nums">
              <span className="sr-only">Section </span>
              {index}
            </span>
            <span aria-hidden="true" className="block h-px w-8 bg-current" />
            <span>{label}</span>
          </p>
          <h2 id={`${id}-title`} className={`${display} m-0 text-3xl md:text-5xl`}>{title}</h2>
          {intro && <div className={`mt-5 text-lg leading-relaxed ${muted}`}>{intro}</div>}
        </Reveal>
        {children}
      </div>
    </section>
  )
}

function Opening() {
  const { opening } = afterglow
  const targets = ['discovery', 'showtimes', 'selection']
  return (
    <section aria-labelledby="presentation-title" className={`${afterglowTheme.tones.base} [--ticket-cut:#141827]`}>
      <nav aria-label="Case study" className={`${container} pt-6`}>
        <Link to={workLink} state={workState} className={`inline-flex min-h-11 items-center gap-2 rounded text-sm font-medium text-glow-accent hover:underline ${focus}`}>
          <ArrowLeft size={16} aria-hidden="true" />
          Back to Work
        </Link>
      </nav>
      <div className={`${container} pb-14 pt-8 md:pb-20 md:pt-12`}>
        <Reveal className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className={`mb-5 ${kicker}`}>{opening.eyebrow}</p>
            <h1 id="presentation-title" className={`m-0 ${afterglowTheme.title}`}>Afterglow Cinema</h1>
            <p className={`mb-0 mt-5 max-w-[30ch] ${afterglowTheme.subtitle}`}>{opening.subtitle}</p>
            <p className="mb-0 mt-6 max-w-[58ch] text-lg leading-relaxed">{opening.lede}</p>
          </div>
          <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-glow-line pt-6 lg:col-span-5">
            {opening.meta.map((item, i) => (
              <div key={item.label} className={i === 0 ? 'col-span-2' : undefined}>
                <dt className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-glow-muted">{item.label}</dt>
                <dd className="m-0 font-medium leading-snug">{item.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="mt-12 md:mt-16">
          <Shot shot={opening.hero} chrome />
        </Reveal>

        <Reveal className="mt-12 md:mt-16">
          <h2 className={`${kicker} mb-5 mt-0`}>{opening.summaryLabel}</h2>
          <ol className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-3 md:gap-6">
            {opening.summary.map((item, i) => (
              <li key={item.problem}>
                <a
                  href={`#${targets[i]}`}
                  onClick={(event) => {
                    // Hash routing: scroll in place rather than changing the route.
                    event.preventDefault()
                    document.getElementById(targets[i])?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className={`group flex h-full flex-col rounded-lg ${focus}`}
                >
                  <span className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-glow-text">
                    <span>
                      0{i + 2} · {item.problem}
                    </span>
                    <ArrowRight size={16} aria-hidden="true" className="text-glow-accent transition-transform motion-safe:group-hover:translate-x-0.5" />
                  </span>
                  <div className="flex-1">
                    <TicketStat stat={item.stat} />
                  </div>
                </a>
              </li>
            ))}
          </ol>
          <p className="mb-0 mt-6 max-w-[90ch] text-sm leading-relaxed text-glow-muted">{opening.note}</p>
          <EvidenceKey />
        </Reveal>
      </div>
    </section>
  )
}

function Journey() {
  const { journey } = afterglow
  return (
    <Section id="journey" tone="alt" index="01" label="The journey" title={journey.title} intro={journey.intro}>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className="min-w-0 lg:col-span-8">
          <DemoVideo video={journey.video} descriptionSummary={journey.descriptionSummary} />
        </Reveal>
        <Reveal className="lg:col-span-4">
          <h3 className={`${kicker} mb-4 mt-0`}>Running order</h3>
          <ol className="m-0 list-none p-0">
            {journey.chapters.map((chapter) => (
              <li key={chapter.time} className="grid grid-cols-[3.25rem_1fr] gap-3 border-t border-glow-line py-4 last:border-b">
                <span className="font-glow-display text-lg font-medium tabular-nums text-glow-accent">{chapter.time}</span>
                <span className={`${display} block text-lg`}>{chapter.title}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </Section>
  )
}

function Problem({ problem, tone }: { problem: GlowProblem; tone: SectionTone }) {
  return (
    <Section
      id={problem.id}
      tone={tone}
      index={problem.index}
      label={problem.label}
      title={problem.title}
      intro={<p className="m-0 font-glow-display text-xl font-medium leading-snug text-glow-text md:text-2xl">{problem.question}</p>}
    >
      <Reveal>
        <ul aria-label={`${problem.label}: evidence`} className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-3 md:gap-6">
          {problem.stats.map((stat) => (
            <li key={stat.label}>
              <TicketStat stat={stat} compact />
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-10 md:mt-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <Reveal className="lg:sticky lg:top-24">
            <h3 className={`${kicker} mb-2 mt-0`}>How the interface answers it</h3>
            <ol className="m-0 list-none p-0">
              {problem.decisions.map((decision, i) => (
                <li key={decision.title} className="grid grid-cols-[2.25rem_1fr] gap-3 border-t border-glow-line py-5 first:border-t-0">
                  <span aria-hidden="true" className="font-glow-display text-2xl font-medium leading-none text-glow-accent">{i + 1}</span>
                  <div>
                    <h4 className={`${display} m-0 text-lg md:text-xl`}>{decision.title}</h4>
                    <p className="mb-0 mt-2 leading-relaxed text-glow-muted">{decision.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        <div className="flex min-w-0 flex-col gap-10 lg:col-span-7">
          <Reveal className="order-2 lg:order-1">
            <Shot shot={problem.primary} chrome />
          </Reveal>
          {problem.states.map((shot) => (
            <Reveal key={shot.image.src} className="order-3 lg:order-2">
              <Shot shot={shot} chrome />
            </Reveal>
          ))}
          <Reveal className="order-1 min-w-0 lg:order-3">
            <PhoneStrip phones={problem.phones} label={`${problem.label} on a phone`} />
          </Reveal>
        </div>
      </div>
    </Section>
  )
}

function VisualSystem() {
  const { system } = afterglow
  return (
    <Section id="system" tone="alt" index="05" label="Visual system and motion" title={system.title} intro={system.intro}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-7">
          <h3 className={`${kicker} mb-4 mt-0`}>Palette</h3>
          <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 md:grid-cols-5">
            {system.swatches.map((swatch) => (
              <li key={swatch.hex}>
                <span aria-hidden="true" className="mb-2 block h-14 rounded-md border border-glow-line-strong" style={{ backgroundColor: swatch.hex }} />
                <span className="block font-semibold leading-snug">{swatch.name}</span>
                <span className="block font-mono text-sm text-glow-muted">{swatch.hex}</span>
                <span className="block text-sm leading-snug text-glow-muted">{swatch.usage}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {system.fonts.map((font, i) => (
              <div key={font.name} className="rounded-lg border border-glow-line p-5">
                <p className={`${kicker} m-0`}>{font.name}</p>
                <p className="mb-4 mt-1 text-sm text-glow-muted">{font.role}</p>
                <p className={i === 0 ? `${display} m-0 text-4xl` : 'm-0 text-lg tabular-nums'}>{font.sample}</p>
              </div>
            ))}
          </div>
          <ul aria-label="Contrast" className="m-0 mt-10 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2">
            {system.contrast.map((stat) => (
              <li key={stat.label}>
                <TicketStat stat={stat} compact />
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="lg:col-span-5">
          <h3 className={`${kicker} mb-2 mt-0`}>Motion that explains a change</h3>
          <ul className="m-0 list-none p-0">
            {system.motion.map((item) => (
              <li key={item.title} className="border-t border-glow-line py-4 first:border-t-0">
                <h4 className={`${display} m-0 text-lg`}>{item.title}</h4>
                <p className="mb-0 mt-1.5 leading-relaxed text-glow-muted">{item.body}</p>
              </li>
            ))}
          </ul>
          <p className="mb-0 mt-4 rounded-lg border border-glow-line-strong p-5 text-sm leading-relaxed text-glow-muted">
            <span className={`${kicker} mb-1 block`}>Reduced motion</span>
            {system.reducedMotion}
          </p>
        </Reveal>
      </div>
    </Section>
  )
}

function Quality() {
  const { quality } = afterglow
  return (
    <Section id="quality" tone="accent" index="06" label="Evidence and reflection" title={quality.title} intro={quality.intro}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-6">
          <dl className="m-0">
            {quality.checks.map((check) => (
              <div key={check.label} className="grid grid-cols-1 gap-x-6 gap-y-1 border-t border-[#D9D3C7] py-4 sm:grid-cols-[9.5rem_1fr]">
                <dt className={`${display} text-3xl tabular-nums text-glow-ink`}>{check.value}</dt>
                <dd className="m-0">
                  <span className="block font-semibold leading-snug">{check.label}</span>
                  <span className="mb-2 mt-1 block text-sm leading-snug text-glow-paper-muted">{check.detail}</span>
                  <Tag kind={check.kind} onPaper />
                </dd>
              </div>
            ))}
            <div className="border-t border-[#D9D3C7] py-4">
              <dt className="flex items-center gap-2 font-semibold">
                <Question size={18} weight="bold" aria-hidden="true" className="text-glow-flag" />
                {quality.notDone.title}
              </dt>
              <dd className="m-0">
                <ul className="m-0 mt-2 list-disc space-y-1 pl-5 text-sm leading-snug text-glow-paper-muted">
                  {quality.notDone.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </dd>
            </div>
          </dl>
        </Reveal>
        <Reveal className="lg:col-span-6">
          <p className="m-0 border-l-2 border-glow-flag pl-4 font-glow-display text-xl font-medium leading-snug md:text-2xl">{quality.learned}</p>
          <h3 className={`${display} mb-3 mt-10 text-2xl`}>{quality.next.title}</h3>
          <p className="mb-4 mt-0 leading-relaxed text-glow-paper-muted">{quality.next.intro}</p>
          <ol className="m-0 list-decimal space-y-2 pl-5 leading-relaxed">
            {quality.next.questions.map((question) => <li key={question}>{question}</li>)}
          </ol>
          <PresentationActions contactLabel={quality.contactLabel} />
        </Reveal>
      </div>
    </Section>
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
    <PresentationThemeContext.Provider value={afterglowTheme}>
      <div className="font-glow-body antialiased [color-scheme:dark]">
        <main>
          <Opening />
          <Journey />
          <Problem problem={afterglow.discovery} tone="base" />
          <Problem problem={afterglow.showtimes} tone="alt" />
          <Problem problem={afterglow.selection} tone="base" />
          <VisualSystem />
          <Quality />
        </main>
      </div>
    </PresentationThemeContext.Provider>
  )
}
