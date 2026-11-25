// Shapes for the AIC Museum Experience case study ("Beyond the Gallery").

/** A public-domain painting from the museum's open-access collection, used as presentation artwork. */
export interface Artwork {
  title: string
  artist: string
  date: string
  medium: string
  reference: string
  credit: string
  /** Record page on artic.edu. */
  url: string
  alt: string
  src: { sm: string; md: string; lg: string }
  /** Intrinsic size of the md file. */
  width: number
  height: number
}

export interface MetaItem {
  label: string
  value: string
}

export interface Finding {
  title: string
  body: string
}

export type EmotionalState = 'Neutral' | 'Frustrated'

export interface JourneyStage {
  stage: string
  state: EmotionalState
  /** The team's documented notes for this stage. */
  notes: string[]
}

/** How well the documented interviews support a part of the concept. */
export type SupportLevel = 'response' | 'hypothesis' | 'partial' | 'gap' | 'speculative'

export interface ConnectionRow {
  feature: string
  level: SupportLevel
  /** The research theme it relates to, or why it does not. */
  evidence: string
  note: string
}

export interface TestPlan {
  area: string
  question: string
  task: string
  observe: string[]
  success: string
}

export interface ReflectionNote {
  eyebrow: string
  title: string
  body: string
}

/* Retrospective low-fidelity reconstructions ----------------------------- */

export type WireIcon = 'chevron-left' | 'chevron-right' | 'search' | 'filter' | 'home' | 'bell' | 'trend' | 'gear' | 'share' | 'qr'

/**
 * One element of a reconstructed screen, in the original export's pixel
 * coordinates (786 px wide). Text is copied verbatim from the export, except
 * where a real artist or collection name is replaced by a bracketed placeholder.
 */
export type WireElement =
  | { t: 'text'; x: number; y: number; s: string; size: number; anchor?: 'start' | 'middle' | 'end'; weight?: number; serif?: boolean; tone?: 'ink' | 'muted' | 'strong' }
  | { t: 'box'; x: number; y: number; w: number; h: number; r?: number; fill?: 'solid' | 'tint' | 'none'; label?: string; size?: number }
  | { t: 'omit'; x: number; y: number; w: number; h: number; r?: number; label?: string }
  | { t: 'dot'; cx: number; cy: number; r: number; fill?: 'solid' | 'tint' | 'omit' }
  | { t: 'line'; x1: number; y1: number; x2: number; y2: number }
  | { t: 'icon'; name: WireIcon; x: number; y: number; size?: number; strong?: boolean }

export interface WireScreen {
  id: string
  /** The original export it was measured from, e.g. app-03. */
  source: string
  title: string
  width: number
  height: number
  /** The whole background was a photograph that is not reproduced. */
  photoBackground: boolean
  elements: WireElement[]
  /** Text alternative for the reconstruction. */
  description: string
}

/** A published visual in the concept section: a reconstruction or the one clean original crop. */
export type ConceptVisual =
  | { kind: 'reconstruction'; screen: WireScreen }
  | { kind: 'original-crop'; id: string; title: string; src: string; width: number; height: number; alt: string; note: string }

export interface ConceptFlow {
  id: string
  title: string
  level: SupportLevel
  body: string
  visuals: ConceptVisual[]
}

export interface FollowUpDesign {
  id: string
  title: string
  /** The team's original screen this redesign replaces, as a reconstruction. */
  before: WireScreen
  src: { md: string; lg: string }
  width: number
  height: number
  alt: string
  /** What changed from the team's original. */
  change: string
  /** The finding or hypothesis it responds to. */
  research: string
  level: SupportLevel
}
