import { person } from '@/data/person'

/** Copy for the homepage contact section and the site footer. */

const linkedIn = person.socials.find((s) => s.label === 'LinkedIn')

// A short, optional brief the visitor can fill in or delete.
const inquiryBody = [
  'Hi Andrew,',
  '',
  'What I’m working on:',
  '',
  'What I’d like help with (a new website, a redesign, an app or product idea):',
  '',
  'Timeline, if you have one:',
  '',
  'Anything else:',
  '',
].join('\n')

export const contact = {
  label: 'Let’s connect',
  headline: 'Something in mind?',
  headlineAccent: 'Let’s make it happen.',
  body: 'Whether you need a new website, want to improve an existing experience, or have an idea for a digital product, I’d like to hear what you’re working on.',
  primaryCta: 'Start a project',
  email: person.email,
  mailto: `mailto:${person.email}`,
  /** The "Start a project" email: a subject line and the optional brief. */
  inquiryMailto: `mailto:${person.email}?subject=${encodeURIComponent('Project inquiry')}&body=${encodeURIComponent(inquiryBody)}`,
  emailPrefix: 'Or email me directly at',
  copy: {
    label: 'Copy email',
    done: 'Copied',
    announceDone: 'Email address copied',
    failed: 'Couldn’t copy. Select the address to copy it.',
  },
  opportunities: 'Also open to UX design opportunities and collaborations.',
}

export const footer = {
  wordmark: person.name.split(' ')[0],
  tagline: ['Independent designer & digital product builder.', 'Based in Chicago, Illinois.'],
  copyrightName: person.name,
  reduceMotion: {
    label: 'Reduce motion',
    systemNote: 'On in your system settings',
  },
  links: [
    ...(linkedIn ? [{ label: 'LinkedIn', href: linkedIn.url, external: true }] : []),
    { label: 'Email', href: `mailto:${person.email}`, external: false },
  ],
}
