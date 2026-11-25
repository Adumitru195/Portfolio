import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import '@fontsource-variable/newsreader/opsz.css'
import '@fontsource-variable/newsreader/opsz-italic.css'
import '@fontsource-variable/manrope'
import { wovenward } from '@/data/wovenward'
import PresentationActions from '@/components/presentation/PresentationActions'
import ZoomFigure from '@/components/presentation/ZoomFigure'
import DemoVideo from '@/components/presentation/DemoVideo'
import { workLink, workState } from '@/components/presentation/PresentationOpening'
import { fadeUp } from '@/lib/motion'
import { PresentationThemeContext, wovenwardTheme, type SectionTone } from '@/lib/presentationTheme'
import { useReveal } from '@/hooks/useReveal'
import type { WoveChapter, WoveFigure, WoveNote, WoveSource } from '@/types/wovenward'

const container = 'mx-auto max-w-[1320px] px-4 sm:px-6 md:px-10'
const serif = 'font-wove-display font-light leading-[1.05] tracking-[-0.02em]'
const smallCaps = 'text-[0.72rem] font-semibold uppercase tracking-[0.16em]'
const focus = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wove-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-wove-porcelain'

// Scroll reveal that follows both reduced-motion settings and never leaves content hidden.
function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reveal = useReveal({ once: true, margin: '-8%' })
  return (
    <motion.div variants={fadeUp} {...reveal} className={className}>
      {children}
    </motion.div>
  )
}

const sourceLabel: Record<WoveSource, string> = {
  measured: 'Measured in the storefront',
  verified: 'Verified in the storefront',
  recorded: 'Recorded in the design log',
}

function Figure({ figure, className = '' }: { figure: WoveFigure; className?: string }) {
  return <ZoomFigure image={figure.image} captionLabel={figure.label} portrait={figure.portrait} chrome={figure.chrome} className={className} />
}

// Margin notes: a thin rule, the evidence figure in the display face, the decision and its source.
function Notes({ notes, level = 3 }: { notes: WoveNote[]; level?: 3 | 4 }) {
  const Heading = level === 3 ? 'h3' : 'h4'
  return (
    <ol className="m-0 list-none p-0">
      {notes.map((note, i) => (
        <li key={note.title} className="border-t border-wove-hairline py-5 first:border-t-0 first:pt-0">
          <p className={`m-0 flex items-baseline gap-3 ${smallCaps} text-wove-clay-text`}>
            <span aria-hidden="true" className="font-wove-display text-sm italic normal-case tracking-normal">{String(i + 1).padStart(2, '0')}</span>
            <span>{sourceLabel[note.source]}</span>
          </p>
          {note.figure && <p className="mb-0 mt-3 font-wove-display text-3xl font-light leading-tight tracking-[-0.01em] md:text-4xl">{note.figure}</p>}
          <Heading className="mb-0 mt-2 text-lg font-semibold leading-snug">{note.title}</Heading>
          <p className="mb-0 mt-1.5 leading-relaxed text-wove-secondary">{note.body}</p>
        </li>
      ))}
    </ol>
  )
}

// Phones: a swipeable strip below 768 px so each stays readable, a row above.
// While the strip actually scrolls, it is a focusable region (arrow keys scroll
// it) and a visible hint says there is more to see.
function PhoneRow({ phones, label }: { phones: WoveFigure[]; label: string }) {
  const cols = phones.length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1'
  const ref = useRef<HTMLUListElement>(null)
  const [scrolls, setScrolls] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => setScrolls(el.scrollWidth > el.clientWidth + 2)
    check()
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(check)
      observer.observe(el)
      return () => observer.disconnect()
    }
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return (
    <div>
      <ul
        ref={ref}
        tabIndex={scrolls ? 0 : undefined}
        aria-label={scrolls ? `${label}, scrolls sideways` : label}
        className={`relative -mx-4 flex min-w-0 snap-x snap-mandatory list-none gap-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:overflow-visible md:p-0 md:gap-6 ${cols} ${focus}`}
      >
        {phones.map((figure) => (
          <li key={figure.image.src} className="w-[70%] max-w-[300px] shrink-0 snap-start md:w-auto">
            <Figure figure={figure} />
          </li>
        ))}
      </ul>
      {scrolls && (
        <p aria-hidden="true" className="mb-0 mt-2 flex items-center gap-2 text-sm text-wove-muted">
          Swipe or scroll sideways to see all {phones.length} screens
          <ArrowRight size={14} className="text-wove-clay-text" />
        </p>
      )}
    </div>
  )
}

