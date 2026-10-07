import { person } from '@/data/person'

/** Copy for the homepage contact section and the site footer. */

const linkedIn = person.socials.find((s) => s.label === 'LinkedIn')

export const contact = {
  label: 'Contact',
  headline: 'Let’s make something',
  headlineAccent: 'worth remembering.',
  body: 'Have a website, app or redesign in mind? Tell me what you’re working on.',
  email: person.email,
  mailto: `mailto:${person.email}`,
  copiedLabel: 'Email address copied',
}

export const footer = {
  wordmark: person.name.split(' ')[0],
  tagline: 'Independent UX/UI designer · Chicago',
  copyrightName: person.name,
  links: [
    ...(linkedIn ? [{ label: 'LinkedIn', href: linkedIn.url, external: true }] : []),
    { label: 'Email', href: `mailto:${person.email}`, external: false },
  ],
}
