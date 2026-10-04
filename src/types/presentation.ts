// Shapes for art-directed case study presentations (currently Porchlight).

export interface PresentationImage {
  src: string
  alt: string
  width: number
  height: number
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