function ChapterHead({ id, index, label, title, standfirst }: { id: string; index: string; label: string; title: string; standfirst: string }) {
  return (
    <Reveal className="mb-10 grid grid-cols-[auto_1fr] items-start gap-x-5 md:mb-14 md:gap-x-10">
      <span aria-hidden="true" className="font-wove-display text-6xl font-light italic leading-none text-wove-clay-text md:text-8xl">{index}</span>
      <div className="max-w-[46rem] border-t border-wove-ink pt-4">
        <p className={`m-0 ${smallCaps} text-wove-clay-text`}>
          <span className="sr-only">Section {index}: </span>
          {label}
        </p>
        <h2 id={`${id}-title`} className={`${serif} mb-0 mt-3 text-4xl md:text-6xl`}>{title}</h2>
        <p className="mb-0 mt-4 font-wove-display text-xl italic leading-snug text-wove-secondary md:text-2xl">{standfirst}</p>
      </div>
    </Reveal>
  )
}

function Chapter({ chapter, tone, children }: { chapter: WoveChapter; tone: SectionTone; children?: ReactNode }) {
  return (
    <section id={chapter.id} aria-labelledby={`${chapter.id}-title`} className={`${wovenwardTheme.tones[tone]} py-14 md:py-24`}>
      <div className={container}>
        <ChapterHead id={chapter.id} index={chapter.index} label={chapter.label} title={chapter.title} standfirst={chapter.standfirst} />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="min-w-0 lg:col-span-8">
            <Figure figure={chapter.lead} />
          </Reveal>
          <Reveal className="lg:col-span-4">
            <Notes notes={chapter.notes} />
          </Reveal>
        </div>
        {(chapter.supporting.length > 0 || chapter.phones.length > 0) && (
          <div className="mt-12 grid grid-cols-1 items-start gap-10 md:mt-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-12">
            {chapter.phones.length > 0 && (
              <Reveal className={`min-w-0 ${chapter.phones.length > 1 ? 'lg:col-span-5' : 'lg:col-span-3'}`}>
                <PhoneRow phones={chapter.phones} label={`${chapter.label} on a phone`} />
              </Reveal>
            )}
            {chapter.supporting.map((figure) => (
              <Reveal key={figure.image.src} className={`min-w-0 ${chapter.phones.length > 1 ? 'lg:col-span-7' : chapter.phones.length ? 'lg:col-span-9' : 'lg:col-span-6'}`}>
                <Figure figure={figure} />
              </Reveal>
            ))}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

function Opening() {
  const { opening } = wovenward
  const contents = [
    { id: 'experience', index: '01', title: 'The shopping experience' },
    { id: 'discover', index: '02', title: 'Discover what is available' },
    { id: 'fit', index: '03', title: 'Understand how it fits' },
    { id: 'review', index: '04', title: 'Review what you chose' },
    { id: 'identity', index: '05', title: 'Editorial identity, functional design' },
    { id: 'evidence', index: '06', title: 'Evidence and reflection' },
  ]
  return (
    <section aria-labelledby="presentation-title" className={wovenwardTheme.tones.base}>
      <nav aria-label="Case study" className={`${container} pt-6`}>
        <Link to={workLink} state={workState} className={`inline-flex min-h-11 items-center gap-2 rounded text-sm font-medium text-wove-indigo hover:underline ${focus}`}>
          <ArrowLeft size={16} aria-hidden="true" />
          Back to Work
        </Link>
      </nav>
      <div className={`${container} pb-14 pt-8 md:pb-20 md:pt-12`}>
        <Reveal>
          <p className={`m-0 ${smallCaps} text-wove-clay-text`}>{opening.eyebrow}</p>
          <h1 id="presentation-title" className={`mb-0 mt-5 ${wovenwardTheme.title}`}>{opening.title}</h1>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <p className={`m-0 ${wovenwardTheme.subtitle}`}>{opening.subtitle}</p>
            <p className="mb-0 mt-6 max-w-[48ch] text-lg leading-relaxed text-wove-secondary">{opening.lede}</p>
            <dl className="m-0 mt-8 border-t border-wove-ink">
              {opening.meta.map((item) => (
                <div key={item.label} className="grid grid-cols-[7rem_1fr] gap-4 border-b border-wove-hairline py-3">
                  <dt className={`${smallCaps} pt-0.5 text-wove-muted`}>{item.label}</dt>
                  <dd className="m-0 font-medium leading-snug">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal className="min-w-0 lg:col-span-7">
            <Figure figure={opening.hero} />
          </Reveal>
        </div>
        <Reveal className="mt-14 grid grid-cols-1 gap-8 border-t border-wove-ink pt-6 md:mt-20 lg:grid-cols-12 lg:gap-12">
          <h2 className={`m-0 ${smallCaps} text-wove-clay-text lg:col-span-3`}>{opening.contentsLabel}</h2>
          <ol className="m-0 grid list-none grid-cols-1 gap-x-10 p-0 sm:grid-cols-2 lg:col-span-9">
            {contents.map((entry) => (
              <li key={entry.id} className="border-b border-wove-hairline">
                <a
                  href={`#${entry.id}`}
                  onClick={(event) => {
                    // Hash routing: scroll in place rather than changing the route.
                    event.preventDefault()
                    document.getElementById(entry.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className={`group flex min-h-12 items-baseline gap-4 py-3 ${focus}`}
                >
                  <span className="font-wove-display text-lg italic text-wove-clay-text">{entry.index}</span>
                  <span className="flex-1 font-wove-display text-xl leading-snug group-hover:underline">{entry.title}</span>
                  <ArrowRight size={14} aria-hidden="true" className="text-wove-clay-text" />
                </a>
              </li>
            ))}
          </ol>
          <p className="m-0 text-sm leading-relaxed text-wove-muted lg:col-span-9 lg:col-start-4">{opening.note}</p>
        </Reveal>
      </div>
    </section>
  )
}

function Experience() {
  const { experience } = wovenward
  return (
    <section id="experience" aria-labelledby="experience-title" className={`${wovenwardTheme.tones.alt} py-14 md:py-24`}>
      <div className={container}>
        <ChapterHead id="experience" index="01" label="The shopping experience" title={experience.title} standfirst={experience.challenge} />
        <Reveal className="min-w-0">
          <DemoVideo video={experience.video} descriptionSummary={experience.descriptionSummary} />
        </Reveal>
      </div>
    </section>
  )
}

function Fit() {
  const { fit } = wovenward
  return (
    <Chapter chapter={fit} tone="alt">
      <Reveal className="mt-14 border-t border-wove-ink pt-6 md:mt-20">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <p className={`m-0 ${smallCaps} text-wove-clay-text`}>{fit.sequence.label}</p>
            <p className="mb-0 mt-3 font-wove-display text-2xl font-light leading-snug md:text-3xl">{fit.sequence.caption}</p>
            <p className={`mb-0 mt-4 ${smallCaps} text-wove-clay-text`}>{sourceLabel.measured}</p>
          </div>
          <ol aria-label="Add to bag without a size, on a phone" className="m-0 grid list-none grid-cols-1 items-center justify-items-center gap-4 p-0 sm:grid-cols-[1fr_auto_1fr] sm:gap-6 lg:col-span-8">
            <li className="w-full min-w-0 max-w-[280px] sm:max-w-[300px] sm:justify-self-end">
              <Figure figure={fit.sequence.before} />
            </li>
            <li aria-hidden="true" className="text-wove-clay">
              <ArrowDown size={28} className="sm:hidden" />
              <ArrowRight size={28} className="hidden sm:block" />
            </li>
            <li className="w-full min-w-0 max-w-[280px] sm:max-w-[300px] sm:justify-self-start">
              <Figure figure={fit.sequence.after} />
            </li>
          </ol>
        </div>
      </Reveal>
    </Chapter>
  )
}

function Identity() {
  const { identity } = wovenward
  return (
    <section id="identity" aria-labelledby="identity-title" className={`${wovenwardTheme.tones.alt} py-14 md:py-24`}>
      <div className={container}>
        <ChapterHead id="identity" index="05" label="Identity" title={identity.title} standfirst={identity.standfirst} />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12">
          <Reveal className="min-w-0 lg:col-span-7">
            <h3 className={`m-0 ${smallCaps} text-wove-clay-text`}>Type</h3>
            <ul className="m-0 mt-3 list-none p-0">
              {identity.type.map((face, i) => (
                <li key={face.name} className="border-t border-wove-hairline py-5">
                  <p className={i === 0 ? `${serif} m-0 text-4xl md:text-6xl` : 'm-0 text-lg font-medium tabular-nums md:text-xl'}>{face.sample}</p>
                  <p className="mb-0 mt-2 text-sm text-wove-muted">
                    <span className="font-semibold text-wove-ink">{face.name}</span> · {face.role}
                  </p>
                </li>
              ))}
            </ul>
            <h3 className={`mb-0 mt-8 ${smallCaps} text-wove-clay-text`}>Colour and contrast</h3>
            <table className="mt-3 w-full border-collapse text-left text-sm">
              <caption className="sr-only">Palette with roles and contrast on porcelain</caption>
              <thead>
                <tr className="border-b border-wove-ink">
                  <th scope="col" className="py-2 pr-3 font-semibold">Colour</th>
                  <th scope="col" className="hidden py-2 pr-3 font-semibold sm:table-cell">Role</th>
                  <th scope="col" className="py-2 font-semibold">Contrast</th>
                </tr>
              </thead>
              <tbody>
                {identity.palette.map((colour) => (
                  <tr key={colour.hex} className="border-b border-wove-hairline">
                    <td className="py-2.5 pr-3">
                      <span className="flex items-center gap-3">
                        <span aria-hidden="true" className="h-5 w-5 shrink-0 rounded-full border border-wove-control" style={{ backgroundColor: colour.hex }} />
                        <span>
                          <span className="block font-semibold">{colour.name}</span>
                          <span className="block font-mono text-xs text-wove-muted">{colour.hex}</span>
                        </span>
                      </span>
                    </td>
                    <td className="hidden py-2.5 pr-3 text-wove-secondary sm:table-cell">{colour.role}</td>
                    <td className="py-2.5 text-wove-secondary">{colour.contrast}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <Reveal className="lg:col-span-5">
            <h3 className={`mb-5 mt-0 ${smallCaps} text-wove-clay-text`}>Responsive refinements</h3>
            <Notes notes={identity.refinements} level={4} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Evidence() {
  const { evidence } = wovenward
  return (
    <section id="evidence" aria-labelledby="evidence-title" className={`${wovenwardTheme.tones.accent} py-14 md:py-24`}>
      <div className={container}>
        <Reveal className="mb-10 grid grid-cols-[auto_1fr] items-start gap-x-5 md:mb-14 md:gap-x-10">
          <span aria-hidden="true" className="font-wove-display text-6xl font-light italic leading-none text-wove-clay md:text-8xl">06</span>
          <div className="max-w-[46rem] border-t border-wove-porcelain pt-4">
            <p className={`m-0 ${smallCaps} text-[#C9C5BC]`}>
              <span className="sr-only">Section 06: </span>
              Evidence and reflection
            </p>
            <h2 id="evidence-title" className={`${serif} mb-0 mt-3 text-4xl md:text-6xl`}>{evidence.title}</h2>
            <p className="mb-0 mt-4 font-wove-display text-xl italic leading-snug text-[#C9C5BC] md:text-2xl">{evidence.standfirst}</p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="min-w-0 lg:col-span-7">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Automated checks: recorded results and the re-run for this page</caption>
              <thead>
                <tr className="border-b border-wove-porcelain">
                  <th scope="col" className={`py-2 pr-3 ${smallCaps} text-[#C9C5BC]`}>Check</th>
                  <th scope="col" className={`py-2 pr-3 ${smallCaps} text-[#C9C5BC]`}>Oct 4, 2026</th>
                  <th scope="col" className={`py-2 ${smallCaps} text-[#C9C5BC]`}>Re-run Nov 23</th>
                </tr>
              </thead>
              <tbody>
                {evidence.checks.map((check) => (
                  <tr key={check.label} className="border-b border-[#474A44] align-top">
                    <th scope="row" className="py-3 pr-3 font-semibold">{check.label}</th>
                    <td className="py-3 pr-3 font-wove-display text-lg">{check.recorded}</td>
                    <td className="py-3 font-wove-display text-lg">{check.rerun}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className={`mb-2 mt-8 ${smallCaps} text-[#C9C5BC]`}>Not yet done</p>
            <ul className="m-0 list-disc space-y-1 pl-5 text-[#C9C5BC]">
              {evidence.notDone.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </Reveal>
          <Reveal className="lg:col-span-5">
            <p className="m-0 border-l-2 border-wove-clay pl-4 font-wove-display text-2xl font-light leading-snug">{evidence.learned}</p>
            <h3 className="mb-3 mt-10 text-lg font-semibold">What I’d test next</h3>
            <ol className="m-0 list-decimal space-y-2 pl-5 leading-relaxed text-[#C9C5BC]">
              {evidence.next.map((question) => <li key={question}>{question}</li>)}
            </ol>
            <PresentationActions contactLabel={evidence.contactLabel} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default function WovenwardCaseStudy() {
  useEffect(() => {
    window.scrollTo(0, 0)
    const previous = document.title
    document.title = 'Wovenward · Andrew Dumitru'
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <PresentationThemeContext.Provider value={wovenwardTheme}>
      <div className="font-wove-body text-wove-ink antialiased">
        <main>
          <Opening />
          <Experience />
          <Chapter chapter={wovenward.discover} tone="base" />
          <Fit />
          <Chapter chapter={wovenward.review} tone="base" />
          <Identity />
          <Evidence />
        </main>
      </div>
    </PresentationThemeContext.Provider>
  )
}
