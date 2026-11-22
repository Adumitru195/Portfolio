import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { serviceIllustrationText as copy } from '@/data/services'
import type { ServiceId } from '@/data/services'
import type { PlayState } from '@/components/services/ServicePlate'

/*
 * The three service illustrations. Each is a complete drawing in its first
 * frame (a wireframe, a disorganised page, loose screens) and plays once to
 * its finished state. Only transform and opacity animate.
 *
 * Sizes are `em` against the plate's 1cqw root: 1em is 1% of the plate's
 * width, so a left offset of 9% and a width of 9em are the same length.
 */

const EASE = [0.22, 1, 0.36, 1] as const

// A type alias (not an interface) so it satisfies Framer's target type.
type Pose = {
  opacity?: number
  x?: number | string
  y?: number | string
  rotate?: number
  scale?: number
  scaleX?: number
}

const REST: Required<Pose> = { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, scaleX: 1 }

/**
 * Motion props for one element: held at `from` until the plate plays, then
 * animated to `to` after `delay` seconds. In the instant (finished) state it
 * renders at `to` straight away.
 */
function step(state: PlayState, delay: number, from: Pose, to: Pose = {}, duration = 0.8) {
  const target = { ...REST, ...pick(from), ...to }
  return {
    initial: false as const,
    animate: state === 'start' ? from : target,
    transition: state === 'playing' ? { delay, duration, ease: EASE } : { duration: 0 },
  }
}

// The rest values for exactly the properties `from` moves.
function pick(from: Pose): Pose {
  const out: Pose = {}
  for (const key of Object.keys(from) as (keyof Pose)[]) {
    ;(out as Record<string, unknown>)[key] = REST[key]
  }
  return out
}

/** Pushes a layer toward the viewer, for the plate's pointer tilt. */
const lift = (px: number) => ({ transform: `translateZ(${px}px)` })

/* -------------------------------------------------------------------------- */
/* Shared pieces                                                               */
/* -------------------------------------------------------------------------- */

function BrowserWindow({ children }: { children: ReactNode }) {
  return (
    <div className="absolute left-[8%] top-[9%] h-[82%] w-[84%] rounded-[1.3em] border border-desk-line bg-white shadow-[0_0.2em_0.4em_rgba(46,43,110,0.05),0_1.6em_3.2em_-1.4em_rgba(46,43,110,0.32)] [transform-style:preserve-3d]">
      <div className="absolute inset-x-0 top-0 flex h-[8%] items-center gap-[0.55em] border-b border-desk-line px-[1.4em]">
        <span className="h-[0.75em] w-[0.75em] rounded-full bg-sketch" />
        <span className="h-[0.75em] w-[0.75em] rounded-full bg-sketch" />
        <span className="h-[0.75em] w-[0.75em] rounded-full bg-sketch" />
        <span className="mx-auto h-[1.5em] w-[34%] rounded-full bg-surface-raised" />
      </div>
      <div className="absolute inset-x-0 bottom-0 top-[8%] overflow-hidden rounded-b-[1.3em]">{children}</div>
    </div>
  )
}

/** A soft landscape: the "imagery" of the finished pages. */
function Landscape() {
  return (
    <svg viewBox="0 0 100 80" preserveAspectRatio="xMidYMid slice" className="h-full w-full" focusable="false">
      <rect width="100" height="80" className="fill-lavender-soft" />
      <circle cx="70" cy="24" r="9" className="fill-white" />
      <path d="M0 58 C 20 40, 38 44, 56 54 S 86 50, 100 42 V80 H0 Z" className="fill-lavender-mid" />
      <path d="M0 68 C 24 56, 46 60, 64 68 S 90 66, 100 62 V80 H0 Z" className="fill-accent/70" />
    </svg>
  )
}

/** A wireframe image placeholder: dashed box with a cross. */
function PlaceholderImage() {
  return (
    <div className="h-full w-full rounded-[0.6em] border-[0.15em] border-dashed border-sketch-line">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" focusable="false">
        <path d="M0 0 L100 100 M100 0 L0 100" className="stroke-sketch-line" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  )
}

function Bar({ className }: { className: string }) {
  return <span className={`block rounded-full ${className}`} />
}

function Cursor() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full drop-shadow-[0_0.15em_0.25em_rgba(46,43,110,0.35)]" focusable="false">
      <path d="M5 3 L19 12.5 L12.4 13.8 L9.2 20 Z" className="fill-text-primary stroke-white" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* 1. Landing pages & websites: a wireframe develops into the finished page.   */
/* -------------------------------------------------------------------------- */

