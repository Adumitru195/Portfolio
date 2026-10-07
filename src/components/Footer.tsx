import { ArrowUpRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { footer } from '@/data/contact'
import { useSiteNavigation } from '@/hooks/useSiteNavigation'

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'

/**
 * The site-wide footer: an inset lavender panel with the wordmark, a short
 * navigation list and contact links. Rendered once per route (homepage,
 * About and every case study).
 */
export default function Footer() {
  const { goToSection } = useSiteNavigation()
  const year = new Date().getFullYear()
  const navLink = `inline-flex py-1.5 text-lg text-text-secondary hover:text-text-primary transition-colors duration-200 rounded-sm ${focusRing}`

  return (
    // Its own stacking layer keeps it above fixed page backdrops (the
    // case-study wave canvas), so its links stay clickable.
    <footer className="relative z-10 px-3 sm:px-6 md:px-10 pb-3 sm:pb-6 md:pb-10">
      <div className="max-w-6xl mx-auto rounded-[28px] md:rounded-[36px] bg-lavender-soft px-6 py-10 sm:px-10 md:px-14 md:py-14">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <div>
            <Link
              to="/"
              onClick={(e) => goToSection(e, 'top')}
              className={`inline-block font-display font-black text-6xl md:text-8xl tracking-tightest leading-[0.9] text-text-primary rounded-md ${focusRing}`}
            >
              {footer.wordmark}
              <span className="text-accent">.</span>
              <span className="sr-only">, home</span>
            </Link>
            <p className="mt-4 text-text-secondary">{footer.tagline}</p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-col">
              <li>
                <Link to="/" state={{ scrollTo: 'work' }} onClick={(e) => goToSection(e, 'work')} className={navLink}>
                  Work
                </Link>
              </li>
              <li>
                <Link to="/about" className={navLink}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/" state={{ scrollTo: 'contact' }} onClick={(e) => goToSection(e, 'contact')} className={navLink}>
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Reading order on phones: contact links, then the copyright */}
        <div className="mt-12 md:mt-16 pt-6 border-t border-lavender-line flex flex-col sm:flex-row-reverse sm:items-center sm:justify-between gap-4">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footer.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className={`group inline-flex items-center gap-1 py-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors duration-200 rounded-sm ${focusRing}`}
                >
                  {link.label}
                  <ArrowUpRight
                    size={12}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                  {link.external && <span className="sr-only">(opens in a new tab)</span>}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-sm text-text-secondary">
            &copy; {year} {footer.copyrightName}
          </p>
        </div>
      </div>
    </footer>
  )
}
