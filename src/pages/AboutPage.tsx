import { useEffect } from 'react'
import { MotionConfig, motion } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUpRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AccentLine from '@/components/AccentLine'
import AboutPhotoStage from '@/components/about/AboutPhotoStage'
import BackwaterFrames from '@/components/about/BackwaterFrames'
import { aboutPage, aboutPhotos } from '@/data/about'
import { person } from '@/data/person'
import { fadeUp, lineMask, lineReveal, staggerContainer } from '@/lib/motion'

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'

// Selected blocks fade up once as they enter the viewport.
const reveal = {
  variants: staggerContainer,
  initial: 'hidden' as const,
  whileInView: 'visible' as const,
  viewport: { once: true, margin: '-12% 0px' },
}

// Hover lift only: whileTap would make the wrapper itself focusable, so the
// press feedback is a CSS active state on the link instead.
const press = { whileHover: { y: -2 }, transition: { duration: 0.2, ease: 'easeOut' } }

function Label({ children, tone = 'muted' }: { children: string; tone?: 'muted' | 'ink' }) {
  return (
    <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
      <AccentLine />
      <span className={`text-xs uppercase tracking-widest ${tone === 'ink' ? 'text-text-secondary' : 'text-text-muted'}`}>
        {children}
      </span>
    </motion.div>
  )
}

