import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { ArrowLeft, ArrowDown, ArrowUp } from '@phosphor-icons/react'
import '@fontsource-variable/newsreader'
import '@fontsource-variable/instrument-sans'
import { projects } from '@/data/projects'
import { aic } from '@/data/aic'
import PresentationSection from '@/components/presentation/PresentationSection'
import PresentationActions from '@/components/presentation/PresentationActions'
import ZoomFigure from '@/components/presentation/ZoomFigure'
import { workLink, workState } from '@/components/presentation/PresentationOpening'
import { aicTheme, PresentationThemeContext } from '@/lib/presentationTheme'
import type { CaseStudySection } from '@/types'
import type { PresentationImage } from '@/types/presentation'

const project = projects.find((item) => item.id === 'aic-museum-experience')
const sections = project?.sections ?? []
const app = sections.find((section) => section.id === 'app-screens')
const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#842C3B] focus-visible:ring-offset-4'

// Dimensions of the existing exports; the source screens are not cropped or redrawn.
const screenSizes = [
  [786, 1704], [786, 1704], [786, 1704], [786, 1704], [786, 1704], [786, 1934],
  [786, 1934], [802, 1950], [706, 1436], [786, 1934], [786, 1934], [786, 1704],
  [786, 1704], [786, 1704], [786, 1704], [786, 1704], [786, 1704], [786, 1934],
  [786, 1934], [802, 1950], [722, 1452], [786, 1934], [786, 1934], [786, 1704],
  [786, 1637], [786, 1637],
]

function appImage(index: number): PresentationImage {
  return {
    src: app?.images?.[index] ?? '',
    alt: app?.captions?.[index] ?? 'Museum companion concept screen',
    width: screenSizes[index][0],
    height: screenSizes[index][1],
  }
}

function Paragraphs({ body }: { body?: string }) {
  return <>{body?.split('\n\n').map((paragraph) => (
    <p key={paragraph} className="mb-5 max-w-[65ch] text-lg leading-relaxed text-[color:var(--pres-muted)] last:mb-0">{paragraph}</p>
  ))}</>
}

function Gallery() {
  const [expanded, setExpanded] = useState(false)
  const sources = expanded ? app?.images ?? [] : app?.previewImages ?? []
  return (
    <>
      <div id="aic-screen-gallery" className="grid grid-cols-2 items-start gap-x-4 gap-y-10 sm:gap-x-8 lg:grid-cols-4">
        {sources.map((src) => {
          const index = app?.images?.indexOf(src) ?? 0
          return <ZoomFigure key={src} image={appImage(index)} caption={app?.captions?.[index]} />
        })}
      </div>
      <div className="mt-10 flex flex-col gap-4 border-t border-[#DAD1C5] pt-8 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" aria-expanded={expanded} aria-controls="aic-screen-gallery"
          onClick={() => setExpanded((value) => !value)}
          className={`inline-flex min-h-12 w-fit items-center gap-3 rounded-lg border border-[#842C3B] px-5 py-3 font-medium text-[#842C3B] hover:bg-[#EDE5DA] ${focusRing}`}>
          {expanded ? aic.gallery.collapse : aic.gallery.expand}
          {expanded ? <ArrowUp size={18} aria-hidden="true" /> : <ArrowDown size={18} aria-hidden="true" />}
        </button>
        <p className="m-0 text-sm text-[color:var(--pres-muted)]">{aic.gallery.detail}</p>
      </div>
    </>
  )
}

