// Shapes for the Typography Systems presentation: print artwork rendered from PDFs.

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

/** One page of a book PDF. A PDF page may be a single printed page or a two-page spread. */
export interface BookPage extends PrintFigure {
  id: string
  kind: 'single' | 'spread'
  title: string
  /** Position in the PDF, e.g. "PDF page 4 of 9". */
  label: string
  small: string
  smallWidth: number
}

/** An image in the enlarged viewer. */
export interface ViewerItem extends PrintFigure {
  title?: string
  label?: string
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
  image: BookPage
}

export interface ReadingPath {
  heading: string
  body: string
  figure: PrintFigure
  source: string
}

export interface Comparison {
  lever: string
  note: string
  page: BookPage
}

export interface CaptionedFigure {
  figure: PrintFigure
  caption: string
}

export interface BookGallery {
  id: string
  title: string
  description: string
  pages: BookPage[]
}

export interface DownloadLink {
  href: string
  label: string
  /** Actual file size, shown in the link label. */
  size: string
  description: string
}

export interface TypographySystemsPresentation {
  opening: {
    eyebrow: string
    title: string
    lede: string
    meta: MetaItem[]
    cover: BookPage
  }
  overview: {
    title: string
    context: string
    studies: StudySummary[]
    question: string
  }
  readingPaths: {
    title: string
    intro: string
    items: ReadingPath[]
  }
  contrast: {
    title: string
    intro: string
    comparisons: Comparison[]
    notes: EditorialNote[]
  }
  identity: {
    title: string
    intro: string
    cover: BookPage
    coverSpread: BookPage
    discography: BookPage
    note: EditorialNote
    swatches: { name: string; hex: string }[]
    swatchNote: string
    typefaces: string[]
    elements: string[]
  }
  members: {
    title: string
    intro: string
    spread: BookPage
    detail: PrintFigure
    detailCaption: string
    principles: { heading: string; body: string }[]
    secondSpread: BookPage
    secondDetail: PrintFigure
    secondDetailCaption: string
  }
  rhythm: {
    title: string
    lead: BookPage
    supporting: CaptionedFigure[]
    notes: EditorialNote[]
  }
  reflection: {
    title: string
    notes: EditorialNote[]
    refinements: string[]
  }
  books: BookGallery[]
  pageCountNote: string
  downloads: DownloadLink[]
}