function TextLink({ to, children, external = false }: { to: string; children: string; external?: boolean }) {
  const Icon = external ? ArrowUpRight : ArrowRight
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-dim border-b border-accent/30 hover:border-accent-dim pb-1 transition-colors duration-200 rounded-sm ${focusRing}`}
    >
      {children}
      <Icon
        size={14}
        weight="bold"
        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-px"
      />
    </Link>
  )
}

/**
 * The About page (#/about): a personal introduction for prospective clients.
 * Motion is limited to a staggered entrance, pointer depth on the portrait
 * (desktop only) and once-only reveals; MotionConfig drops transforms for
 * visitors who prefer reduced motion. No WebGL on this page.
 */
export default function AboutPage() {
  const { opening, strengths, backwater, working, beyond, closing } = aboutPage

  useEffect(() => {
    const previous = document.title
    document.title = `About | ${person.name}`
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main className="overflow-x-clip">
        {/* 1. Opening */}
        <section className="px-6 md:px-10 pt-28 md:pt-36 pb-24 md:pb-32">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="content-wide grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-16 lg:gap-y-0 items-center"
          >
            <div className="lg:col-span-7">
              <Label tone="ink">{opening.label}</Label>
              <motion.h1
                variants={lineMask}
                className="font-display font-black text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[3.75rem] xl:text-[4.5rem] tracking-tightest leading-[0.94] text-text-primary mb-10"
              >
                {opening.headline.map((line, i) => (
                  <span key={line} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                    <motion.span variants={lineReveal} className={`block ${i === 1 ? 'text-accent md:pl-[12%] lg:pl-0' : ''}`}>
                      {line}
                    </motion.span>
                  </span>
                ))}
              </motion.h1>

              <div className="max-w-[36rem] space-y-5">
                <motion.p variants={fadeUp} className="text-xl md:text-[1.375rem] leading-relaxed text-text-primary">
                  {opening.intro}
                </motion.p>
                <motion.p variants={fadeUp} className="text-lg leading-relaxed text-text-secondary">
                  {opening.supporting}
                </motion.p>
                <motion.p variants={fadeUp} className="text-lg leading-relaxed text-text-secondary">
                  {opening.background}
                </motion.p>
              </div>

              <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-3">
                <motion.div {...press}>
                  <Link
                    to="/"
                    state={{ scrollTo: 'contact' }}
                    className={`inline-flex items-center gap-2 bg-accent hover:bg-accent-dim text-white text-sm font-medium px-5 py-3 rounded-full transition-[color,background-color,border-color,transform] duration-200 active:scale-[0.98] ${focusRing}`}
                  >
                    {opening.contactLabel}
                    <ArrowRight size={14} weight="bold" />
                  </Link>
                </motion.div>
                <motion.div {...press}>
                  <Link
                    to="/"
                    state={{ scrollTo: 'work' }}
                    className={`inline-flex items-center gap-2 border border-subtle hover:border-text-muted text-text-secondary hover:text-text-primary text-sm font-medium px-5 py-3 rounded-full transition-[color,background-color,border-color,transform] duration-200 active:scale-[0.98] ${focusRing}`}
                  >
                    {opening.workLabel}
                    <ArrowDown size={14} weight="bold" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            <div className="lg:col-span-5 lg:col-start-8 xl:col-span-4 xl:col-start-9 w-full max-w-[24rem] sm:max-w-[30rem] mx-auto lg:max-w-[25rem] xl:max-w-[26rem] lg:mr-0 lg:justify-self-end">
              <AboutPhotoStage main={aboutPhotos.main} support={aboutPhotos.support} location={opening.location} />
            </div>
          </motion.div>
        </section>

        {/* 2. What I bring: three rows, each pairing a strength with a detail from a project */}
        <section className="px-6 md:px-10 py-24 md:py-32 border-t border-subtle">
          <div className="content-wide">
            <motion.h2
              {...reveal}
              variants={fadeUp}
              className="font-display font-black text-4xl md:text-6xl tracking-tighter leading-[1.02] text-text-primary max-w-[14ch] mb-16 md:mb-20"
            >
              {strengths.heading}
            </motion.h2>

            <ol className="m-0 list-none p-0 space-y-20 md:space-y-24 lg:space-y-28">
              {strengths.items.map((item, i) => (
                <motion.li
                  key={item.title}
                  {...reveal}
                  variants={fadeUp}
                  className="grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-8 md:items-center"
                >
                  <figure className="m-0 md:col-span-7 lg:col-span-6 xl:col-span-5 lg:max-w-[40rem]">
                    {item.detail.presentation === 'phone' ? (
                      <div className="md:flex md:aspect-[4/3] md:items-center md:justify-center md:overflow-hidden md:rounded-2xl md:border md:border-subtle md:bg-porch-sunken">
                        <div className="overflow-hidden rounded-2xl border border-subtle bg-surface aspect-[390/365] w-full md:h-[86%] md:w-auto md:rounded-xl md:border-porch-border md:shadow-[0_18px_36px_-24px_rgba(90,84,75,0.45)]">
                          <img
                            src={item.detail.src}
                            width={item.detail.width}
                            height={item.detail.height}
                            alt={item.detail.alt}
                            loading="lazy"
                            decoding="async"
                            style={{ objectPosition: item.detail.focus }}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="overflow-hidden rounded-2xl border border-subtle bg-surface aspect-[4/3]">
                        <img
                          src={item.detail.src}
                          width={item.detail.width}
                          height={item.detail.height}
                          alt={item.detail.alt}
                          loading="lazy"
                          decoding="async"
                          style={{ objectPosition: item.detail.focus }}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                        />
                      </div>
                    )}
                    <figcaption className="mt-3 text-xs text-text-muted">
                      <Link
                        to={`/project/${item.detail.projectId}`}
                        className={`hover:text-accent transition-colors duration-200 rounded-sm ${focusRing}`}
                      >
                        {item.detail.caption}
                      </Link>
                    </figcaption>
                  </figure>
                  <div className="md:col-span-5 lg:col-span-5 lg:col-start-8 xl:col-span-4 xl:col-start-8 max-w-[30rem]">
                    <span aria-hidden="true" className="block font-display font-bold text-sm tracking-widest text-accent mb-4">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-text-primary mb-4">{item.title}</h3>
                    <p className="text-lg leading-relaxed text-text-secondary">{item.body}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* 3. Backwater Journal: the shipped proof point, on the app's own paper */}
        <section className="px-6 md:px-10 py-24 md:py-32 bg-backwater-paper border-y border-backwater-edge">
          <div className="content-wide grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-16 items-center">
            <motion.div {...reveal} className="lg:col-span-5 max-w-[34rem]">
              <Label tone="ink">{backwater.label}</Label>
              <motion.h2
                variants={fadeUp}
                className="font-display font-black text-4xl md:text-6xl tracking-tighter leading-[1.02] text-text-primary mb-8 text-balance"
              >
                {backwater.heading}
              </motion.h2>
              {backwater.body.map((paragraph, i) => (
                <motion.p
                  key={paragraph}
                  variants={fadeUp}
                  className={i === 0 ? 'text-xl md:text-2xl leading-snug text-text-primary mb-5 font-medium' : 'text-lg leading-relaxed text-text-secondary mb-8 max-w-[32rem]'}
                >
                  {paragraph}
                </motion.p>
              ))}
              <motion.div variants={fadeUp}>
                <TextLink to={`/project/${backwater.projectId}`} external>
                  {backwater.linkLabel}
                </TextLink>
              </motion.div>
            </motion.div>

            <div className="lg:col-span-6 lg:col-start-7 xl:col-span-5 xl:col-start-8">
              <BackwaterFrames frames={backwater.frames} className="mx-auto lg:mr-0" />
            </div>
          </div>
        </section>

        {/* 4. Working with me */}
        <section className="px-6 md:px-10 py-24 md:py-32">
          <motion.div {...reveal} className="content-wide grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-10">
            <motion.h2
              variants={fadeUp}
              className="lg:col-span-4 font-display font-black text-4xl md:text-6xl tracking-tighter leading-[1.02] text-text-primary max-w-[12ch] lg:self-start lg:sticky lg:top-28"
            >
              {working.heading}
            </motion.h2>
            <dl className="m-0 lg:col-span-7 lg:col-start-6 xl:col-span-5 xl:col-start-8">
              {working.notes.map((note) => (
                <motion.div
                  key={note.title}
                  variants={fadeUp}
                  className="py-8 md:py-10 border-t border-subtle first:border-t-0 first:pt-0 lg:first:pt-2 last:pb-0"
                >
                  <dt className="font-display font-bold text-xl md:text-2xl tracking-tight text-text-primary">{note.title}</dt>
                  <dd className="m-0 mt-3 max-w-[36rem] text-lg leading-relaxed text-text-secondary">{note.body}</dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </section>

        {/* 5. Beyond the screen: a large photograph beside a short personal note */}
        <section className="px-6 md:px-10 py-24 md:py-32 border-t border-subtle">
          <div className="content-wide grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-12 items-center">
            <motion.figure
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="lg:col-span-6 xl:col-span-5 overflow-hidden rounded-[28px] bg-surface-raised aspect-[4/5] sm:aspect-[4/3]"
            >
              <motion.img
                src={aboutPhotos.beyond.sources[aboutPhotos.beyond.sources.length - 1].src}
                srcSet={aboutPhotos.beyond.sources.map((s) => `${s.src} ${s.width}w`).join(', ')}
                sizes="(min-width: 1280px) 640px, (min-width: 1024px) 46vw, (min-width: 640px) calc(100vw - 80px), 140vw"
                width={aboutPhotos.beyond.width}
                height={aboutPhotos.beyond.height}
                alt={aboutPhotos.beyond.alt}
                loading="lazy"
                decoding="async"
                initial={{ scale: 1.06 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: '-15% 0px' }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="block w-full h-full object-cover object-[52%_50%]"
              />
            </motion.figure>
            <motion.div {...reveal} className="lg:col-span-5 lg:col-start-8 xl:col-span-4 xl:col-start-8 max-w-[30rem]">
              <motion.h2
                variants={fadeUp}
                className="font-display font-black text-4xl md:text-6xl tracking-tighter leading-[1.02] text-text-primary mb-6"
              >
                {beyond.heading}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-lg leading-relaxed text-text-secondary">
                {beyond.body}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* 6. Closing */}
        <section className="px-6 md:px-10 pt-24 md:pt-32 pb-28 md:pb-36 border-t border-subtle">
          <motion.div {...reveal} className="content-wide grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-12 items-center">
            <div className="lg:col-span-8">
              <motion.h2
                variants={fadeUp}
                className="font-display font-black text-5xl md:text-7xl tracking-tightest leading-[0.95] text-text-primary mb-8 max-w-[13ch]"
              >
                {closing.heading}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-lg md:text-xl leading-relaxed text-text-secondary max-w-[34rem]">
                {closing.body}
              </motion.p>
            </div>
            <motion.div variants={fadeUp} className="lg:col-span-4 lg:justify-self-end">
              <motion.div whileHover={{ scale: 1.04 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <Link
                  to="/"
                  state={{ scrollTo: 'contact' }}
                  className={`group flex flex-col items-center justify-center gap-2 w-36 h-36 md:w-44 md:h-44 rounded-full bg-accent hover:bg-accent-dim text-white font-medium text-lg transition-[background-color,transform] duration-200 active:scale-[0.97] shadow-[0_24px_48px_-20px_rgba(79,70,229,0.55)] ${focusRing}`}
                >
                  {closing.buttonLabel}
                  <ArrowRight size={20} weight="bold" className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </MotionConfig>
  )
}
