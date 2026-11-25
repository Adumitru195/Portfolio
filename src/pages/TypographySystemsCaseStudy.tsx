import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'
import { ArrowDown, ArrowLeft, ArrowsOut, CaretDown, Scissors } from '@phosphor-icons/react'
import '@fontsource-variable/bodoni-moda/opsz.css'
import '@fontsource-variable/bodoni-moda/opsz-italic.css'
import '@fontsource-variable/instrument-sans'
import { typographySystems as content } from '@/data/typography-systems'
import PageViewer, { useViewer } from '@/components/typography/PageViewer'
import DemoVideo, { type DemoVideoStyles } from '@/components/presentation/DemoVideo'
import type { BookSelection, Comparison, EditorialNote, PrintPage, ViewerItem } from '@/types/typography'

type Tone = 'paper' | 'band' | 'white' | 'ink'

// Same destination as the other presentations' "Back to Work" (the Work section on the homepage).
const workLink = { pathname: '/' }
const workState = { scrollTo: 'work' }

// Each tone sets the muted, accent and rule colours its children use.
const tones: Record<Tone, string> = {
  paper: 'bg-type-paper text-type-text [--t-muted:#5C544E] [--t-accent:#7D1C24] [--t-rule:#D2C9BB]',
  band: 'bg-type-band text-type-text [--t-muted:#5C544E] [--t-accent:#7D1C24] [--t-rule:#CFC5B6]',
  white: 'bg-type-white text-type-text [--t-muted:#5C544E] [--t-accent:#7D1C24] [--t-rule:#E2DBD0]',
  ink: 'bg-type-ink text-type-paper [--t-muted:#BDB4AB] [--t-accent:#E5A3A9] [--t-rule:#3A3431]',
}

const display = 'font-type-display font-normal'
const headline = `${display} text-4xl leading-[1.02] tracking-tighter md:text-6xl`
const eyebrow = 'text-xs font-semibold uppercase tracking-[0.16em]'
const muted = 'text-[color:var(--t-muted)]'
const accent = 'text-[color:var(--t-accent)]'
const rule = 'border-[color:var(--t-rule)]'
const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--t-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-transparent'

// Phones show a spread's printed pages one at a time in the viewer, so the
// type stays large enough to read without panning across a whole spread.
const NARROW = '(max-width: 767px)'

/* Viewer --------------------------------------------------------------- */

interface ViewerRequest {
  items: ViewerItem[]
  label: string
  index: number
}

const OpenViewerContext = createContext<(request: ViewerRequest, trigger: HTMLElement) => void>(() => undefined)

/** A page as a viewer item; a crop or partial page carries its adaptation in the label. */
function pageItem(page: PrintPage): ViewerItem {
  return { ...page, label: page.adaptation ? `${page.label} · ${page.adaptation}` : page.label }
}

/** Replaces each spread with its two printed pages, keeping the selected position. */
function splitSpreads(request: ViewerRequest): ViewerRequest {
  const items: ViewerItem[] = []
  let index = 0
  request.items.forEach((item, i) => {
    if (i === request.index) index = items.length
    if (item.halves) items.push(...item.halves)
    else items.push(item)
  })
  return { ...request, items, index }
}

/* Motion --------------------------------------------------------------- */

/**
 * Fades content up once as it scrolls into view. With reduced motion, or where
 * IntersectionObserver is unavailable, content renders in place with no
 * hidden starting state, so it can never be left invisible.
 */
function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotionPreference()
  const canObserve = typeof window !== 'undefined' && 'IntersectionObserver' in window
  const animate = !reduce && canObserve
  return (
    <motion.div
      className={className}
      initial={animate ? { opacity: 0, y: 28 } : false}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{
        y: { type: 'spring', stiffness: 100, damping: 20, delay },
        opacity: { duration: 0.5, ease: 'easeOut', delay },
      }}
    >
      {children}
    </motion.div>
  )
}

/* Building blocks ------------------------------------------------------ */

interface ArtworkProps {
  page: PrintPage
  /** Viewer contents; defaults to this page alone. */
  items?: ViewerItem[]
  index?: number
  viewerLabel: string
  sizes: string
  eager?: boolean
  className?: string
  dark?: boolean
}

