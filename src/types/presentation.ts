// Shapes for art-directed case study presentations (currently Porchlight).

export interface PresentationImage {
  src: string
  alt: string
  width: number
  height: number
  /** Optional 800px-wide variant for responsive srcset. */
  small?: string
}

/** A silent screen recording or publication walkthrough with its poster. */
export interface WalkthroughVideo {
  /** H.264 MP4, the primary source. */
  mp4: string
  /** Optional WebM fallback, offered after the MP4. */
  webm?: string
  poster: PresentationImage
  /** Names the recording in button labels, e.g. "Play rental journey walkthrough". */
  label: string
  /** Length in seconds, shown before the file has loaded. */
  duration: number
  /** What it shows, its approximate length, and whether it has audio. */
  caption: string
  /** Text alternative describing the full sequence. */
  description: string
}

/** A titled walkthrough block placed after the flow it demonstrates. */
export interface WalkthroughSection {
  eyebrow: string
  title: string
  body: string
  video: WalkthroughVideo
}

export interface MetaItem {
  label: string
  value: string
}

export interface Priority {
  title: string
  body: string
}

export interface WireframeStudy {
  title: string
  intent: string[]
  desktop: PresentationImage
  mobile: PresentationImage
}

export interface Comparison {
  title: string
  body: string[]
  before: PresentationImage
  after: PresentationImage
  beforeCaption: string
  afterCaption: string
  layout: 'wide' | 'split' | 'split-reverse'
}

export interface Swatch {
  name: string
  hex: string
  usage: string
  onDark?: boolean
}

export interface JourneyStep {
  eyebrow: string
  title: string
  decision: string
  body: string
  image: PresentationImage
  caption: string
}

export interface PhoneScreen {
  image: PresentationImage
  caption: string
}

export interface PresentationNote {
  title: string
  body: string
}

export interface FlowStep {
  title: string
  body: string
}

export interface FeatureNote {
  title: string
  body: string
}

export interface ScreenFeature {
  eyebrow: string
  title: string
  body: string
  notes: FeatureNote[]
  image: PresentationImage
  caption: string
}

export interface MotionEffect {
  title: string
  body: string
}

export interface AfterglowPresentation {
  eyebrow: string
  subtitle: string
  meta: MetaItem[]
  showcase: {
    desktop: PresentationImage
    mobile: PresentationImage
    description: string
    caption: string
  }
  artworkNote: string
  brief: {
    title: string
    challenge: string
    goal: string
    priorities: Priority[]
  }
  structure: {
    title: string
    body: string
    steps: FlowStep[]
    principles: FeatureNote[]
  }
  identity: {
    title: string
    body: string
    displayFont: { name: string; role: string }
    bodyFont: { name: string; role: string; sample: string; paragraph: string }
    swatches: Swatch[]
    note: string
  }
  discovery: ScreenFeature
  details: {
    title: string
    body: string
    steps: JourneyStep[]
  }
  motion: {
    title: string
    body: string
    video: WalkthroughVideo
    effects: MotionEffect[]
    reducedMotion: string
  }
  recovery: {
    title: string
    body: string
    screens: { title: string; body: string; image: PresentationImage }[]
    alternatives: string
  }
  responsive: {
    title: string
    body: string
    screens: PhoneScreen[]
    notes: PresentationNote[]
  }
  outcome: {
    title: string
    changed: string[]
    learned: { title: string; body: string }
    evidence: { title: string; body: string; measure: string }
  }
}
