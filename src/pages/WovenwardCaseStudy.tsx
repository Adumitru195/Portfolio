import { useEffect } from 'react'
import { MotionConfig, motion } from 'framer-motion'
import { ArrowUpRight, Check } from '@phosphor-icons/react'
import '@fontsource-variable/newsreader/opsz.css'
import '@fontsource-variable/newsreader/opsz-italic.css'
import '@fontsource-variable/manrope'
import { projects } from '@/data/projects'
import { wovenward, WOVENWARD_SHOWCASE_ENABLED } from '@/data/wovenward'
import PresentationOpening from '@/components/presentation/PresentationOpening'
import PresentationActions from '@/components/presentation/PresentationActions'
import PresentationSection from '@/components/presentation/PresentationSection'
import PhoneLineup from '@/components/presentation/PhoneLineup'
import ZoomFigure from '@/components/presentation/ZoomFigure'
import { fadeUp, staggerContainer } from '@/lib/motion'
import { PresentationThemeContext, wovenwardTheme } from '@/lib/presentationTheme'
import type { FeatureNote } from '@/types/presentation'

const serif = 'font-wove-display font-normal leading-[1.12] tracking-[-0.01em]'
const label = 'text-xs font-semibold uppercase tracking-[0.14em]'

// Once-only reveal for groups of items, matching the section headers.
const revealList = {
  variants: staggerContainer,
  initial: 'hidden' as const,
  whileInView: 'visible' as const,
  viewport: { once: true, margin: '-10%' },
}

function Notes({ notes, columns = 1 }: { notes: FeatureNote[]; columns?: 1 | 2 }) {
  return (
    <motion.ul
      {...revealList}
      className={`m-0 grid list-none gap-6 p-0 ${columns === 2 ? 'sm:grid-cols-2' : 'grid-cols-1'}`}
    >
      {notes.map((note) => (
        <motion.li key={note.title} variants={fadeUp} className="border-t border-[color:var(--pres-border)] pt-4">
          <h3 className={`${serif} mb-2 text-xl md:text-2xl`}>{note.title}</h3>
          <p className="m-0 leading-relaxed text-[color:var(--pres-muted)]">{note.body}</p>
        </motion.li>
      ))}
    </motion.ul>
  )
}

function Opening() {
  const project = projects.find((p) => p.id === 'wovenward')
  return (
    <PresentationOpening
      title={project?.title ?? 'Wovenward'}
      subtitle={wovenward.subtitle}
      eyebrow={wovenward.eyebrow}
      meta={wovenward.meta}
      showcase={wovenward.showcase}
      note={wovenward.imageNote}
      showcaseOptions={{
        enabled: WOVENWARD_SHOWCASE_ENABLED,
        entrance: true,
        phoneParallax: 0.6,
        tiltRange: { x: 0.052, y: 0.035 },
        maxDpr: 1.5,
        requireFinePointer: true,
        loadMargin: '200px',
      }}
    />
  )
}

function Overview() {
  const { overview } = wovenward
  const blocks = [
    ['The challenge', overview.challenge],
    ['Design goal', overview.goal],
    ['Contribution', overview.contribution],
    ['Scope', overview.scope],
  ] as const
  return (
    <PresentationSection id="overview" tone="alt" index="01" label="Overview" title={overview.title}>
      <motion.dl {...revealList} className="m-0 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
        {blocks.map(([name, block]) => (
          <motion.div key={name} variants={fadeUp} className="border-t border-wove-hairline pt-5">
            <dt className={`${label} mb-3 text-wove-clay-text`}>{name}</dt>
            <dd className="m-0">
              <p className={`${serif} mb-3 text-2xl md:text-3xl`}>{block.heading}</p>
              <p className="m-0 max-w-[60ch] text-lg leading-relaxed text-wove-muted">{block.body}</p>
            </dd>
          </motion.div>
        ))}
      </motion.dl>
    </PresentationSection>
  )
}