/** Print artwork on white paper. The whole image is a button that opens the enlarged viewer. */
function Artwork({ page, items, index = 0, viewerLabel, sizes, eager = false, className = '', dark = false }: ArtworkProps) {
  const openViewer = useContext(OpenViewerContext)
  const srcSet = [
    page.smallWidth < page.width ? `${page.small} ${page.smallWidth}w` : null,
    `${page.src} ${page.width}w`,
    `${page.large} ${page.largeWidth}w`,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={(event) =>
        openViewer({ items: items ?? [pageItem(page)], label: viewerLabel, index }, event.currentTarget)
      }
      className={`group relative block w-full text-left ${focusRing} ${className}`}
    >
      <span
        className={`block overflow-hidden bg-white transition-transform duration-500 ease-out motion-safe:group-hover:-translate-y-1.5 ${
          dark
            ? 'shadow-[0_34px_60px_-28px_rgba(0,0,0,0.75)]'
            : 'shadow-[0_30px_60px_-34px_rgba(74,52,38,0.45)] ring-1 ring-[rgba(74,52,38,0.08)]'
        }`}
      >
        <img
          src={page.src}
          srcSet={srcSet}
          sizes={sizes}
          alt={page.alt}
          width={page.width}
          height={page.height}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="block h-auto w-full"
        />
      </span>
      <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-type-ink/85 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100">
        <ArrowsOut size={14} aria-hidden="true" />
        <span className="hidden sm:inline">Enlarge</span>
        <span className="sr-only">Enlarge: {page.title}</span>
      </span>
    </button>
  )
}

function Caption({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`m-0 mt-3 text-sm leading-snug ${muted} ${className}`}>{children}</p>
}

/** States plainly when published artwork is not the whole original page. */
function Adaptation({ page }: { page: PrintPage }) {
  if (!page.adaptation) return null
  return (
    <p className={`m-0 mt-2 flex items-start gap-2 text-xs font-medium leading-snug ${accent}`}>
      <Scissors size={14} aria-hidden="true" className="mt-px shrink-0" />
      {page.adaptation}
    </p>
  )
}

interface SectionProps {
  id: string
  tone: Tone
  index: string
  label: string
  title: string
  intro?: string
  children: ReactNode
}

function Section({ id, tone, index, label, title, intro, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`${tones[tone]} py-16 md:py-24`}>
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 md:px-10">
        <Reveal className="mb-10 grid grid-cols-1 gap-6 md:mb-14 lg:grid-cols-12">
          <header className="lg:col-span-7">
            <p className={`${eyebrow} mb-6 flex items-center gap-3 border-t ${rule} pt-4 ${accent}`}>
              <span className="tabular-nums">
                <span className="sr-only">Section </span>
                {index}
              </span>
              <span aria-hidden="true">/</span>
              <span>{label}</span>
            </p>
            <h2 id={`${id}-title`} className={`${headline} m-0 max-w-[18ch]`}>
              {title}
            </h2>
          </header>
          {intro && <p className={`m-0 self-end text-lg leading-relaxed lg:col-span-5 ${muted}`}>{intro}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  )
}

