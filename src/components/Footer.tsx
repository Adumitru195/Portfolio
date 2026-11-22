import { ArrowUpRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { footer } from '@/data/contact'
import { useSiteNavigation } from '@/hooks/useSiteNavigation'
import { useSystemReduceMotion, useUserReduceMotion } from '@/hooks/useReducedMotionPreference'
import { setUserReduceMotion } from '@/lib/motionPreference'

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'

/**
 * Stops the site's decorative motion (the hero composition, 3D illustrations,
 * entrance movement) and remembers the choice on this device. When the
 * system already asks for reduced motion it shows as on and can't be
 * turned off here.
 */
function ReduceMotionToggle() {
  const user = useUserReduceMotion()
  const system = useSystemReduceMotion()
  const on = user || system

  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={system}
      onClick={() => setUserReduceMotion(!user)}
      className={`group inline-flex items-center gap-2.5 py-3 sm:py-1.5 text-sm text-text-secondary enabled:hover:text-text-primary transition-colors duration-200 rounded-sm disabled:cursor-default ${focusRing}`}
    >
      <span
        aria-hidden="true"
        className={`relative h-4 w-7 shrink-0 rounded-full border transition-colors duration-200 ${
          on ? 'border-accent bg-accent' : 'border-lavender-line bg-white'
        }`}
      >
        <span
          className={`absolute left-0.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full transition-transform duration-200 ${
            on ? 'translate-x-3 bg-white' : 'translate-x-0 bg-text-muted'
          }`}
        />
      </span>
      {footer.reduceMotion.label}
      {system && <span className="text-text-muted">({footer.reduceMotion.systemNote})</span>}
    </button>
  )
}

/**
 * The site-wide footer: a lavender panel on the same content width as the
 * navigation and page sections, with the wordmark and tagline, the page
 * links, the contact links, then the copyright and the motion toggle.
 * Rendered once per route (homepage, About and every case study).
 */
export default function Footer() {
  const { goToSection } = useSiteNavigation()
  const year = new Date().getFullYear()
  const linkClass = `group inline-flex items-center gap-1 py-2 md:py-1.5 text-base text-text-secondary hover:text-text-primary transition-colors duration-200 rounded-sm ${focusRing}`
  const columnLabel = 'text-xs font-medium uppercase tracking-widest text-text-secondary'

  return (
    // Its own stacking layer keeps it above fixed page backdrops (the
    // case-study wave canvas), so its links stay clickable.
    <footer className="relative z-10 px-6 pb-6 pt-6 md:px-10 md:pb-10 md:pt-8">
      <div className="content-wide rounded-[28px] bg-lavender-soft px-6 pb-6 pt-10 sm:px-10 md:px-14 md:pb-8 md:pt-14 xl:px-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-12 md:gap-x-10">
          <div className="col-span-2 md:col-span-6">
            <Link
              to="/"
              onClick={(e) => goToSection(e, 'top')}
              className={`inline-block font-display text-6xl font-black leading-[0.9] tracking-tightest text-text-primary md:text-7xl lg:text-8xl rounded-md ${focusRing}`}
            >
              {footer.wordmark}
              <span className="text-accent">.</span>
              <span className="sr-only">, home</span>
            </Link>
            <p className="mt-5 max-w-[26rem] text-base leading-relaxed text-text-secondary md:text-lg">
              {footer.tagline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3 md:col-start-8">
            <p className={columnLabel}>Pages</p>
            <ul className="mt-3 flex flex-col">
              <li>
                <Link to="/" state={{ scrollTo: 'work' }} onClick={(e) => goToSection(e, 'work')} className={linkClass}>
                  Work
                </Link>
              </li>
              <li>
                <Link to="/about" className={linkClass}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/" state={{ scrollTo: 'contact' }} onClick={(e) => goToSection(e, 'contact')} className={linkClass}>
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div className="md:col-span-2">
            <p className={columnLabel}>Connect</p>
            <ul className="mt-3 flex flex-col">
              {footer.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className={linkClass}
                  >
                    {link.label}
                    <ArrowUpRight
                      size={13}
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:transform-none"
                    />
                    {link.external && <span className="sr-only">(opens in a new tab)</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-1 border-t border-lavender-line pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:mt-16">
          <p className="py-3 text-sm text-text-secondary sm:py-1.5">
            &copy; {year} {footer.copyrightName}
          </p>
          <ReduceMotionToggle />
        </div>
      </div>
    </footer>
  )
}
