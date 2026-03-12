import { ArrowUpRight } from '@phosphor-icons/react'
import { person } from '@/data/person'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-subtle px-6 md:px-10 py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <p className="text-text-muted text-sm">
          &copy; {year} {person.name}. All rights reserved.
        </p>

        <ul className="flex items-center gap-6">
          {person.socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                {social.label}
                <ArrowUpRight size={12} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