function WebsiteIllustration({ state }: { state: PlayState }) {
  const hide = { opacity: 0 }
  const show = (delay: number) => step(state, delay, { opacity: 0, y: '0.8em' })
  const fade = (delay: number) => step(state, delay, { opacity: 1 }, hide, 0.6)
  return (
    <BrowserWindow>
      {/* Navigation */}
      <div className="absolute left-[5%] right-[5%] top-[6%] h-[6%]">
        <motion.div className="absolute inset-0 flex items-center justify-between" {...fade(0.1)}>
          <Bar className="h-[1em] w-[12%] bg-sketch" />
          <div className="flex gap-[1.6em]">
            <Bar className="h-[0.8em] w-[4em] bg-sketch" />
            <Bar className="h-[0.8em] w-[4em] bg-sketch" />
            <Bar className="h-[0.8em] w-[4em] bg-sketch" />
          </div>
        </motion.div>
        <motion.div className="absolute inset-0 flex items-center justify-between" {...show(0.15)}>
          <span className="flex items-center gap-[0.6em]">
            <span className="h-[1.5em] w-[1.5em] rounded-[0.4em] bg-accent" />
            <Bar className="h-[0.9em] w-[6em] bg-text-primary/80" />
          </span>
          <span className="flex gap-[1.6em]">
            <Bar className="h-[0.8em] w-[4em] bg-text-secondary/40" />
            <Bar className="h-[0.8em] w-[4em] bg-text-secondary/40" />
            <Bar className="h-[0.8em] w-[4em] bg-text-secondary/40" />
          </span>
        </motion.div>
      </div>

      {/* Headline */}
      <div className="absolute left-[5%] top-[22%] w-[48%]">
        <motion.div className="absolute inset-x-0 top-[0.3em] space-y-[0.9em]" {...fade(0.4)}>
          <Bar className="h-[2.8em] w-[88%] bg-sketch" />
          <Bar className="h-[2.8em] w-[62%] bg-sketch" />
        </motion.div>
        <motion.p
          className="font-display text-[4.3em] font-black leading-[1.02] tracking-[-0.035em] text-text-primary"
          {...show(0.45)}
        >
          {copy.websites.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </motion.p>
      </div>

      {/* Supporting text */}
      <div className="absolute left-[5%] top-[52%] w-[40%] space-y-[0.8em]">
        <motion.div className="absolute inset-0 space-y-[0.8em]" {...fade(0.95)}>
          <Bar className="h-[0.8em] w-full bg-sketch" />
          <Bar className="h-[0.8em] w-[90%] bg-sketch" />
          <Bar className="h-[0.8em] w-[64%] bg-sketch" />
        </motion.div>
        <motion.div className="space-y-[0.8em]" {...show(1)}>
          <Bar className="h-[0.8em] w-full bg-text-secondary/25" />
          <Bar className="h-[0.8em] w-[90%] bg-text-secondary/25" />
          <Bar className="h-[0.8em] w-[64%] bg-text-secondary/25" />
        </motion.div>
      </div>

      {/* Call to action, pressed by the cursor at the end */}
      <div className="absolute left-[5%] top-[70%] h-[10%] w-[21%]">
        <motion.div className="absolute inset-0 flex items-center justify-center rounded-[0.7em] border-[0.15em] border-dashed border-sketch-line" {...fade(1.2)}>
          <Bar className="h-[0.8em] w-[55%] bg-sketch" />
        </motion.div>
        <motion.div className="absolute inset-0" {...show(1.25)}>
          <motion.div
            className="flex h-full w-full items-center justify-center rounded-[0.7em] bg-accent text-[1.75em] font-medium text-white"
            initial={false}
            animate={state === 'playing' ? { scale: [1, 1, 0.93, 1] } : { scale: 1 }}
            transition={state === 'playing' ? { delay: 1.25, duration: 1.6, times: [0, 0.78, 0.88, 1] } : { duration: 0 }}
          >
            {copy.websites.cta}
          </motion.div>
        </motion.div>
      </div>

      {/* Image */}
      <div className="absolute left-[57%] top-[17%] h-[68%] w-[38%]">
        <motion.div className="absolute inset-0" {...fade(0.7)}>
          <PlaceholderImage />
        </motion.div>
        <motion.div className="absolute inset-0 overflow-hidden rounded-[0.8em]" {...step(state, 0.75, { opacity: 0, scale: 0.96 })}>
          <Landscape />
        </motion.div>
      </div>

      {/* Cursor: travels in from the lower right and clicks the button */}
      <motion.div
        className="absolute left-[19%] top-[78%] h-[3em] w-[3em]"
        {...step(state, 1.75, { opacity: 0, x: '36em', y: '6em' }, {}, 0.9)}
      >
        <Cursor />
      </motion.div>
    </BrowserWindow>
  )
}

/* -------------------------------------------------------------------------- */
/* 2. Audits & redesigns: problems are marked, then the page reorganises.      */
/* -------------------------------------------------------------------------- */

const FIX_AT = 2

const AUDIT_CARDS: { left: number; from: Pose }[] = [
  { left: 5, from: { x: '30em', y: '-11em', rotate: 8 } },
  { left: 36, from: { x: '-14em', y: '-19em', rotate: -6 } },
  { left: 67, from: { x: '-27em', y: '-3em', rotate: 4 } },
]

function AuditPin({ n, className, state, delay }: { n: number; className: string; state: PlayState; delay: number }) {
  // Appear during the audit, then step aside once the page is fixed. In the
  // finished (instant) state they are already gone.
  const playing = state === 'playing'
  return (
    <motion.span
      className={`absolute flex h-[2em] w-[2em] items-center justify-center rounded-full bg-accent text-[1.6em] font-semibold text-white shadow-[0_0.3em_0.8em_-0.2em_rgba(79,70,229,0.55)] ${className}`}
      style={lift(30)}
      initial={false}
      animate={playing ? { opacity: [0, 1, 1, 0], scale: [0.4, 1, 1, 0.7] } : { opacity: 0, scale: 0.4 }}
      transition={playing ? { delay, duration: FIX_AT + 0.5 - delay, times: [0, 0.14, 0.8, 1], ease: 'easeOut' } : { duration: 0 }}
    >
      {n}
    </motion.span>
  )
}

function AuditIllustration({ state }: { state: PlayState }) {
  // Each element sits in its finished place; `from` is where it starts out.
  const fix = (delay: number, from: Pose) => step(state, FIX_AT + delay, from, {}, 0.9)
  const swap = (delay: number, visibleAtStart: boolean) =>
    step(state, FIX_AT + delay, { opacity: visibleAtStart ? 1 : 0 }, { opacity: visibleAtStart ? 0 : 1 }, 0.5)
  return (
    <>
      <BrowserWindow>
        {/* Navigation: links scattered at first */}
        <div className="absolute left-[5%] right-[5%] top-[6%] flex h-[6%] items-center justify-between">
          <motion.span className="flex items-center gap-[0.6em]" {...fix(0, { x: '22em', y: '1.2em' })}>
            <span className="h-[1.5em] w-[1.5em] rounded-[0.4em] bg-accent" />
            <Bar className="h-[0.9em] w-[6em] bg-text-primary/80" />
          </motion.span>
          <span className="flex gap-[1.6em]">
            <motion.span {...fix(0.05, { y: '3.4em', x: '-9em', rotate: -6 })}>
              <Bar className="h-[0.8em] w-[4em] bg-text-secondary/40" />
            </motion.span>
            <motion.span {...fix(0.1, { y: '0.9em', x: '2em' })}>
              <Bar className="h-[0.8em] w-[4em] bg-text-secondary/40" />
            </motion.span>
            <motion.span {...fix(0.15, { y: '5.2em', x: '-3em', rotate: 8 })}>
              <Bar className="h-[0.8em] w-[4em] bg-text-secondary/40" />
            </motion.span>
          </span>
        </div>

        {/* Banner: tilted and cramped at first, then a clear band */}
        <motion.div
          className="absolute left-[5%] right-[5%] top-[17%] h-[41%] origin-left rounded-[1em] bg-lavender-soft"
          {...fix(0, { scaleX: 0.78, x: '2em', rotate: -2 })}
        />

        {/* Search field */}
        <motion.div
          className="absolute left-[9%] top-[41%] flex h-[9%] w-[47%] items-center gap-[0.8em] rounded-full border border-desk-line bg-white px-[1.3em]"
          {...fix(0.2, { x: '22em', y: '-7em', rotate: 6, scale: 0.8 })}
        >
          <span className="h-[1.3em] w-[1.3em] shrink-0 rounded-full border-[0.22em] border-text-secondary/40" />
          <Bar className="h-[0.75em] w-[45%] bg-text-secondary/25" />
        </motion.div>

        {/* Call to action: tucked away and grey, then clear and prominent */}
        <motion.div
          className="absolute left-[59%] top-[41%] h-[9%] w-[17%] origin-top-left"
          {...fix(0.3, { x: '-44em', y: '19em', scale: 0.6 })}
        >
          <motion.div className="absolute inset-0 rounded-full bg-sketch" {...swap(0.45, true)} />
          <motion.div
            className="absolute inset-0 flex items-center justify-center rounded-full bg-accent text-[1.75em] font-medium text-white"
            {...swap(0.45, false)}
          >
            {copy.audits.cta}
          </motion.div>
        </motion.div>

        {/* Three content cards: piled on top of each other, then a row */}
        {AUDIT_CARDS.map((card, i) => (
          <motion.div
            key={card.left}
            className="absolute top-[64%] h-[29%] w-[28%] rounded-[0.9em] border border-desk-line bg-white p-[1.4em]"
            style={{ left: `${card.left}%` }}
            {...fix(0.15 + i * 0.08, card.from)}
          >
            <span className="block h-[2.6em] w-[2.6em] rounded-[0.6em] bg-lavender" />
            <Bar className="mt-[1.1em] h-[0.8em] w-[70%] bg-text-primary/70" />
            <Bar className="mt-[0.7em] h-[0.7em] w-[90%] bg-text-secondary/20" />
          </motion.div>
        ))}
        {/* Headline: small and adrift, then leading the page */}
        <motion.p
          className="absolute left-[9%] top-[23%] w-[62%] origin-top-left font-display text-[4.1em] font-black leading-[1.02] tracking-[-0.035em] text-text-primary"
          // Offsets are in this element's own em (4.1× the plate unit).
          {...fix(0.1, { x: '7.3em', y: '6.6em', scale: 0.48, rotate: -4 })}
        >
          {copy.audits.headline}
        </motion.p>
      </BrowserWindow>

      {/* Audit markers on the three problems */}
      <AuditPin n={1} className="left-[47%] top-[40%]" state={state} delay={0.2} />
      <AuditPin n={2} className="left-[64%] top-[70%]" state={state} delay={0.55} />
      <AuditPin n={3} className="left-[22%] top-[71%]" state={state} delay={0.9} />
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* 3. Digital product & UX/UI: screens line up and connect into a journey.     */
/* -------------------------------------------------------------------------- */

const PHONE_LEFT = [8, 40.5, 73] // % of the plate; PHONE_W wide each
const PHONE_W = 19
const PHONE_START: Pose[] = [
  { x: '9em', y: '3em', rotate: -6 },
  { x: '0em', y: '-3em', rotate: 3 },
  { x: '-9em', y: '4em', rotate: 7 },
]

function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2.2em] border border-desk-line bg-white shadow-[0_0.2em_0.4em_rgba(46,43,110,0.05),0_1.4em_2.8em_-1.2em_rgba(46,43,110,0.34)]">
      <span className="absolute left-1/2 top-[3%] h-[2.4%] w-[30%] -translate-x-1/2 rounded-full bg-sketch" />
      <div className="absolute inset-x-[9%] bottom-[5%] top-[9%]">{children}</div>
    </div>
  )
}

