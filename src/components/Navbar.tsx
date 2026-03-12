import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from '@phosphor-icons/react'
import { person } from '@/data/person'

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const { scrollY } = useScroll()
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1])

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 glass"
      style={{ borderBottomWidth: 1, borderBottomColor: `rgba(240,237,232,${borderOpacity.get() * 0.08})` }}
    >
      <nav className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <a
          href="#"
          className="font-display font-bold text-text-primary tracking-tight hover:text-accent transition-colors duration-200"
        >
          {person.name.split(' ')[0]}<span className="text-text-muted">.</span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={`mailto:${person.email}`}
          className="flex items-center gap-1.5 text-sm font-medium text-ink bg-accent hover:bg-accent-dim px-4 py-2 rounded-full transition-colors duration-200"
        >
          Get in touch
          <ArrowUpRight size={14} weight="bold" />
        </a>
      </nav>
    </motion.header>
  )
}
