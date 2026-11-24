// Shapes for the Porchlight case study (src/data/porchlight.ts).
import type { MetaItem, PresentationImage, Swatch, WalkthroughSection } from '@/types/presentation'


/**
 * Where a claim comes from. Every statistic and problem statement carries one,
 * so the page can say which are observations, measurements, automated results,
 * research signals or untested hypotheses.
 */
export type EvidenceKind = 'observed' | 'research' | 'measured' | 'verified' | 'hypothesis'

export interface PorchStat {
  value: string
  label: string
  /** How it was measured or where it comes from. */
  detail: string
  kind: EvidenceKind
}

export interface PorchShot {
  image: PresentationImage
  label: string
  caption: string
  /** Tall phone capture: enlarged view is capped to a readable width. */
  portrait?: boolean
  /** Shown from 768px up only (a desktop screenshot that would be unreadable on a phone). */
  desktopOnly?: boolean
}

export interface PorchPoint {
  text: string
  kind: EvidenceKind
}

export interface ShotGroup {
  heading: string
  shots: PorchShot[]
}

export interface ProblemSection {
  id: string
  index: string
  label: string
  title: string
  intro: string
  problems: PorchPoint[]
  stats: PorchStat[]
  before: ShotGroup
  after: ShotGroup
  decisions: string[]
  validate: string[]
}

export interface PorchlightCaseStudy {
  opening: {
    eyebrow: string
    subtitle: string
    lede: string
    meta: MetaItem[]
    summaryLabel: string
    summary: { problem: string; change: string; stat: PorchStat }[]
    dataNote: string
  }
  walkthrough: WalkthroughSection & { descriptionSummary: string }
  origin: {
    title: string
    body: string[]
    cover: PorchShot
    research: { title: string; attribution: string; points: string[] }
    stat: PorchStat
  }
  costs: ProblemSection & { breakdown: PorchShot }
  discovery: ProblemSection
  tours: ProblemSection & {
    disclosure: PorchShot
    status: { title: string; shown: { label: string; items: string[] }; avoided: { label: string; items: string[] } }
  }
  process: {
    title: string
    intro: string
    wireframes: { shots: PorchShot[]; note: string; board: { href: string; label: string; detail: string } }
    identity: { fonts: { name: string; role: string }[]; swatches: Swatch[]; note: string }
  }
  quality: {
    title: string
    intro: string
    attribution: string
    phones: PorchShot[]
    checks: { value: string; label: string; detail: string; kind: EvidenceKind }[]
    notDone: { title: string; items: string[] }
  }
  reflection: {
    title: string
    accomplished: { title: string; body: string }[]
    learned: string
    next: { title: string; intro: string; questions: string[] }
    contactLabel: string
  }
}