function BrowseScreen() {
  return (
    <div className="flex h-full flex-col gap-[1em]">
      <Bar className="h-[2.2em] w-full bg-surface-raised" />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-[0.8em]">
          <span className="h-[4.2em] w-[4.2em] shrink-0 rounded-[0.6em] bg-lavender" />
          <span className="flex-1 space-y-[0.6em]">
            <Bar className="h-[0.7em] w-[90%] bg-text-secondary/35" />
            <Bar className="h-[0.7em] w-[60%] bg-text-secondary/20" />
          </span>
        </div>
      ))}
      <div className="mt-auto flex justify-between border-t border-desk-line px-[0.6em] pt-[0.9em]">
        <span className="h-[1.4em] w-[1.4em] rounded-[0.4em] bg-accent" />
        <span className="h-[1.4em] w-[1.4em] rounded-[0.4em] bg-sketch" />
        <span className="h-[1.4em] w-[1.4em] rounded-[0.4em] bg-sketch" />
      </div>
    </div>
  )
}

function ChooseScreen({ state }: { state: PlayState }) {
  return (
    <div className="flex h-full flex-col gap-[0.9em]">
      <span className="block h-[30%] overflow-hidden rounded-[0.8em]">
        <Landscape />
      </span>
      <Bar className="h-[1em] w-[75%] bg-text-primary/75" />
      <Bar className="h-[0.7em] w-full bg-text-secondary/20" />
      <div className="flex gap-[0.6em]">
        <span className="h-[1.8em] flex-1 rounded-full border border-desk-line" />
        <span className="relative h-[1.8em] flex-1 rounded-full border border-desk-line">
          <motion.span className="absolute inset-[-1px] rounded-full bg-accent" {...step(state, 1.5, { opacity: 0 }, {}, 0.3)} />
        </span>
        <span className="h-[1.8em] flex-1 rounded-full border border-desk-line" />
      </div>
      <span className="mt-auto block h-[3em] w-full rounded-[0.8em] bg-accent" />
    </div>
  )
}

