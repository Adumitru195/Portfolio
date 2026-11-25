// Homepage folder cards: the short card copy and the folder tint for each
// project. Titles, routes, roles, covers and alt text come from projects.ts.

export type FolderTint = 'sage' | 'stone' | 'cream' | 'midnight' | 'porcelain' | 'paper'

/** What kind of work a project is, as its own case study states it. */
export type WorkKind = 'Released product' | 'Personal concept' | 'Academic project'

export interface WorkFolder {
  kind: WorkKind
  /** Concise category or role line shown above the description. */
  label: string
  /** One or two sentences that fit a card; the full description stays in projects.ts. */
  summary: string
  tint: FolderTint
  /** Tailwind object-position class when a cover is not 16:9. */
  imagePosition?: string
  /** A cover composed for the card (scripts/folder-covers.mjs); defaults to the project image. */
  cover?: { src: string; alt: string }
}

export const workFolders: Record<string, WorkFolder> = {
  'backwater-journal': {
    kind: 'Released product',
    label: 'iOS product · Design + development',
    summary: 'A released iOS fishing app for catch logging, map discovery, community, and gear trading.',
    tint: 'sage',
    cover: {
      src: '/Portfolio/projects/backwater-journal/backwater-folder-cover.jpg',
      alt: 'Backwater Journal title beside the current Dock screen, showing fishing conditions, and the Explore map screen.',
    },
  },
  'aic-museum-experience': {
    kind: 'Academic project',
    label: 'Academic group project · UX research',
    summary: 'An academic museum companion concept shaped by twelve visitor interviews and journey mapping.',
    tint: 'stone',
    cover: {
      src: '/Portfolio/projects/aic-museum-experience/aic-folder-cover.jpg',
      alt: 'AIC Museum Experience title beside Georges Seurat’s A Sunday on La Grande Jatte, a public-domain painting from the Art Institute of Chicago, hung in a pale arch.',
    },
  },
  porchlight: {
    kind: 'Personal concept',
    label: 'Responsive web · UX + UI',
    summary: 'A rental discovery redesign with practical search, clear costs, and an honest tour request flow.',
    tint: 'cream',
    // The 16:10 cover ends in an empty band; anchoring to the top crops only that.
    imagePosition: 'object-top',
  },
  'afterglow-cinema': {
    kind: 'Personal concept',
    label: 'Responsive web · UX + UI',
    summary: 'A cinema experience connecting film discovery, showtimes, and a clear showing summary.',
    tint: 'midnight',
  },
  wovenward: {
    kind: 'Personal concept',
    label: 'E-commerce · UX + UI',
    summary: 'A clothing shop concept with in-stock size filtering, fit guidance, and bag review.',
    tint: 'porcelain',
  },
  'typography-systems': {
    kind: 'Academic project',
    label: 'Editorial design · Typography',
    summary: 'Two editorial studies exploring typography, hierarchy, and composition.',
    tint: 'paper',
  },
}

// Paper colours for the loose sheets tucked behind each preview. The CSS
// fallback (index.css, .folder-tint-*) and the 3D layer use the same values.
export const folderSheetColors: Record<FolderTint, { back: string; front: string; edge: string; shadow: string }> = {
  sage: { back: '#E9EFE4', front: '#F6F4EC', edge: '#C2CCBA', shadow: '#2E4034' },
  stone: { back: '#F1E6DF', front: '#FAF5F0', edge: '#D3C2B5', shadow: '#4A2A30' },
  cream: { back: '#F3ECDD', front: '#FCF9F2', edge: '#DACDB5', shadow: '#2F3B2C' },
  midnight: { back: '#323A55', front: '#434B68', edge: '#3B4460', shadow: '#05070E' },
  porcelain: { back: '#E7ECF0', front: '#F7F8F9', edge: '#C6CFD7', shadow: '#2C3846' },
  paper: { back: '#F1E7DC', front: '#FBF6EF', edge: '#D9C8B8', shadow: '#3E2226' },
}
