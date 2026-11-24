// Shapes for the Wovenward case study (src/data/wovenward.ts).
import type { MetaItem, PresentationImage, WalkthroughVideo } from '@/types/presentation'

/**
 * Where an annotation's claim comes from:
 * - measured: measured in the running storefront for this page
 * - verified: storefront behaviour or an automated check, run for this page
 * - recorded: documented in the storefront's design log (not re-measured)
 */
export type WoveSource = 'measured' | 'verified' | 'recorded'

export interface WoveFigure {
  image: PresentationImage
  /** Short figure label, e.g. "Size in stock, 1440 px". */
  label: string
  portrait?: boolean
  /** Desktop captures get a browser bar. */
  chrome?: boolean
}

/** A margin note beside the figures: one decision and the evidence for it. */
export interface WoveNote {
  title: string
  body: string
  /** The number or fact that backs it, shown in the display face. */
  figure?: string
  source: WoveSource
}

export interface WoveChapter {
  id: string
  index: string
  label: string
  title: string
  standfirst: string
  lead: WoveFigure
  notes: WoveNote[]
  supporting: WoveFigure[]
  phones: WoveFigure[]
}

export interface WovenwardCaseStudy {
  opening: {
    eyebrow: string
    title: string
    subtitle: string
    lede: string
    meta: MetaItem[]
    hero: WoveFigure
    contentsLabel: string
    note: string
  }
  experience: {
    title: string
    challenge: string
    video: WalkthroughVideo
    descriptionSummary: string
  }
  discover: WoveChapter
  fit: WoveChapter & {
    sequence: { label: string; before: WoveFigure; after: WoveFigure; caption: string }
  }
  review: WoveChapter
  identity: {
    title: string
    standfirst: string
    palette: { name: string; hex: string; role: string; contrast: string }[]
    type: { name: string; role: string; sample: string }[]
    refinements: WoveNote[]
  }
  evidence: {
    title: string
    standfirst: string
    checks: { label: string; recorded: string; rerun: string }[]
    notDone: string[]
    learned: string
    next: string[]
    contactLabel: string
  }
}