function SectionContent({ section }: { section: CaseStudySection }) {
  const numbered = section.sectionStyle === 'numbered-cards'
  const images = section.images ?? []
  const hasImages = images.length > 0 && section.id !== 'app-screens'
  return (
    <>
      <div className={hasImages ? 'grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16' : ''}>
        <div className={hasImages ? (images.length === 1 ? 'lg:col-span-5' : 'lg:col-span-12') : 'mb-10'}>
          <Paragraphs body={section.body} />
        </div>
        {hasImages && <div className={`grid grid-cols-1 gap-8 ${images.length === 1 ? 'lg:col-span-7' : 'lg:col-span-12 md:grid-cols-2'}`}>
          {images.map((src, index) => <ZoomFigure key={src} image={{ src, alt: `${section.title} — original presentation slide ${index + 1}`, width: 2160, height: 1215 }} />)}
        </div>}
      </div>
      {section.items && (numbered ? (
        <ol className="m-0 grid list-none grid-cols-1 gap-x-12 p-0 md:grid-cols-2">
          {section.items.map((item, index) => {
            const [title, ...description] = item.split(' — ')
            return <li key={item} className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-[color:var(--pres-border)] py-7">
              <span aria-hidden="true" className="font-wove-display text-3xl text-[color:var(--pres-accent)]">{String(index + 1).padStart(2, '0')}</span>
              <div><h3 className="mb-3 font-wove-display text-2xl leading-tight">{title}</h3>
                <p className="m-0 leading-relaxed text-[color:var(--pres-muted)]">{description.join(' — ')}</p></div>
            </li>
          })}
        </ol>
      ) : (
        <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
          {section.items.map((item) => <li key={item} className="rounded-full border border-[color:var(--pres-border)] px-4 py-2 text-sm font-medium">{item}</li>)}
        </ul>
      ))}
      {section.id === 'app-screens' && <Gallery />}
      {section.id === 'my-contribution' && project?.details && <p className="mt-8 text-sm text-[color:var(--pres-muted)]">
        <span className="font-semibold">Tools · </span>{project.details.tools}
      </p>}
      {section.id === 'reflection' && <PresentationActions />}
    </>
  )
}

export default function AicCaseStudy() {
  useEffect(() => {
    const previous = document.title
    document.title = 'AIC Museum Experience · Andrew Dumitru'
    return () => { document.title = previous }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <PresentationThemeContext.Provider value={aicTheme}>
        <main className="min-h-[100dvh] bg-[#F6F2EB] font-type-body text-[#24201D] antialiased">
          <section aria-labelledby="aic-title" className={aicTheme.tones.base}>
            <nav aria-label="Case study" className="mx-auto max-w-[1280px] px-4 pt-6 sm:px-6 md:px-10">
              <Link to={workLink} state={workState} className={`inline-flex min-h-11 items-center gap-2 rounded text-sm font-medium text-[#842C3B] hover:underline ${focusRing}`}>
                <ArrowLeft size={16} aria-hidden="true" /> Back to work
              </Link>
            </nav>
            <div className="mx-auto max-w-[1280px] px-4 pb-16 pt-12 sm:px-6 md:px-10 md:pb-24 md:pt-20">
              <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#842C3B]">
                    <span aria-hidden="true" className="h-px w-8 shrink-0 bg-current" />{aic.eyebrow}
                  </p>
                  <h1 id="aic-title" className={aicTheme.title}>{aic.title}</h1>
                  <p className={`mt-6 max-w-[38ch] ${aicTheme.subtitle}`}>{aic.subtitle}</p>
                </div>
                <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-[#DAD1C5] pt-6 lg:col-span-5">
                  {aic.meta.map((item) => <div key={item.label}>
                    <dt className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#625B53]">{item.label}</dt>
                    <dd className="m-0 font-medium leading-snug">{item.value}</dd>
                  </div>)}
                </dl>
              </div>
              <div className="mt-12 grid grid-cols-3 items-start gap-4 rounded-2xl border border-[#DAD1C5] bg-[#EDE5DA] px-4 py-8 sm:gap-8 sm:px-10 md:mt-16 md:px-20 md:py-12">
                {aic.heroScreens.map((index, position) => <div key={index} className={position === 1 ? 'mt-8' : ''}>
                  <ZoomFigure image={appImage(index)} />
                </div>)}
              </div>
              <p className="mb-0 mt-5 text-sm text-[#625B53]">{aic.heroCaption}</p>
            </div>
          </section>
          {aic.sections.map((presentation, index) => {
            const section = sections.find((item) => item.id === presentation.id)
            if (!section) return null
            return <PresentationSection key={section.id} id={section.id} tone={presentation.tone}
              index={String(index + 1).padStart(2, '0')} label={section.title} title={presentation.title}>
              <SectionContent section={section} />
            </PresentationSection>
          })}
        </main>
      </PresentationThemeContext.Provider>
    </MotionConfig>
  )
}
