import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, DownloadSimple } from '@phosphor-icons/react'
import { person } from '@/data/person'

const navLinks = [
  { label: 'Work', id: 'work' },
  { label: 'About', id: 'about' },
  { label: 'Contact', id: 'contact' },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Navbar() {
  const { scrollY } = useScroll()
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1])

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 glass"
      style={{ borderBottomWidth: 1, borderBottomColor: `rgba(0,0,0,${borderOpacity.get() * 0.08})` }}
    >
      <nav className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-display font-bold text-text-primary tracking-tight hover:text-accent transition-colors duration-200"
        >
          {person.name.split(' ')[0]}<span className="text-text-muted">.</span>
        </button>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.id}>
              <button
                onClick={() => scrollTo(link.id)}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <motion.a
            href="/Portfolio/AndrewDumitruResume.pdf"
            download
            className="hidden md:flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary border border-subtle hover:border-text-muted px-4 py-2 rounded-full transition-colors duration-200"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            Resume
            <DownloadSimple size={14} weight="bold" />
          </motion.a>
          <motion.a
            href={`mailto:${person.email}`}
            className="flex items-center gap-1.5 text-sm font-medium text-ink bg-accent hover:bg-accent-dim px-4 py-2 rounded-full transition-colors duration-200"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            Get in touch
            <ArrowUpRight size={14} weight="bold" />
          </motion.a>
        </div>
      </nav>
    </motion.header>
  )
}
