// Shapes for art-directed case study presentations (currently Porchlight).

export interface PresentationImage {
  src: string
  alt: string
  width: number
  height: number
  /** Optional 800px-wide variant for responsive srcset. */
  small?: string
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

export interface PorchlightPresentation {
  eyebrow: string
  meta: MetaItem[]
  showcase: {
    desktop: PresentationImage
    mobile: PresentationImage
    description: string
    caption: string
  }
  challenge: {
    title: string
    body: string[]
    priorities: Priority[]
  }
  wireframes: {
    title: string
    body: string
    studies: WireframeStudy[]
    board: { href: string; label: string; detail: string }
  }
  development: {
    title: string
    body: string
    comparisons: Comparison[]
  }
  identity: {
    title: string
    body: string
    displayFont: { name: string; role: string; sample: string; accent: string }
    bodyFont: { name: string; role: string; sample: string; paragraph: string }
    swatches: Swatch[]
    note: string
  }
  journey: {
    title: string
    body: string
    steps: JourneyStep[]
    status: {
      title: string
      shown: { label: string; items: string[] }
      avoided: { label: string; items: string[] }
    }
  }
  responsive: {
    title: string
    body: string
    screens: PhoneScreen[]
    notes: PresentationNote[]
  }
  outcome: {
    title: string
    achieved: PresentationNote[]
    untested: { title: string; body: string[] }
    pdf: { href: string; label: string; detail: string }
  }
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
    video: {
      mp4: string
      webm: string
      poster: PresentationImage
      caption: string
      description: string
    }
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

export interface WovenwardPresentation {
  eyebrow: string
  subtitle: string
  meta: MetaItem[]
  showcase: {
    desktop: PresentationImage
    mobile: PresentationImage
    description: string
    caption: string
  }
  imageNote: string
  overview: {
    title: string
    challenge: { heading: string; body: string }
    goal: { heading: string; body: string }
    contribution: { heading: string; body: string }
    scope: { heading: string; body: string }
  }
  journey: {
    title: string
    body: string
    steps: FlowStep[]
    principles: FeatureNote[]
  }
  wireframes: {
    title: string
    body: string
    corrected: PresentationImage
    supplied: PresentationImage
    suppliedNote: string
    corrections: string[]
    svgHref: string
  }
  identity: {
    title: string
    body: string
    swatches: Swatch[]
    displayFont: { name: string; role: string }
    bodyFont: { name: string; role: string }
    note: string
  }
  collection: {
    title: string
    body: string
    hero: PresentationImage
    heroNotes: FeatureNote[]
    sections: PresentationImage
    sectionsCaption: string
    filtered: PresentationImage
    filteredNotes: FeatureNote[]
    empty: PresentationImage
    emptyCaption: string
  }
  product: {
    title: string
    body: string
    layout: PresentationImage
    layoutCaption: string
    required: PresentationImage
    selected: PresentationImage
    stateNotes: FeatureNote[]
    guide: PresentationImage
    guideNotes: FeatureNote[]
  }
  bag: {
    title: string
    body: string
    added: PresentationImage
    addedNotes: FeatureNote[]
    bag: PresentationImage
    bagNotes: FeatureNote[]
  }
  responsive: {
    title: string
    body: string
    screens: PhoneScreen[]
    notes: PresentationNote[]
    reducedMotion: string
  }
  refinements: {
    title: string
    body: string
    before: PresentationImage
    after: PresentationImage
    beforeCaption: string
    afterCaption: string
    items: FeatureNote[]
  }
  outcome: {
    title: string
    delivered: FeatureNote
    lesson: FeatureNote
    checks: FeatureNote
    next: FeatureNote
    limits: string
    pdf: { href: string; label: string; detail: string }
  }
}
