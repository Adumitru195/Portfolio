// Shapes for the Typography Systems presentation: print artwork rendered from PDFs.

import type { WalkthroughSection } from '@/types/presentation'

/** A piece of print artwork with an inline (md) source and a larger source for the enlarged view. */
export interface PrintFigure {
  src: string
  width: number
  height: number
  large: string
  largeWidth: number
  alt: string
  /** Optional smaller variant for thumbnails. */
  small?: string
  smallWidth?: number
}

/** An image in the enlarged viewer. */
export interface ViewerItem extends PrintFigure {
  title?: string
  label?: string
  /** The two printed pages of a spread, shown one at a time on narrow screens. */
  halves?: [ViewerItem, ViewerItem]
}

/**
 * Published artwork from one of the books: a whole PDF page, one printed page
 * from a spread, or a labelled crop.
 */
export interface PrintPage extends ViewerItem {
  id: string
  kind: 'single' | 'spread' | 'crop'
  title: string
  /** Where it sits in the original, e.g. "PDF page 4 of 13 · Two-page spread". */
  label: string
  small: string
  smallWidth: number
  /** Present whenever the published image is not the whole original page, and says what is left out. */
  adaptation?: string
}

export interface MetaItem {
  label: string
  value: string
}

export interface EditorialNote {
  eyebrow: string
  heading: string
  body: string
}

export interface StudySummary {
  number: string
  name: string
  heading: string
  body: string
  image: PrintPage
}

export interface Comparison {
  lever: string
  note: string
  page: PrintPage
}

export interface BookSelection {
  id: string
  title: string
  description: string
  pages: PrintPage[]
}

export interface TypographySystemsPresentation {
  opening: {
    eyebrow: string
    title: string
    lede: string
    meta: MetaItem[]
    notice: string
    cover: PrintPage
  }
  publications: {
    title: string
    intro: string
    studies: StudySummary[]
    walkthrough: WalkthroughSection & { descriptionSummary: string }
  }
  hierarchy: {
    title: string
    intro: string
    contentNote: EditorialNote
    pages: Comparison[]
    spreads: Comparison[]
    typefaceNote: string
  }
  identity: {
    title: string
    intro: string
    coverSpread: PrintPage
    coverSpreadCaption: string
    swatches: { name: string; hex: string }[]
    swatchNote: string
    typefaces: string[]
    typefaceNote: string
    elements: string[]
  }
  rhythm: {
    title: string
    intro: string
    names: [PrintPage, PrintPage]
    namesNote: string
    sequence: { page: PrintPage; caption: string }[]
    notes: EditorialNote[]
  }
  reflection: {
    title: string
    analysisNote: string
    notes: EditorialNote[]
    refinements: string[]
  }
  selection: {
    title: string
    intro: string
    toggle: string
    phoneNote: string
    books: BookSelection[]
  }
  sources: {
    title: string
    items: string[]
  }
}