function Journey() {
  const { journey } = wovenward
  return (
    <PresentationSection id="journey" tone="base" index="02" label="Experience structure" title={journey.title} intro={journey.body}>
      <motion.ol {...revealList} className="m-0 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        {journey.steps.map((step, i) => (
          <motion.li key={step.title} variants={fadeUp} className="relative lg:pr-8">
            <div className="mb-5 flex items-center gap-4">
              <span aria-hidden="true" className={`${serif} text-5xl italic text-wove-clay-text`}>
                0{i + 1}
              </span>
              {i < journey.steps.length - 1 && (
                <span aria-hidden="true" className="hidden h-px flex-1 bg-wove-clay lg:block" />
              )}
            </div>
            <h3 className={`${serif} mb-1 text-2xl md:text-3xl`}>{step.title}</h3>
            <p className="m-0 text-wove-muted">{step.body}</p>
          </motion.li>
        ))}
      </motion.ol>
      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
        {journey.principles.map((principle) => (
          <div key={principle.title} className="border-l-2 border-wove-clay pl-5">
            <h3 className={`${serif} mb-2 text-xl md:text-2xl`}>{principle.title}</h3>
            <p className="m-0 max-w-[60ch] leading-relaxed text-wove-muted">{principle.body}</p>
          </div>
        ))}
      </div>
    </PresentationSection>
  )
}

