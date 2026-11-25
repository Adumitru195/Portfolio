import type { PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import MapAttribution from '@/components/MapAttribution'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react'
import { staggerContainer, fadeUp } from '@/lib/motion'
import { featuredProject as f } from '@/data/work'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'
import { useReveal } from '@/hooks/useReveal'

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-backwater-forest'

const SPRING = { stiffness: 100, damping: 20 }
const TILT = { x: 4, y: 6 }
const EASE = [0.22, 1, 0.36, 1] as const

// The phones rise into place after the copy, the nearer one last.
const rise = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 72 },
  visible: { opacity: 1, y: 0, transition: { delay, duration: 1, ease: EASE } },
})

/**
 * Faint contour lines, a nod to the map-led product. Decorative.
 */
function Contours() {
  const ring =
    'M520 70 C 650 60 760 150 770 270 C 780 400 690 480 560 500 C 430 520 330 470 300 360 C 270 250 390 80 520 70 Z'
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 800 560"
      preserveAspectRatio="xMaxYMid slice"
      className="pointer-events-none absolute inset-y-0 right-0 h-full w-full xl:w-[70%]"
    >
      {[0.35, 0.55, 0.75, 0.95, 1.15, 1.35, 1.6].map((k) => (
        <path
          key={k}
          d={ring}
          transform={`translate(540 290) scale(${k}) translate(-540 -290)`}
          fill="none"
          className="stroke-backwater-forest/[0.09]"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  )
}

/**
 * The featured Backwater Journal presentation above the project folders: the
 * product's story and verified release facts beside two real screens from the
 * app, layered in CSS perspective. On desktops with a mouse the phones tilt
 * a few degrees toward the pointer on a damped spring.
 */
export default function FeaturedProject() {
  const reveal = useReveal({ once: true, margin: '-10% 0px' })
  const reduceMotion = useReducedMotionPreference()
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const tiltEnabled = finePointer && !reduceMotion

  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const rotateX = useSpring(rx, SPRING)
  const rotateY = useSpring(ry, SPRING)

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!tiltEnabled || event.pointerType !== 'mouse') return
    const r = event.currentTarget.getBoundingClientRect()
    rx.set(-(((event.clientY - r.top) / r.height) * 2 - 1) * TILT.x)
    ry.set((((event.clientX - r.left) / r.width) * 2 - 1) * TILT.y)
  }
  const onPointerLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.article
      aria-labelledby="featured-title"
      variants={staggerContainer}
      {...reveal}
      className="relative isolate overflow-hidden rounded-[28px] border border-backwater-line bg-backwater-stage"
    >
      <Contours />

      <div className="relative grid grid-cols-1 xl:grid-cols-12 xl:gap-x-10">
        <motion.div
          variants={fadeUp}
          className="px-6 pb-2 pt-10 sm:px-10 md:px-14 md:pt-14 xl:col-span-6 xl:py-20 xl:pl-16 xl:pr-0"
        >
          <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-backwater-forest">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-backwater-brass" />
            {f.label}
          </p>
          <h3
            id="featured-title"
            className="mt-5 font-display text-[clamp(2.5rem,1.5rem+3.2vw,4.75rem)] font-black leading-[0.98] tracking-[-0.03em] text-backwater-ink"
          >
            {f.title}
          </h3>
          <p className="mt-6 max-w-[34rem] text-pretty text-base leading-relaxed text-backwater-ink/80 md:text-lg">
            {f.description}
          </p>

          <ul aria-label="My role" className="mt-6 flex flex-wrap gap-2">
            {f.disciplines.map((item) => (
              <li
                key={item}
                className="rounded-md border border-backwater-line bg-white/70 px-2.5 py-1 text-[0.8125rem] font-medium text-backwater-ink"
              >
                {item}
              </li>
            ))}
          </ul>

          <dl className="mt-8 grid max-w-[34rem] grid-cols-2 gap-x-6 gap-y-4 border-t border-backwater-line pt-6 sm:grid-cols-3">
            {f.facts.map((fact, i) => (
              <div key={fact.label} className={i === f.facts.length - 1 ? 'col-span-2 sm:col-span-1' : undefined}>
                <dt className="text-xs uppercase tracking-[0.12em] text-backwater-ink/75">{fact.label}</dt>
                <dd className="mt-1 text-sm font-medium text-backwater-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <MapAttribution subject="Map in the Explore screen" className="mt-3 text-backwater-ink/75" linkClassName={focusRing} />

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link
              to={`/project/${f.id}`}
              className={`group inline-flex min-h-[48px] items-center gap-2 rounded-full bg-backwater-forest px-6 text-sm font-medium text-backwater-stage transition-colors duration-200 hover:bg-backwater-forest-dim ${focusRing}`}
            >
              {f.cta}
              <ArrowRight
                size={15}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:transform-none"
              />
            </Link>
            <a
              href={f.appStore.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-sm text-sm font-medium text-backwater-forest underline-offset-4 hover:underline ${focusRing}`}
            >
              {f.appStore.label}
              <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </motion.div>

        {/* Two real screens rising from the bottom edge of the stage */}
        <div
          role="img"
          aria-label={f.screens.alt}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          className="relative h-[25rem] select-none [perspective:1400px] sm:h-[30rem] xl:col-span-6 xl:h-auto xl:min-h-[38rem]"
        >
          <motion.div
            className="absolute inset-0 [transform-style:preserve-3d]"
            style={tiltEnabled ? { rotateX, rotateY } : undefined}
          >
            {/* A bounded box keeps the pair together on wide stacked layouts */}
            <div className="absolute inset-y-0 left-0 right-0 mx-auto max-w-[40rem] [transform-style:preserve-3d]">
            <motion.img
              variants={rise(0.25)}
              src={f.screens.back.src}
              width={f.screens.back.width}
              height={f.screens.back.height}
              alt=""
              loading="lazy"
              decoding="async"
              draggable={false}
              style={{ rotate: -6, z: -40 }}
              className="absolute left-[4%] top-[16%] w-[48%] max-w-[17rem] 2xl:max-w-[19.5rem] sm:left-[9%] sm:w-[41%] drop-shadow-[0_28px_36px_rgba(32,56,47,0.26)] xl:left-[12%] xl:top-auto xl:-bottom-[9%]"
            />
            <motion.img
              variants={rise(0.45)}
              src={f.screens.front.src}
              width={f.screens.front.width}
              height={f.screens.front.height}
              alt=""
              loading="lazy"
              decoding="async"
              draggable={false}
              style={{ rotate: 3, z: 24 }}
              className="absolute left-[44%] top-[7%] w-[52%] max-w-[18.5rem] 2xl:max-w-[21.5rem] sm:left-[45%] sm:w-[45%] drop-shadow-[0_34px_44px_rgba(32,56,47,0.32)] xl:left-[46%] xl:top-auto xl:-bottom-[3%]"
            />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.article>
  )
}
