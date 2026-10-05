import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { MotionConfig, motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowsOut, DownloadSimple } from '@phosphor-icons/react'
import '@fontsource-variable/bodoni-moda/opsz.css'
import '@fontsource-variable/bodoni-moda/opsz-italic.css'
import '@fontsource-variable/instrument-sans'
import { typographySystems as content } from '@/data/typography-systems'
import PageViewer, { useViewer } from '@/components/typography/PageViewer'
import type { BookGallery, BookPage, EditorialNote, PrintFigure, ViewerItem } from '@/types/typography'

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

/* Viewer --------------------------------------------------------------- */

interface ViewerRequest {
  items: ViewerItem[]
  label: string
  index: number
}

const OpenViewerContext = createContext<(request: ViewerRequest, trigger: HTMLElement) => void>(() => undefined)

function toItem(figure: PrintFigure, title?: string, label?: string): ViewerItem {
  return { ...figure, title, label }
}

function pageItem(page: BookPage): ViewerItem {
  return toItem(page, page.title, page.label)
}

/* Motion --------------------------------------------------------------- */

/**
 * Fades content up once as it scrolls into view. With reduced motion, or where
 * IntersectionObserver is unavailable, content renders in place with no
 * hidden starting state, so it can never be left invisible.
 */
function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  const canObserve = typeof window !== 'undefined' && 'IntersectionObserver' in window
  const animate = !reduce && canObserve
  return (
    <motion.div
      className={className}
      initial={animate ? { opacity: 0, y: 28 } : false}
      whileInView={{ opacity: 1, y: 0 }}
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
  figure: PrintFigure
  /** Viewer contents; defaults to this figure alone. */
  items?: ViewerItem[]
  index?: number
  viewerLabel: string
  title?: string
  sizes: string
  eager?: boolean
  className?: string
  dark?: boolean
}