function Wireframes() {
  const { wireframes } = wovenward
  return (
    <PresentationSection id="wireframes" tone="alt" index="03" label="Wireframes" title={wireframes.title} intro={wireframes.body}>
      <ZoomFigure
        image={wireframes.corrected}
        caption="Retrospective grayscale wireframes of the current experience. Select to enlarge."
      />
      <p className="mt-4 text-sm">
        <a
          href={wireframes.svgHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-semibold text-wove-indigo underline underline-offset-4 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wove-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-wove-band"
        >
          Open the editable SVG
          <ArrowUpRight size={14} aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </p>

      <div className="mt-16 grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <h3 className={`${serif} mb-3 text-2xl`}>Matched to the build</h3>
          <p className="mb-6 leading-relaxed text-wove-muted">{wireframes.suppliedNote}</p>
          <ul className="m-0 list-none space-y-4 p-0">
            {wireframes.corrections.map((item) => (
              <li key={item} className="flex gap-3 leading-relaxed">
                <Check size={18} weight="bold" aria-hidden="true" className="mt-1 shrink-0 text-wove-indigo" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <ZoomFigure
          image={wireframes.supplied}
          caption="Originally supplied board, unchanged. Select to enlarge."
          sizes="(min-width: 1024px) 680px, 100vw"
          fullSrc="/Portfolio/projects/wovenward/wovenward-wireframe-board-supplied.png"
          className="lg:col-span-7"
        />
      </div>
    </PresentationSection>
  )
}

function Identity() {
  const { identity } = wovenward
  return (
    <PresentationSection id="identity" tone="accent" index="04" label="Visual system" title={identity.title} intro={identity.body}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-sm bg-wove-porcelain p-6 text-wove-ink sm:p-10 lg:col-span-7">
          <h3 className="sr-only">Typography</h3>
          <div className="border-b border-wove-hairline pb-8">
            <p className={`${label} mb-1 text-wove-clay-text`}>{identity.displayFont.name}</p>
            <p className="mb-6 text-sm text-wove-muted">{identity.displayFont.role}</p>
            <p className="m-0 font-wove-display text-5xl font-light leading-[1.02] tracking-[-0.02em] sm:text-7xl">
              Clothes you’ll <em className="text-wove-clay-text">reach for</em> first.
            </p>
            <p aria-hidden="true" className="mt-5 flex flex-wrap gap-x-6 gap-y-1 font-wove-display text-2xl text-wove-muted">
              <span className="font-light">Light 300</span>
              <span className="font-normal">Regular 400</span>
              <span className="italic">Italic</span>
            </p>
          </div>
          <div className="pt-8">
            <p className={`${label} mb-1 text-wove-clay-text`}>{identity.bodyFont.name}</p>
            <p className="mb-6 text-sm text-wove-muted">{identity.bodyFont.role}</p>
            <p className="m-0 flex items-baseline justify-between gap-4 text-lg font-semibold">
              <span>Funnel-Neck Utility Jacket</span>
              <span className="tabular-nums">$186</span>
            </p>
            <p className="mt-2 text-sm text-wove-secondary">Olive · Available sizes: XS, S, M, XL</p>
            <p className="mt-5 max-w-[50ch] leading-relaxed text-wove-muted">
              Coats, knits, shirts and dresses made for ordinary days, with measurements, fabric composition and plain-spoken fit notes on every piece.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-5">
          <div>
            <h3 className={`${label} mb-4 text-[color:var(--pres-eyebrow)]`}>Palette</h3>
            <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 lg:grid-cols-2">
              {identity.swatches.map((swatch) => (
                <li key={swatch.hex}>
                  <span
                    aria-hidden="true"
                    className="mb-3 block h-14 rounded-sm border border-white/20"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <span className="block font-semibold">{swatch.name}</span>
                  <span className="block font-mono text-sm text-[color:var(--pres-muted)]">{swatch.hex}</span>
                  <span className="block text-sm text-[color:var(--pres-muted)]">{swatch.usage}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 rounded-sm bg-wove-porcelain p-6 text-wove-ink sm:p-8">
            <h3 className={`${label} mb-5 text-wove-clay-text`}>Interface states</h3>
            <ul className="m-0 flex list-none flex-col gap-6 p-0">
              <li>
                <span className="mb-2 block text-xs text-wove-muted">Size: available, selected and sold out</span>
                <span className="flex gap-1.5">
                  <span className="flex h-10 w-12 items-center justify-center border border-wove-control bg-white text-sm font-semibold">S</span>
                  <span className="flex h-10 w-12 items-center justify-center gap-1 border border-wove-ink bg-wove-ink text-sm font-semibold text-white">
                    <Check size={12} weight="bold" aria-hidden="true" />M
                  </span>
                  <span className="relative flex h-10 w-12 items-center justify-center overflow-hidden border border-dashed border-wove-control text-sm text-wove-muted">
                    <svg aria-hidden="true" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 10 10">
                      <line x1="0" y1="0" x2="10" y2="10" stroke="#8A8377" strokeWidth="0.25" />
                    </svg>
                    L<span className="sr-only">, sold out</span>
                  </span>
                </span>
              </li>
              <li>
                <span className="mb-2 block text-xs text-wove-muted">Primary and secondary actions</span>
                <span className="flex flex-wrap gap-2">
                  <span className="inline-flex h-11 items-center bg-wove-indigo px-5 text-sm font-semibold text-white">Add to bag</span>
                  <span className="inline-flex h-11 items-center border border-wove-control bg-white px-5 text-sm font-semibold">Continue shopping</span>
                </span>
              </li>
              <li>
                <span className="mb-2 block text-xs text-wove-muted">Filter chip and size guidance</span>
                <span className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-wove-control px-3 py-1.5 text-sm">
                    Size XS <span aria-hidden="true">×</span>
                  </span>
                  <span className="text-sm text-wove-error">Choose a size to add this to your bag.</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p className="mt-8 max-w-[65ch] text-[color:var(--pres-muted)]">{identity.note}</p>
    </PresentationSection>
  )
}

function Collection() {
  const { collection } = wovenward
  return (
    <PresentationSection id="collection" tone="base" index="05" label="Homepage and collection" title={collection.title} intro={collection.body}>
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
        <ZoomFigure image={collection.hero} chrome className="lg:col-span-8" />
        <div className="lg:col-span-4">
          <Notes notes={collection.heroNotes} />
        </div>
      </div>
      <ZoomFigure image={collection.sections} caption={collection.sectionsCaption} chrome className="mt-16" />
      <div className="mt-20 grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-4 lg:row-start-1">
          <p className={`${label} mb-4 text-wove-clay-text`}>Collection</p>
          <h3 className={`${serif} mb-6 text-3xl md:text-4xl`}>Browse what is actually available.</h3>
          <Notes notes={collection.filteredNotes} />
        </div>
        <div className="flex flex-col gap-8 lg:col-span-8 lg:col-start-5 lg:row-start-1">
          <ZoomFigure image={collection.filtered} chrome />
          <ZoomFigure image={collection.empty} caption={collection.emptyCaption} chrome />
        </div>
      </div>
    </PresentationSection>
  )
}

function Product() {
  const { product } = wovenward
  return (
    <PresentationSection id="product" tone="alt" index="06" label="Product, size and fit" title={product.title} intro={product.body}>
      <ZoomFigure image={product.layout} caption={product.layoutCaption} chrome />
      <div className="mt-20 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4 lg:col-span-7">
          <ZoomFigure image={product.required} caption="Adding without a size." sizes="(min-width: 1024px) 360px, 50vw" />
          <ZoomFigure image={product.selected} caption="Size M selected; L sold out." sizes="(min-width: 1024px) 360px, 50vw" />
        </div>
        <div className="lg:col-span-5">
          <Notes notes={product.stateNotes} />
        </div>
      </div>
      <div className="mt-20 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5 lg:row-start-1">
          <p className={`${label} mb-4 text-wove-clay-text`}>Size guide</p>
          <h3 className={`${serif} mb-6 text-3xl md:text-4xl`}>Help at the moment it’s needed.</h3>
          <Notes notes={product.guideNotes} />
        </div>
        <ZoomFigure image={product.guide} className="lg:col-span-6 lg:col-start-7 lg:row-start-1" sizes="(min-width: 1024px) 600px, 100vw" />
      </div>
    </PresentationSection>
  )
}

function Bag() {
  const { bag } = wovenward
  return (
    <PresentationSection id="bag" tone="base" index="07" label="Feedback and bag review" title={bag.title} intro={bag.body}>
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <ZoomFigure image={bag.added} className="lg:col-span-6" sizes="(min-width: 1024px) 600px, 100vw" />
        <div className="lg:col-span-5 lg:col-start-8">
          <Notes notes={bag.addedNotes} />
        </div>
      </div>
      <ZoomFigure image={bag.bag} chrome className="mt-20" />
      <div className="mt-8">
        <Notes notes={bag.bagNotes} columns={2} />
      </div>
    </PresentationSection>
  )
}

function Responsive() {
  const { responsive } = wovenward
  return (
    <PresentationSection id="responsive" tone="alt" index="08" label="Responsive and motion" title={responsive.title} intro={responsive.body}>
      <PhoneLineup screens={responsive.screens} />
      <ul className="m-0 mt-16 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-3">
        {responsive.notes.map((note) => (
          <li key={note.title} className="border-t border-wove-hairline pt-5">
            <h3 className={`${serif} mb-2 text-xl md:text-2xl`}>{note.title}</h3>
            <p className="m-0 leading-relaxed text-wove-muted">{note.body}</p>
          </li>
        ))}
      </ul>
      <p className="mt-10 max-w-[65ch] border-l-2 border-wove-clay pl-5 leading-relaxed">
        <span className={`${label} mb-1 block text-wove-clay-text`}>Reduced motion</span>
        {responsive.reducedMotion}
      </p>
    </PresentationSection>
  )
}

function Refinements() {
  const { refinements } = wovenward
  return (
    <PresentationSection id="refinements" tone="base" index="09" label="Refinements" title={refinements.title} intro={refinements.body}>
      <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2 sm:gap-4 md:gap-6">
        <div>
          <span className="mb-3 inline-flex rounded-full border border-wove-control bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em]">Before</span>
          <ZoomFigure image={refinements.before} caption={refinements.beforeCaption} sizes="(min-width: 1280px) 600px, 50vw" />
        </div>
        <div>
          <span className="mb-3 inline-flex rounded-full bg-wove-indigo px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-white">After</span>
          <ZoomFigure image={refinements.after} caption={refinements.afterCaption} sizes="(min-width: 1280px) 600px, 50vw" />
        </div>
      </div>
      <motion.ol {...revealList} className="m-0 mt-16 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-2 lg:grid-cols-3">
        {refinements.items.map((item, i) => (
          <motion.li key={item.title} variants={fadeUp} className="border-t border-wove-hairline pt-5">
            <p aria-hidden="true" className={`${serif} mb-1 text-lg italic text-wove-clay-text`}>0{i + 1}</p>
            <h3 className={`${serif} mb-2 text-xl md:text-2xl`}>{item.title}</h3>
            <p className="m-0 leading-relaxed text-wove-muted">{item.body}</p>
          </motion.li>
        ))}
      </motion.ol>
    </PresentationSection>
  )
}

function Outcome() {
  const { outcome } = wovenward
  const blocks = [outcome.delivered, outcome.lesson, outcome.checks, outcome.next]
  return (
    <PresentationSection id="outcome" tone="accent" index="10" label="Outcome and reflection" title={outcome.title}>
      <motion.ul {...revealList} className="m-0 grid list-none grid-cols-1 gap-x-12 gap-y-10 p-0 md:grid-cols-2">
        {blocks.map((block) => (
          <motion.li key={block.title} variants={fadeUp} className="border-t border-[#474A44] pt-5">
            <h3 className={`${serif} mb-3 text-2xl md:text-3xl`}>{block.title}</h3>
            <p className="m-0 max-w-[60ch] leading-relaxed text-[#C9C5BC]">{block.body}</p>
          </motion.li>
        ))}
      </motion.ul>
      <p className="mt-12 max-w-[75ch] border-l-2 border-wove-clay pl-5 text-sm leading-relaxed text-[#C9C5BC]">{outcome.limits}</p>
      <PresentationActions pdf={outcome.pdf} />
    </PresentationSection>
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
    <MotionConfig reducedMotion="user">
      <PresentationThemeContext.Provider value={wovenwardTheme}>
        <div className="font-wove-body antialiased">
          <main>
            <Opening />
            <Overview />
            <Journey />
            <Wireframes />
            <Identity />
            <Collection />
            <Product />
            <Bag />
            <Responsive />
            <Refinements />
            <Outcome />
          </main>
        </div>
      </PresentationThemeContext.Provider>
    </MotionConfig>
  )
}