function ConfirmScreen({ state }: { state: PlayState }) {
  return (
    <div className="flex h-full flex-col items-center gap-[0.9em] pt-[14%]">
      <motion.span
        className="flex h-[6.5em] w-[6.5em] items-center justify-center rounded-full bg-accent"
        {...step(state, 2.1, { scale: 0.3, opacity: 0 }, {}, 0.6)}
      >
        <svg viewBox="0 0 24 24" className="h-[55%] w-[55%]" focusable="false">
          <path d="M5 12.5 L10 17 L19 7.5" fill="none" className="stroke-white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.span>
      <Bar className="mt-[0.6em] h-[1em] w-[70%] bg-text-primary/75" />
      <Bar className="h-[0.7em] w-[85%] bg-text-secondary/20" />
      <div className="mt-[0.8em] w-full space-y-[0.7em] rounded-[0.8em] bg-surface-raised p-[0.9em]">
        <span className="flex items-center gap-[0.6em]">
          <span className="h-[2.6em] w-[2.6em] shrink-0 rounded-[0.5em] bg-lavender" />
          <Bar className="h-[0.7em] flex-1 bg-text-secondary/30" />
        </span>
        <Bar className="h-[0.7em] w-[70%] bg-text-secondary/20" />
      </div>
      <span className="mt-auto block h-[3em] w-full rounded-[0.8em] border border-desk-line" />
    </div>
  )
}