/** Print artwork on white paper. The whole image is a button that opens the enlarged viewer. */
function Artwork({ figure, items, index = 0, viewerLabel, title, sizes, eager = false, className = '', dark = false }: ArtworkProps) {
  const openViewer = useContext(OpenViewerContext)
  const srcSet = [
    figure.small && figure.smallWidth ? `${figure.small} ${figure.smallWidth}w` : null,
    `${figure.src} ${figure.width}w`,
    `${figure.large} ${figure.largeWidth}w`,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={(event) =>
        openViewer({ items: items ?? [toItem(figure, title)], label: viewerLabel, index }, event.currentTarget)
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
          src={figure.src}
          srcSet={srcSet}
          sizes={sizes}
          alt={figure.alt}
          width={figure.width}
          height={figure.height}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="block h-auto w-full"
        />
      </span>
      <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-type-ink/85 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100">
        <ArrowsOut size={14} aria-hidden="true" />
        <span className="hidden sm:inline">Enlarge</span>
        <span className="sr-only">Enlarge: {title ?? figure.alt}</span>
      </span>
    </button>
  )
}

function Caption({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`m-0 mt-3 text-sm leading-snug ${muted} ${className}`}>{children}</p>
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
    <section id={id} aria-labelledby={`${id}-title`} className={`${tones[tone]} py-20 md:py-28`}>
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 md:px-10">
        <Reveal className="mb-12 grid grid-cols-1 gap-6 md:mb-16 lg:grid-cols-12">
          <header className="lg:col-span-8">
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
          {intro && (
            <p className={`m-0 self-end text-lg leading-relaxed lg:col-span-4 ${muted}`}>{intro}</p>
          )}
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
          <Reveal delay={i * 0.06} className={`border-t ${rule} pt-5`}>
            <p className={`${eyebrow} mb-3 ${accent}`}>{note.eyebrow}</p>
            <h3 className={`${display} m-0 mb-3 text-2xl leading-tight md:text-3xl`}>{note.heading}</h3>
            <p className={`m-0 max-w-[58ch] leading-relaxed ${muted}`}>{note.body}</p>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}

/* Sections ------------------------------------------------------------- */

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

      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-4 pb-20 pt-12 sm:px-6 md:px-10 md:pb-28 md:pt-16 lg:grid-cols-12 lg:gap-8">
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

          <Reveal delay={0.1} className="mt-auto pt-12">
            <dl className={`m-0 grid grid-cols-2 gap-x-6 gap-y-5 border-t ${rule} pt-6 sm:grid-cols-4`}>
              {opening.meta.map((item) => (
                <div key={item.label}>
                  <dt className={`${eyebrow} mb-1 ${muted}`}>{item.label}</dt>
                  <dd className="m-0 text-sm font-medium">{item.value}</dd>
                </div>
              ))}
            </dl>
            <a
              href="#explore-the-books"
              className={`mt-8 inline-flex items-center gap-2 text-sm font-semibold underline decoration-[color:var(--t-accent)] underline-offset-[6px] hover:no-underline ${focusRing}`}
            >
              Explore both books
              <ArrowDown size={16} aria-hidden="true" />
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="w-full max-w-[460px] sm:ml-auto lg:col-span-5 lg:ml-0 lg:max-w-none lg:pt-6">
          <figure className="m-0">
            <div className="bg-type-burgundy p-5 sm:p-8 md:p-10">
              <Artwork
                figure={opening.cover}
                viewerLabel="Book 2 — ONE-X editorial study"
                title={opening.cover.title}
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

function Overview() {
  const { overview } = content
  return (
    <Section id="overview" tone="white" index="01" label="The work" title={overview.title} intro={overview.context}>
      <div className="grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-10 lg:gap-16">
        {overview.studies.map((study, i) => (
          <Reveal key={study.number} delay={i * 0.08} className={i === 1 ? 'md:mt-24' : ''}>
            <article>
              <Artwork
                figure={study.image}
                viewerLabel={study.name}
                title={study.image.title}
                sizes="(min-width: 1024px) 600px, (min-width: 768px) 50vw, 100vw"
              />
              <p className={`${eyebrow} mb-2 mt-6 ${accent}`}>{study.number}</p>
              <p className={`m-0 mb-3 text-sm font-semibold ${muted}`}>{study.name}</p>
              <h3 className={`${display} m-0 mb-3 text-3xl leading-tight md:text-4xl`}>{study.heading}</h3>
              <p className={`m-0 max-w-[52ch] text-lg leading-relaxed ${muted}`}>{study.body}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-20 grid grid-cols-1 lg:grid-cols-12">
        <figure className="m-0 border-l-2 border-type-burgundy pl-6 md:pl-10 lg:col-span-9 lg:col-start-3">
          <figcaption className={`${eyebrow} mb-4 ${accent}`}>The design question</figcaption>
          <blockquote className={`${display} m-0 text-3xl leading-[1.15] tracking-tight md:text-5xl`}>
            {overview.question}
          </blockquote>
        </figure>
      </Reveal>
    </Section>
  )
}

function ReadingPaths() {
  const { readingPaths } = content
  const items = readingPaths.items.map((item) => toItem(item.figure, item.heading, item.source))
  return (
    <Section id="reading-paths" tone="paper" index="02" label="Book 1 · Lecture series" title={readingPaths.title} intro={readingPaths.intro}>
      <ol className="m-0 grid list-none grid-cols-1 gap-14 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        {readingPaths.items.map((item, i) => (
          <li key={item.heading} className={i === 1 ? 'lg:mt-20' : i === 2 ? 'sm:col-span-2 sm:mx-auto sm:w-1/2 lg:col-span-1 lg:mx-0 lg:mt-40 lg:w-auto' : ''}>
            <Reveal delay={i * 0.08}>
              <Artwork
                figure={item.figure}
                items={items}
                index={i}
                viewerLabel="Book 1 — Same content, different reading paths"
                title={item.heading}
                sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
              />
              <p className={`${display} m-0 mt-6 text-5xl italic leading-none ${accent}`} aria-hidden="true">
                0{i + 1}
              </p>
              <h3 className={`${display} m-0 mt-3 text-2xl leading-tight md:text-3xl`}>{item.heading}</h3>
              <p className={`m-0 mt-2 leading-relaxed ${muted}`}>{item.body}</p>
              <p className={`m-0 mt-3 text-xs uppercase tracking-[0.12em] ${muted}`}>{item.source}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  )
}

function Contrast() {
  const { contrast } = content
  const items = contrast.comparisons.map((c) => toItem(c.page, `${c.lever}: ${c.page.title}`, `Book 1, ${c.page.label}`))
  return (
    <Section id="contrast" tone="ink" index="03" label="Book 1 · Contrast and composition" title={contrast.title} intro={contrast.intro}>
      <ul className="m-0 grid list-none grid-cols-1 gap-x-10 gap-y-16 p-0 md:grid-cols-2">
        {contrast.comparisons.map((comparison, i) => (
          <li key={comparison.lever} className={i % 2 === 1 ? 'md:mt-20' : ''}>
            <Reveal delay={(i % 2) * 0.08}>
              <div className={`mb-5 flex items-baseline justify-between gap-4 border-t ${rule} pt-4`}>
                <h3 className={`${display} m-0 text-3xl italic md:text-4xl ${accent}`}>{comparison.lever}</h3>
                <span className={`text-xs uppercase tracking-[0.12em] ${muted}`}>{comparison.page.label}</span>
              </div>
              <Artwork
                figure={comparison.page}
                items={items}
                index={i}
                viewerLabel="Book 1 — Alignment, rotation, scale and colour"
                title={`${comparison.lever}: ${comparison.page.title}`}
                sizes="(min-width: 1024px) 620px, (min-width: 768px) 50vw, 100vw"
                dark
              />
              <Caption className="max-w-[52ch]">{comparison.note}</Caption>
            </Reveal>
          </li>
        ))}
      </ul>
      <div className="mt-20">
        <Notes notes={contrast.notes} />
      </div>
    </Section>
  )
}

function Identity() {
  const { identity } = content
  const label = 'Book 2 — ONE-X editorial study'
  return (
    <Section id="one-x" tone="paper" index="04" label="ONE-X · Editorial identity" title={identity.title} intro={identity.intro}>
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-4">
          <Notes notes={[identity.note]} columns={1} />
          <div className={`mt-10 border-t ${rule} pt-5`}>
            <h3 className={`${eyebrow} m-0 mb-4 ${accent}`}>Recurring elements</h3>
            <ul className="m-0 list-none space-y-3 p-0">
              {identity.elements.map((element) => (
                <li key={element} className="flex gap-3 leading-relaxed">
                  <span aria-hidden="true" className="mt-[0.7em] block h-px w-5 shrink-0 bg-type-burgundy" />
                  {element}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.08} className="lg:col-span-8">
          <Artwork
            figure={identity.coverSpread}
            viewerLabel={label}
            title={identity.coverSpread.title}
            sizes="(min-width: 1024px) 840px, 100vw"
          />
          <Caption>Back and front cover as a spread, with the front reversed out of black.</Caption>
        </Reveal>
      </div>

      <div className="mt-20 grid grid-cols-1 items-end gap-12 sm:grid-cols-12 lg:gap-10">
        <Reveal className="sm:col-span-5 lg:col-span-4">
          <Artwork
            figure={identity.cover}
            viewerLabel={label}
            title={identity.cover.title}
            sizes="(min-width: 1024px) 420px, (min-width: 640px) 40vw, 100vw"
          />
          <Caption>Front cover. The title treatment and red rule set the vocabulary.</Caption>
        </Reveal>
        <Reveal delay={0.08} className="sm:col-span-7 lg:col-span-8">
          <Artwork
            figure={identity.discography}
            viewerLabel={label}
            title={identity.discography.title}
            sizes="(min-width: 1024px) 840px, 60vw"
          />
          <Caption>Discography, printed page 15. The same burgundy and serif italics organise a timeline.</Caption>
        </Reveal>
      </div>

      <Reveal className={`mt-20 grid grid-cols-1 gap-10 border-t ${rule} pt-8 md:grid-cols-2`}>
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
          <p className={`m-0 mt-4 text-sm ${muted}`}>Named in the case study. This page is set in Bodoni Moda as a web stand-in.</p>
        </div>
      </Reveal>
    </Section>
  )
}

function Members() {
  const { members } = content
  const label = 'Book 2 — ONE-X member spreads'
  const items = [
    pageItem(members.spread),
    toItem(members.detail, 'Detail, page 05'),
    pageItem(members.secondSpread),
    toItem(members.secondDetail, 'Detail, page 07'),
  ]
  return (
    <Section id="members" tone="white" index="05" label="ONE-X · Member spreads" title={members.title} intro={members.intro}>
      <Reveal>
        <Artwork
          figure={members.spread}
          items={items}
          index={0}
          viewerLabel={label}
          title={members.spread.title}
          sizes="(min-width: 1320px) 1240px, 100vw"
        />
        <Caption>{members.spread.title}. Printed pages 05 and 06.</Caption>
      </Reveal>

      <div className="mt-20 grid grid-cols-1 items-center gap-12 md:grid-cols-12 lg:gap-16">
        <Reveal className="md:col-span-6 lg:col-span-5">
          <Artwork
            figure={members.detail}
            items={items}
            index={1}
            viewerLabel={label}
            title="Detail, page 05"
            sizes="(min-width: 1024px) 520px, (min-width: 768px) 50vw, 100vw"
          />
          <Caption>{members.detailCaption}</Caption>
        </Reveal>
        <ol className="m-0 list-none space-y-10 p-0 md:col-span-6 lg:col-span-6 lg:col-start-7">
          {members.principles.map((principle, i) => (
            <li key={principle.heading}>
              <Reveal delay={i * 0.06} className={`grid grid-cols-[4.5rem_1fr] gap-4 border-t ${rule} pt-5 md:grid-cols-[6rem_1fr]`}>
                <span aria-hidden="true" className={`${display} text-6xl leading-none text-[#D8D2C6] md:text-7xl`}>
                  0{i + 1}
                </span>
                <div>
                  <h3 className={`${eyebrow} m-0 mb-2 ${accent}`}>{principle.heading}</h3>
                  <p className={`${display} m-0 text-2xl leading-snug md:text-3xl`}>{principle.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-20 grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-8">
          <Artwork
            figure={members.secondSpread}
            items={items}
            index={2}
            viewerLabel={label}
            title={members.secondSpread.title}
            sizes="(min-width: 1024px) 840px, 100vw"
          />
          <Caption>{members.secondSpread.title}. Printed pages 07 and 08.</Caption>
        </Reveal>
        <Reveal delay={0.08} className="sm:w-2/3 lg:col-span-4 lg:w-auto">
          <Artwork
            figure={members.secondDetail}
            items={items}
            index={3}
            viewerLabel={label}
            title="Detail, page 07"
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 66vw, 100vw"
          />
          <Caption>{members.secondDetailCaption}</Caption>
        </Reveal>
      </div>
    </Section>
  )
}

function Rhythm() {
  const { rhythm } = content
  const label = 'Book 2 — ONE-X rhythm across spreads'
  const items = [pageItem(rhythm.lead), ...rhythm.supporting.map((s) => toItem(s.figure, s.caption))]
  return (
    <Section id="rhythm" tone="ink" index="06" label="ONE-X · Rhythm across spreads" title={rhythm.title}>
      <Reveal>
        <Artwork
          figure={rhythm.lead}
          items={items}
          index={0}
          viewerLabel={label}
          title={rhythm.lead.title}
          sizes="(min-width: 1320px) 1240px, 100vw"
          dark
        />
        <Caption>{rhythm.lead.title}. A vertical name, then the lineup as a numbered list.</Caption>
      </Reveal>

      <ul className="m-0 mt-16 grid list-none grid-cols-1 items-end gap-10 p-0 sm:grid-cols-2 lg:grid-cols-12">
        {rhythm.supporting.map((support, i) => (
          <li
            key={support.caption}
            className={
              i === 1
                ? 'sm:col-span-2 sm:row-start-2 lg:col-span-6 lg:row-start-auto'
                : 'lg:col-span-3'
            }
          >
            <Reveal delay={i * 0.06}>
              <Artwork
                figure={support.figure}
                items={items}
                index={i + 1}
                viewerLabel={label}
                title={support.caption}
                sizes={i === 1 ? '(min-width: 1024px) 620px, 100vw' : '(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw'}
                dark
              />
              <Caption>{support.caption}</Caption>
            </Reveal>
          </li>
        ))}
      </ul>

      <div className="mt-20">
        <Notes notes={rhythm.notes} />
      </div>
    </Section>
  )
}

function Reflection() {
  const { reflection } = content
  return (
    <Section id="reflection" tone="paper" index="07" label="Reflection" title={reflection.title}>
      <Notes notes={reflection.notes} />
      <Reveal className="mt-16 grid grid-cols-1 gap-6 bg-type-band p-6 sm:p-10 lg:grid-cols-12">
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

function Gallery({ book, download }: { book: BookGallery; download?: (typeof content.downloads)[number] }) {
  const items = book.pages.map(pageItem)
  const singles = book.pages.filter((p) => p.kind === 'single').length
  const spreads = book.pages.length - singles
  return (
    <section aria-labelledby={`${book.id}-title`} className="mt-16 first:mt-0">
      <Reveal className={`mb-8 grid grid-cols-1 gap-4 border-t ${rule} pt-6 md:grid-cols-12`}>
        <div className="md:col-span-8">
          <h3 id={`${book.id}-title`} className={`${display} m-0 text-3xl leading-tight md:text-5xl`}>
            {book.title}
          </h3>
          <p className={`m-0 mt-3 max-w-[60ch] leading-relaxed ${muted}`}>{book.description}</p>
        </div>
        <div className="flex flex-col items-start gap-3 md:col-span-4 md:items-end md:text-right">
          <p className={`m-0 text-sm ${muted}`}>
            {book.pages.length} PDF pages · {singles} single, {spreads} spreads
          </p>
          {download && (
            <a
              href={download.href}
              download
              className={`inline-flex items-center gap-2 text-sm font-semibold underline decoration-[color:var(--t-accent)] underline-offset-[6px] hover:no-underline ${focusRing}`}
            >
              <DownloadSimple size={16} aria-hidden="true" />
              {download.label} (PDF, {download.size})
            </a>
          )}
        </div>
      </Reveal>
      <ol className="m-0 grid list-none grid-cols-1 gap-x-5 gap-y-8 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {book.pages.map((page, i) => (
          <li key={page.id}>
            <GalleryTile page={page} index={i} items={items} viewerLabel={book.title} />
          </li>
        ))}
      </ol>
    </section>
  )
}

/** A gallery page in a spread-shaped frame, so single pages and spreads align without cropping. */
function GalleryTile({ page, index, items, viewerLabel }: { page: BookPage; index: number; items: ViewerItem[]; viewerLabel: string }) {
  const openViewer = useContext(OpenViewerContext)
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={(event) => openViewer({ items, label: viewerLabel, index }, event.currentTarget)}
      className={`group block w-full text-left ${focusRing}`}
    >
      <span className="flex aspect-[1152/792] items-center justify-center overflow-hidden bg-[#DCD4C6]">
        <img
          src={page.small}
          srcSet={`${page.small} ${page.smallWidth}w, ${page.src} ${page.width}w`}
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          alt={page.alt}
          width={page.smallWidth}
          height={560}
          loading="lazy"
          decoding="async"
          className={`block h-full bg-white shadow-[0_18px_30px_-22px_rgba(74,52,38,0.55)] transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.025] ${
            page.kind === 'single' ? 'w-auto' : 'w-full'
          }`}
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
            {page.label} · {page.kind === 'single' ? 'Single page' : 'Two-page spread'}
          </span>
        </span>
      </span>
    </button>
  )
}

function ExploreBooks() {
  const [book1, book2] = content.books
  return (
    <Section
      id="explore-the-books"
      tone="band"
      index="08"
      label="Both books, in full"
      title="Explore the books"
      intro={`Every page of both books, in its original order. Select a page to enlarge it. ${content.pageCountNote}`}
    >
      <Gallery book={book1} download={content.downloads[1]} />
      <Gallery book={book2} download={content.downloads[2]} />
    </Section>
  )
}

function Downloads() {
  return (
    <section aria-labelledby="downloads-title" className={`${tones.ink} py-20 md:py-24`}>
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-10 px-4 sm:px-6 md:px-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className={`${eyebrow} mb-4 ${accent}`}>Downloads</p>
          <h2 id="downloads-title" className={`${headline} m-0`}>
            Take the work with you.
          </h2>
          <p className={`m-0 mt-5 leading-relaxed ${muted}`}>The original PDFs, unchanged.</p>
        </Reveal>
        <div className="lg:col-span-7 lg:col-start-6">
          <ul className="m-0 list-none p-0">
            {content.downloads.map((link, i) => (
              <li key={link.href}>
                <Reveal delay={i * 0.06}>
                  <a
                    href={link.href}
                    download
                    aria-label={`${link.label} (PDF, ${link.size}): ${link.description}`}
                    className={`group flex items-center justify-between gap-6 border-t ${rule} py-6 ${focusRing}`}
                  >
                    <span>
                      <span className={`${display} block text-2xl leading-tight md:text-3xl`}>
                        {link.label}
                      </span>
                      <span className={`mt-1 block text-sm ${muted}`}>{link.description}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      <span aria-hidden="true" className={`text-sm tabular-nums ${muted}`}>
                        PDF · {link.size}
                      </span>
                      <span
                        aria-hidden="true"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-type-paper/40 transition-transform duration-300 motion-safe:group-hover:translate-y-0.5"
                      >
                        <DownloadSimple size={18} />
                      </span>
                    </span>
                  </a>
                </Reveal>
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
      setRequest({ items: next.items, label: next.label })
      viewer.open(next.index, trigger)
    },
    [viewer.open],
  )

  useEffect(() => {
    window.scrollTo(0, 0)
    const previous = document.title
    document.title = 'Typography Systems · Andrew Dumitru'
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <OpenViewerContext.Provider value={openViewer}>
        <div className="font-type-body antialiased">
          <main>
            <Opening />
            <Overview />
            <ReadingPaths />
            <Contrast />
            <Identity />
            <Members />
            <Rhythm />
            <Reflection />
            <ExploreBooks />
            <Downloads />
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
    </MotionConfig>
  )
}
