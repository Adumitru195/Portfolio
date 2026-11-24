// Shapes for the Afterglow Cinema case study (src/data/afterglow.ts).
import type { MetaItem, PresentationImage, Swatch, WalkthroughVideo } from '@/types/presentation'

/**
 * Where a number or claim comes from:
 * - measured: a measurement of the prototype's interface
 * - verified: prototype behaviour or an automated check, re-run for this page
 * - recorded: documented in the prototype's design log
 * - hypothesis: a design intention not yet tested with people
 */
export type GlowEvidence = 'measured' | 'verified' | 'recorded' | 'hypothesis'

export interface GlowStat {
  value: string
  label: string
  /** How it was measured or where it comes from. */
  detail: string
  kind: GlowEvidence
}

export interface GlowShot {
  image: PresentationImage
  label: string
  caption?: string
  portrait?: boolean
}

export interface GlowDecision {
  title: string
  body: string
}

export interface GlowProblem {
  id: string
  index: string
  label: string
  title: string
  question: string
  stats: GlowStat[]
  primary: GlowShot
  decisions: GlowDecision[]
  states: GlowShot[]
  phones: GlowShot[]
}

export interface AfterglowCaseStudy {
  opening: {
    eyebrow: string
    subtitle: string
    lede: string
    meta: MetaItem[]
    hero: GlowShot
    summaryLabel: string
    summary: { problem: string; stat: GlowStat }[]
    note: string
  }
  journey: {
    title: string
    intro: string
    video: WalkthroughVideo
    descriptionSummary: string
    chapters: { time: string; title: string }[]
  }
  discovery: GlowProblem
  showtimes: GlowProblem
  selection: GlowProblem
  system: {
    title: string
    intro: string
    swatches: (Swatch & { contrast: string })[]
    fonts: { name: string; role: string; sample: string }[]
    contrast: GlowStat[]
    motion: GlowDecision[]
    reducedMotion: string
  }
  quality: {
    title: string
    intro: string
    checks: GlowStat[]
    notDone: { title: string; items: string[] }
    learned: string
    next: { title: string; intro: string; questions: string[] }
    contactLabel: string
  }
}