function Notes({ notes, columns = 2 }: { notes: EditorialNote[]; columns?: 1 | 2 }) {
  return (
    <ul className={`m-0 grid list-none grid-cols-1 gap-x-12 gap-y-10 p-0 ${columns === 2 ? 'md:grid-cols-2' : ''}`}>
      {notes.map((note, i) => (
        <li key={note.heading}>
          <Reveal delay={(i % 2) * 0.06} className={`border-t ${rule} pt-5`}>
            <p className={`${eyebrow} mb-3 ${accent}`}>{note.eyebrow}</p>
            <h3 className={`${display} m-0 mb-3 text-2xl leading-tight md:text-3xl`}>{note.heading}</h3>
            <p className={`m-0 max-w-[58ch] leading-relaxed ${muted}`}>{note.body}</p>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}

/* Opening -------------------------------------------------------------- */

function Opening() {
  const { opening } = content
  const [first, second] = opening.title.split(' the ')
  return (
    <section aria-labelledby="typography-title" className={`${tones.paper} relative overflow-hidden`}>
      <nav aria-label="Case study" className="mx-auto max-w-[1320px] px-4 pt-6 sm:px-6 md:px-10">
        <Link
          to={workLink}
          state={workState}
          className={`inline-flex items-center gap-2 text-sm font-medium ${accent} hover:underline ${focusRing}`}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to work
        </Link>
      </nav>

      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-4 pb-16 pt-10 sm:px-6 md:px-10 md:pb-24 md:pt-14 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col lg:col-span-7">
          <Reveal>
            <p className={`${eyebrow} mb-8 flex items-center gap-3 ${accent}`}>
              <span aria-hidden="true" className="block h-px w-10 bg-current" />
              {opening.eyebrow}
            </p>
            <p className={`${eyebrow} mb-3 ${muted}`}>Typography Systems</p>
            <h1
              id="typography-title"
              className={`${display} m-0 text-[clamp(3.75rem,13vw,10rem)] leading-[0.9] tracking-tighter`}
            >
              {first}
              <br />
              <span className="italic">the {second}</span>
            </h1>
            <p className={`${display} mt-8 max-w-[26ch] text-2xl leading-snug md:text-3xl ${accent}`}>{opening.lede}</p>
          </Reveal>

          <Reveal delay={0.1} className="mt-auto pt-10">
            <dl className={`m-0 grid grid-cols-2 gap-x-6 gap-y-5 border-t ${rule} pt-6 sm:grid-cols-3`}>
              {opening.meta.map((item) => (
                <div key={item.label}>
                  <dt className={`${eyebrow} mb-1 ${muted}`}>{item.label}</dt>
                  <dd className="m-0 text-sm font-medium">{item.value}</dd>
                </div>
              ))}
            </dl>
            <p className={`m-0 mt-6 max-w-[62ch] text-sm leading-relaxed ${muted}`}>{opening.notice}</p>
            <a
              href="#publications"
              className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold underline decoration-[color:var(--t-accent)] underline-offset-[6px] hover:no-underline ${focusRing}`}
            >
              Watch the publication walkthrough
              <ArrowDown size={16} aria-hidden="true" />
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="w-full max-w-[460px] sm:ml-auto lg:col-span-5 lg:ml-0 lg:max-w-none lg:pt-6">
          <figure className="m-0">
            <div className="bg-type-burgundy p-5 sm:p-8 md:p-10">
              <Artwork
                page={opening.cover}
                viewerLabel="Book 2 — ONE-X editorial study"
                sizes="(min-width: 1024px) 440px, (min-width: 640px) 560px, 90vw"
                eager
                dark
              />
            </div>
            <figcaption className={`mt-3 flex justify-between gap-4 text-sm ${muted}`}>
              <span>ONE-X, front cover</span>
              <span>Book 2</span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}

/* 01 The publications -------------------------------------------------- */

// The walkthrough sits on the white tone, so the player borrows the paper, rule and burgundy.
const walkthroughStyles: DemoVideoStyles = {
  frame: 'border border-[color:var(--t-rule)] bg-type-white shadow-[0_30px_60px_-34px_rgba(74,52,38,0.45)]',
  surface: 'bg-type-band',
  badge: 'bg-type-ink text-type-paper shadow-[0_12px_30px_-10px_rgba(74,52,38,0.55)]',
  control: 'border-type-text/50 hover:border-type-burgundy hover:text-type-burgundy',
  focusRing: 'focus-visible:ring-[color:var(--t-accent)] focus-visible:ring-offset-type-white',
  muted,
}

function Publications() {
  const { publications } = content
  const { walkthrough } = publications
  return (
    <Section id="publications" tone="white" index="01" label="The publications" title={publications.title} intro={publications.intro}>
      <article
        aria-labelledby="publication-walkthrough-title"
        className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-14"
      >
        <Reveal className="lg:col-span-4">
          <p className={`${eyebrow} mb-4 ${accent}`}>{walkthrough.eyebrow}</p>
          <h3 id="publication-walkthrough-title" className={`${display} m-0 mb-5 text-3xl leading-tight md:text-4xl`}>
            {walkthrough.title}
          </h3>
          <p className={`m-0 max-w-[58ch] leading-relaxed ${muted}`}>{walkthrough.body}</p>
        </Reveal>
        <div className="lg:col-span-8">
          <DemoVideo video={walkthrough.video} styles={walkthroughStyles} descriptionSummary={walkthrough.descriptionSummary} />
        </div>
      </article>

      <ul className="m-0 mt-16 grid list-none grid-cols-1 gap-12 p-0 md:mt-20 md:grid-cols-2 md:gap-10 lg:gap-16">
        {publications.studies.map((study, i) => (
          <li key={study.number}>
            <Reveal delay={i * 0.08}>
              <article>
                <Artwork
                  page={study.image}
                  viewerLabel={study.name}
                  sizes="(min-width: 1024px) 600px, (min-width: 768px) 50vw, 100vw"
                />
                <p className={`${eyebrow} mb-2 mt-6 ${accent}`}>{study.number}</p>
                <p className={`m-0 mb-2 text-sm font-semibold ${muted}`}>{study.name}</p>
                <h3 className={`${display} m-0 mb-3 text-3xl leading-tight md:text-4xl`}>{study.heading}</h3>
                <p className={`m-0 max-w-[52ch] leading-relaxed ${muted}`}>{study.body}</p>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}

/* 02 Hierarchy through variation -------------------------------------- */

function LeverHeading({ comparison }: { comparison: Comparison }) {
  return (
    <div className={`mb-5 flex items-baseline justify-between gap-4 border-t ${rule} pt-4`}>
      <h3 className={`${display} m-0 text-3xl italic md:text-4xl ${accent}`}>{comparison.lever}</h3>
      <span className={`text-right text-xs uppercase tracking-[0.12em] ${muted}`}>{comparison.page.label}</span>
    </div>
  )
}

function Hierarchy() {
  const { hierarchy } = content
  const all = [...hierarchy.pages, ...hierarchy.spreads]
  const items = all.map((c) => ({ ...pageItem(c.page), title: `${c.lever}: ${c.page.title}` }))
  const label = 'Book 1 — Hierarchy through variation'
  return (
    <Section id="hierarchy" tone="ink" index="02" label="Book 1 · Hierarchy through variation" title={hierarchy.title} intro={hierarchy.intro}>
      <Reveal className={`mb-14 grid grid-cols-1 gap-4 border-l-2 border-type-burgundy pl-6 md:mb-16 md:pl-10 lg:grid-cols-12`}>
        <p className={`${eyebrow} m-0 ${accent} lg:col-span-12`}>{hierarchy.contentNote.eyebrow}</p>
        <h3 className={`${display} m-0 text-3xl leading-tight md:text-4xl lg:col-span-5`}>{hierarchy.contentNote.heading}</h3>
        <p className={`m-0 max-w-[60ch] text-lg leading-relaxed ${muted} lg:col-span-6 lg:col-start-7`}>
          {hierarchy.contentNote.body}
        </p>
      </Reveal>

      <ul className="m-0 grid list-none grid-cols-1 gap-x-10 gap-y-12 p-0 sm:grid-cols-3">
        {hierarchy.pages.map((comparison, i) => (
          <li key={comparison.lever} className={i === 1 ? 'sm:mt-16' : i === 2 ? 'sm:mt-32' : ''}>
            <Reveal delay={i * 0.06}>
              <LeverHeading comparison={comparison} />
              <Artwork
                page={comparison.page}
                items={items}
                index={i}
                viewerLabel={label}
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 33vw, 18rem"
                className="max-w-[18rem] sm:max-w-none"
                dark
              />
              <Caption>{comparison.note}</Caption>
            </Reveal>
          </li>
        ))}
      </ul>

      <ul className="m-0 mt-16 grid list-none grid-cols-1 gap-x-10 gap-y-12 p-0 md:grid-cols-2">
        {hierarchy.spreads.map((comparison, i) => (
          <li key={comparison.lever} className={i === 1 ? 'md:mt-16' : ''}>
            <Reveal delay={i * 0.08}>
              <LeverHeading comparison={comparison} />
              <Artwork
                page={comparison.page}
                items={items}
                index={hierarchy.pages.length + i}
                viewerLabel={label}
                sizes="(min-width: 1024px) 620px, (min-width: 768px) 50vw, 100vw"
                dark
              />
              <Caption className="max-w-[52ch]">{comparison.note}</Caption>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal className="mt-12">
        <p className={`m-0 max-w-[70ch] text-sm leading-relaxed ${muted}`}>{hierarchy.typefaceNote}</p>
      </Reveal>
    </Section>
  )
}

/* 03 Building an editorial identity ---------------------------------- */

function Identity() {
  const { identity } = content
  return (
    <Section id="one-x" tone="paper" index="03" label="ONE-X · Editorial identity" title={identity.title} intro={identity.intro}>
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-8 lg:order-2">
          <Artwork
            page={identity.coverSpread}
            items={[pageItem(identity.coverSpread)]}
            viewerLabel="Book 2 — ONE-X editorial study"
            sizes="(min-width: 1024px) 840px, 100vw"
          />
          <Caption>{identity.coverSpreadCaption}</Caption>
        </Reveal>
        <Reveal delay={0.06} className="lg:col-span-4 lg:order-1">
          <h3 className={`${eyebrow} m-0 mb-4 border-t ${rule} pt-5 ${accent}`}>Recurring elements</h3>
          <ul className="m-0 list-none space-y-3 p-0">
            {identity.elements.map((element) => (
              <li key={element} className="flex gap-3 leading-relaxed">
                <span aria-hidden="true" className="mt-[0.7em] block h-px w-5 shrink-0 bg-type-burgundy" />
                {element}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal className={`mt-14 grid grid-cols-1 gap-10 border-t ${rule} pt-8 md:grid-cols-2`}>
        <div>
          <h3 className={`${eyebrow} m-0 mb-5 ${accent}`}>Palette</h3>
          <ul className="m-0 flex list-none flex-wrap gap-6 p-0">
            {identity.swatches.map((swatch) => (
              <li key={swatch.hex} className="w-28">
                <span
                  aria-hidden="true"
                  className="mb-3 block h-16 ring-1 ring-[rgba(74,52,38,0.15)]"
                  style={{ backgroundColor: swatch.hex }}
                />
                <span className="block text-sm font-semibold">{swatch.name}</span>
                <span className={`block font-mono text-xs ${muted}`}>{swatch.hex}</span>
              </li>
            ))}
          </ul>
          <p className={`m-0 mt-4 text-sm ${muted}`}>{identity.swatchNote}</p>
        </div>
        <div>
          <h3 className={`${eyebrow} m-0 mb-5 ${accent}`}>Type in the document</h3>
          <p className={`${display} m-0 text-3xl leading-snug md:text-4xl`}>
            {identity.typefaces.map((face, i) => (
              <span key={face}>
                {face}
                {i < identity.typefaces.length - 1 && (
                  <span aria-hidden="true" className={accent}>
                    {' · '}
                  </span>
                )}
              </span>
            ))}
          </p>
          <p className={`m-0 mt-4 text-sm ${muted}`}>{identity.typefaceNote}</p>
        </div>
      </Reveal>
    </Section>
  )
}

/* 04 Consistency and compositional rhythm ----------------------------- */

function Rhythm() {
  const { rhythm } = content
  const label = 'Book 2 — ONE-X rhythm across pages'
  const pages = [...rhythm.names, ...rhythm.sequence.map((s) => s.page)]
  const items = pages.map(pageItem)
  return (
    <Section id="rhythm" tone="white" index="04" label="ONE-X · Consistency and rhythm" title={rhythm.title} intro={rhythm.intro}>
      <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-12">
        {rhythm.names.map((page, i) => (
          <Reveal key={page.id} delay={i * 0.08} className={i === 0 ? 'md:col-span-7' : 'md:col-span-5'}>
            <Artwork
              page={page}
              items={items}
              index={i}
              viewerLabel={label}
              sizes={i === 0 ? '(min-width: 1024px) 720px, (min-width: 768px) 58vw, 100vw' : '(min-width: 1024px) 520px, (min-width: 768px) 42vw, 100vw'}
            />
            <Caption>{page.title}</Caption>
            <Adaptation page={page} />
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-8 grid grid-cols-1 lg:grid-cols-12">
        <p className={`m-0 max-w-[62ch] text-lg leading-relaxed ${muted} lg:col-span-8`}>{rhythm.namesNote}</p>
      </Reveal>

      <ul className="m-0 mt-16 grid list-none grid-cols-1 items-end gap-10 p-0 sm:grid-cols-2 lg:grid-cols-12">
        {rhythm.sequence.map((entry, i) => (
          <li
            key={entry.page.id}
            className={i === 1 ? 'sm:col-span-2 sm:row-start-2 lg:col-span-6 lg:row-start-auto' : 'lg:col-span-3'}
          >
            <Reveal delay={i * 0.06}>
              <Artwork
                page={entry.page}
                items={items}
                index={rhythm.names.length + i}
                viewerLabel={label}
                sizes={i === 1 ? '(min-width: 1024px) 620px, 100vw' : '(min-width: 1024px) 300px, (min-width: 640px) 50vw, 18rem'}
                className={i === 1 ? '' : 'max-w-[18rem] sm:max-w-none'}
              />
              <Caption>{entry.caption}</Caption>
              <Adaptation page={entry.page} />
            </Reveal>
          </li>
        ))}
      </ul>

      <div className="mt-16">
        <Notes notes={rhythm.notes} />
      </div>
    </Section>
  )
}

/* 05 Trade-offs and reflection ---------------------------------------- */

function Reflection() {
  const { reflection } = content
  return (
    <Section id="reflection" tone="paper" index="05" label="Trade-offs and reflection" title={reflection.title}>
      <Reveal className={`mb-12 flex max-w-[70ch] gap-4 border-l-2 border-type-burgundy pl-5`}>
        <p className="m-0 leading-relaxed">
          <span className={`${eyebrow} mb-2 block ${accent}`}>Retrospective analysis</span>
          <span className={muted}>{reflection.analysisNote}</span>
        </p>
      </Reveal>
      <Notes notes={reflection.notes} />
      <Reveal className="mt-14 grid grid-cols-1 gap-6 bg-type-band p-6 sm:p-10 lg:grid-cols-12">
        <h3 className={`${eyebrow} m-0 lg:col-span-3 ${accent}`}>Potential refinements</h3>
        <ul className="m-0 grid list-none grid-cols-1 gap-x-10 gap-y-4 p-0 sm:grid-cols-2 lg:col-span-9">
          {reflection.refinements.map((item) => (
            <li key={item} className="flex gap-3 text-lg leading-snug">
              <span aria-hidden="true" className="mt-[0.75em] block h-px w-5 shrink-0 bg-type-burgundy" />
              {item}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  )
}

/* Selected pages (optional, collapsed) ------------------------------- */

function Gallery({ book }: { book: BookSelection }) {
  const items = book.pages.map(pageItem)
  return (
    <section aria-labelledby={`${book.id}-title`} className="mt-12 first:mt-0">
      <div className={`mb-8 grid grid-cols-1 gap-3 border-t ${rule} pt-6 md:grid-cols-12`}>
        <h3 id={`${book.id}-title`} className={`${display} m-0 text-3xl leading-tight md:col-span-6 md:text-4xl`}>
          {book.title}
        </h3>
        <p className={`m-0 max-w-[60ch] leading-relaxed ${muted} md:col-span-6`}>{book.description}</p>
      </div>
      <ol className="m-0 grid list-none grid-cols-1 gap-x-5 gap-y-8 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {book.pages.map((page, i) => (
          <li key={page.id}>
            <GalleryTile page={page} index={i} items={items} viewerLabel={book.title} />
          </li>
        ))}
      </ol>
    </section>
  )
}

/** A page in a spread-shaped frame, so single pages, spreads and crops align without cropping further. */
function GalleryTile({ page, index, items, viewerLabel }: { page: PrintPage; index: number; items: ViewerItem[]; viewerLabel: string }) {
  const openViewer = useContext(OpenViewerContext)
  const kind = page.kind === 'single' ? 'Single page' : page.kind === 'spread' ? 'Two-page spread' : 'Cropped detail'
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={(event) => openViewer({ items, label: viewerLabel, index }, event.currentTarget)}
      className={`group block w-full text-left ${focusRing}`}
    >
      <span className="flex aspect-[1152/792] items-center justify-center overflow-hidden bg-[#DCD4C6] p-2">
        <img
          src={page.small}
          srcSet={page.smallWidth < page.width ? `${page.small} ${page.smallWidth}w, ${page.src} ${page.width}w` : undefined}
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
          alt={page.alt}
          width={page.smallWidth}
          height={Math.round((page.smallWidth * page.height) / page.width)}
          loading="lazy"
          decoding="async"
          className="block h-auto max-h-full w-auto max-w-full bg-white shadow-[0_18px_30px_-22px_rgba(74,52,38,0.55)] transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.025]"
        />
      </span>
      <span className="mt-3 flex items-baseline gap-3">
        <span className={`${display} text-xl tabular-nums ${accent}`} aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="min-w-0">
          <span className="block font-medium leading-snug group-hover:underline group-hover:decoration-[color:var(--t-accent)] group-hover:underline-offset-4">
            {page.title}
          </span>
          <span className={`block text-xs ${muted}`}>
            {page.label} · {kind}
          </span>
          {page.adaptation && <span className={`mt-1 block text-xs font-medium ${accent}`}>{page.adaptation}</span>}
        </span>
      </span>
    </button>
  )
}

function SelectedPages() {
  const { selection } = content
  return (
    <section id="selected-pages" aria-labelledby="selected-pages-title" className={`${tones.band} py-16 md:py-20`}>
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <h2 id="selected-pages-title" className={`${display} m-0 text-4xl leading-tight tracking-tight md:text-5xl lg:col-span-5`}>
            {selection.title}
          </h2>
          <p className={`m-0 self-end leading-relaxed ${muted} lg:col-span-7`}>
            {selection.intro} <span className="md:hidden">{selection.phoneNote}</span>
          </p>
        </div>
        <details className="group/details mt-8">
          <summary
            className={`flex w-full cursor-pointer list-none items-center justify-between gap-4 border-y ${rule} py-5 text-lg font-semibold marker:hidden [&::-webkit-details-marker]:hidden ${focusRing}`}
          >
            {selection.toggle}
            <CaretDown
              size={20}
              aria-hidden="true"
              className={`shrink-0 transition-transform duration-200 group-open/details:rotate-180 ${accent}`}
            />
          </summary>
          <div className="pt-10">
            {selection.books.map((book) => (
              <Gallery key={book.id} book={book} />
            ))}
          </div>
        </details>
      </div>
    </section>
  )
}

/* Closing -------------------------------------------------------------- */

function Closing() {
  const { sources } = content
  return (
    <section aria-labelledby="sources-title" className={`${tones.ink} py-16 md:py-20`}>
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-10 px-4 sm:px-6 md:px-10 lg:grid-cols-12">
        <h2 id="sources-title" className={`${eyebrow} m-0 ${accent} lg:col-span-3`}>
          {sources.title}
        </h2>
        <div className="lg:col-span-8 lg:col-start-5">
          <ul className="m-0 list-none space-y-4 p-0">
            {sources.items.map((item) => (
              <li key={item} className={`border-t ${rule} pt-4 leading-relaxed ${muted}`}>
                {item}
              </li>
            ))}
          </ul>
          <Link
            to={workLink}
            state={workState}
            className="mt-10 inline-flex items-center gap-2 bg-type-paper px-5 py-3.5 font-semibold text-type-text transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-type-paper focus-visible:ring-offset-2 focus-visible:ring-offset-type-ink"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            Back to Work
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function TypographySystemsCaseStudy() {
  const viewer = useViewer()
  const [request, setRequest] = useState<Omit<ViewerRequest, 'index'>>({ items: [], label: '' })

  const openViewer = useCallback(
    (next: ViewerRequest, trigger: HTMLElement) => {
      const narrow = typeof window.matchMedia === 'function' && window.matchMedia(NARROW).matches
      const shown = narrow ? splitSpreads(next) : next
      setRequest({ items: shown.items, label: shown.label })
      viewer.open(shown.index, trigger)
    },
    [viewer.open],
  )

  useEffect(() => {
    const previous = document.title
    document.title = 'Typography Systems · Andrew Dumitru'
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <OpenViewerContext.Provider value={openViewer}>
      <div className="font-type-body antialiased">
        <main>
          <Opening />
          <Publications />
          <Hierarchy />
          <Identity />
          <Rhythm />
          <Reflection />
          <SelectedPages />
          <Closing />
        </main>
      </div>
      <PageViewer
        items={request.items}
        index={viewer.index}
        onIndexChange={viewer.setIndex}
        onClose={viewer.close}
        label={request.label}
      />
    </OpenViewerContext.Provider>
  )
}