function JourneyIllustration({ state }: { state: PlayState }) {
  const screens = [<BrowseScreen key="b" />, <ChooseScreen key="c" state={state} />, <ConfirmScreen key="f" state={state} />]
  return (
    <>
      {/* Connectors: drawn left to right once the screens line up */}
      {[0, 1].map((i) => (
        <div key={i} className="absolute top-[43%] h-[0.4em]" style={{ left: `${PHONE_LEFT[i] + PHONE_W + 1.5}%`, width: `${PHONE_LEFT[i + 1] - PHONE_LEFT[i] - PHONE_W - 3}%`, ...lift(8) }}>
          <motion.span
            className="absolute inset-0 origin-left rounded-full bg-accent/45"
            {...step(state, 1.05 + i * 0.45, { scaleX: 0 }, {}, 0.45)}
          />
          <motion.span
            className="absolute -right-[0.5em] top-1/2 h-[1.3em] w-[1.3em] -translate-y-1/2 rounded-full border-[0.3em] border-accent/60 bg-white"
            {...step(state, 1.4 + i * 0.45, { opacity: 0 }, {}, 0.2)}
          />
          {/* A tap travelling along the connector */}
          <motion.span
            className="absolute left-0 top-1/2 h-[1.1em] w-[1.1em] -translate-y-1/2 rounded-full bg-accent"
            initial={false}
            animate={state === 'playing' ? { x: ['0em', '9.5em'], opacity: [0, 1, 1, 0] } : { x: '0em', opacity: 0 }}
            transition={state === 'playing' ? { delay: 1.05 + i * 0.45, duration: 0.5, ease: 'easeInOut' } : { duration: 0 }}
          />
        </div>
      ))}

      {PHONE_LEFT.map((left, i) => (
        <motion.div
          key={left}
          className="absolute top-[8%] aspect-[9/19] w-[19%]"
          style={{ left: `${left}%`, ...lift(16) }}
          {...step(state, 0.1 + i * 0.15, PHONE_START[i], {}, 0.9)}
        >
          <Phone>{screens[i]}</Phone>
        </motion.div>
      ))}

      {/* Step names under each screen */}
      {PHONE_LEFT.map((left, i) => (
        <motion.p
          key={`step-${left}`}
          className="absolute top-[83%] flex w-[19%] items-baseline justify-center gap-[0.5em] text-[2.1em] font-medium text-text-secondary"
          style={{ left: `${left}%` }}
          {...step(state, 0.95 + i * 0.4, { opacity: 0, y: '0.4em' }, {}, 0.5)}
        >
          <span className="text-accent">{i + 1}</span>
          {copy.product.steps[i]}
        </motion.p>
      ))}
    </>
  )
}

export default function ServiceIllustration({ id, state }: { id: ServiceId; state: PlayState }) {
  switch (id) {
    case 'websites':
      return <WebsiteIllustration state={state} />
    case 'audits':
      return <AuditIllustration state={state} />
    case 'product':
      return <JourneyIllustration state={state} />
  }
}
