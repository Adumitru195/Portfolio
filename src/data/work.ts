/**
 * Copy for the homepage "Selected work" section: the header, the featured
 * Backwater Journal presentation and the introduction to the other projects.
 *
 * Backwater Journal's release facts come from src/data/backwater-release.ts,
 * the same source as its case study.
 */
import { backwaterRelease } from '@/data/backwater-release'

const base = import.meta.env.BASE_URL

export const workSection = {
  label: 'Selected work',
  heading: ['Ideas, designed', 'into reality.'],
  intro:
    'A selection of independent products, design concepts, and research projects that reflect how I approach problems, explore ideas, and build digital experiences.',
}

export const featuredProject = {
  id: 'backwater-journal',
  label: 'Featured project · Released product',
  title: 'Backwater Journal',
  description:
    'From a personal interest in fishing to a released iOS application. I designed, developed, and launched an independent product that brings catch logging, map discovery, and an angler community together.',
  disciplines: ['Product strategy', 'UX/UI design', 'Development', 'App release'],
  facts: [
    { label: 'Released', value: backwaterRelease.released },
    { label: 'Latest version', value: backwaterRelease.latest.version },
    { label: 'Price', value: backwaterRelease.price },
  ],
  cta: 'Explore the case study',
  appStore: {
    label: 'View on the App Store',
    href: backwaterRelease.appStoreUrl,
  },
  /** Real screens from the app, each already framed as an iPhone (transparent corners). */
  screens: {
    front: {
      src: `${base}projects/backwater-journal/dock.webp`,
      width: 640,
      height: 1325,
    },
    back: {
      src: `${base}projects/backwater-journal/explore.webp`,
      width: 640,
      height: 1325,
    },
    alt: 'Backwater Journal on iPhone: the Dock screen showing fishing conditions for the evening, in front of the Explore map of nearby fishing spots.',
  },
}

export const moreWork = {
  label: 'More projects',
  intro: 'A closer look at website concepts, UX research, and visual design explorations, including the decisions behind each project.',
  /** Display order of the folder gallery. Backwater Journal is featured above it. */
  order: ['porchlight', 'afterglow-cinema', 'wovenward', 'aic-museum-experience', 'typography-systems'],
}
