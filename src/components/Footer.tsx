import { person } from '@/data/person'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-subtle px-6 md:px-10 py-10">
      <div className="max-w-6xl mx-auto">
        <p className="text-text-muted text-sm">
          &copy; {year} {person.name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
