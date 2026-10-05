import { createContext, useContext } from 'react'

/**
 * Visual themes for art-directed case study presentations.
 *
 * Section tones set a few CSS custom properties (muted text, eyebrow, border,
 * accent) so shared components pick up the right colors on any tone without
 * knowing which section they sit in. Everything else that differs between
 * projects (type, frames, labels, showcase materials) lives on the theme.
 */

export type SectionTone = 'base' | 'alt' | 'accent'

export interface ShowcaseColors {
  frame: string
  bar: string
  barDot: string
  urlPill: string
  phone: string
  shadow: string
}

export interface PresentationTheme {
  tones: Record<SectionTone, string>
  title: string
  subtitle: string
  focusRing: string
  buttonPrimary: string
  buttonSecondary: string
  heading: string
  number: string
  screenFrame: string
  chromeBar: string
  chromeDot: string
  phoneFrame: string
  labelBefore: string
  labelAfter: string
  showcase: {
    desktopFrame: string
    bar: string
    dot: string
    pill: string
    phone: string
    colors: ShowcaseColors
  }
}

const porchLightVars =
  '[--pres-muted:#5A544B] [--pres-eyebrow:#845D17] [--pres-border:#E3DBCF] [--pres-accent:#24563F]'

export const porchlightTheme: PresentationTheme = {
  tones: {
    base: `bg-porch-cream text-porch-charcoal ${porchLightVars}`,
    alt: `bg-white text-porch-charcoal ${porchLightVars}`,
    accent:
      'bg-porch-green text-porch-cream [--pres-muted:rgb(251_248_243/0.85)] [--pres-eyebrow:#F6ECD8] [--pres-border:rgb(251_248_243/0.25)] [--pres-accent:#F6ECD8]',
  },
  title: 'font-porch-display text-5xl font-semibold leading-[0.98] tracking-[-0.03em] md:text-7xl lg:text-8xl',
  subtitle: 'font-porch-display text-xl italic leading-snug text-porch-green md:text-2xl',
  focusRing: 'focus-visible:ring-[#1A5FB4] focus-visible:ring-offset-porch-cream',
  buttonPrimary:
    'bg-porch-cream text-porch-green hover:bg-white focus-visible:ring-porch-cream focus-visible:ring-offset-porch-green',
  buttonSecondary:
    'border border-porch-cream/60 text-porch-cream hover:bg-porch-green-dark focus-visible:ring-porch-cream focus-visible:ring-offset-porch-green',
  heading: 'font-porch-display font-semibold leading-[1.08] tracking-[-0.02em]',
  number: 'font-porch-display italic',
  screenFrame: 'border-porch-border bg-white shadow-[0_28px_60px_-34px_rgba(30,52,41,0.45)]',
  chromeBar: 'border-porch-border bg-porch-sunken',
  chromeDot: 'bg-[#D9CFC0]',
  phoneFrame: 'bg-porch-charcoal shadow-[0_28px_50px_-28px_rgba(30,52,41,0.6)]',
  labelBefore: 'border border-porch-control bg-white text-porch-charcoal',
  labelAfter: 'bg-porch-green text-white',
  showcase: {
    desktopFrame: 'bg-white shadow-[0_30px_70px_-30px_rgba(30,52,41,0.45)]',
    bar: 'bg-porch-sunken',
    dot: 'bg-[#D9CFC0]',
    pill: 'bg-white',
    phone: 'bg-porch-charcoal shadow-[0_30px_60px_-24px_rgba(30,52,41,0.55)]',
    colors: {
      frame: '#FFFFFF',
      bar: '#F4EFE7',
      barDot: '#D9CFC0',
      urlPill: '#FFFFFF',
      phone: '#1D1B18',
      shadow: 'rgb(30, 52, 41)',
    },
  },
}

const glowDarkVars =
  '[--pres-muted:#C0C5D4] [--pres-eyebrow:#B8A4EF] [--pres-border:#394158] [--pres-accent:#B8A4EF]'

export const afterglowTheme: PresentationTheme = {
  tones: {
    base: `bg-glow-bg text-glow-text ${glowDarkVars}`,
    alt: `bg-glow-deep text-glow-text ${glowDarkVars}`,
    accent:
      'bg-glow-paper text-glow-ink [--pres-muted:#545A72] [--pres-eyebrow:#5B45A8] [--pres-border:#D9D3C7] [--pres-accent:#5B45A8]',
  },
  title: 'font-glow-display text-5xl font-semibold leading-[1.05] tracking-[-0.015em] md:text-7xl lg:text-8xl',
  subtitle: 'font-glow-body text-xl leading-snug text-glow-muted md:text-2xl',
  focusRing: 'focus-visible:ring-glow-text focus-visible:ring-offset-glow-bg',
  buttonPrimary:
    'bg-glow-accent text-glow-ink hover:bg-glow-accent-hover motion-safe:hover:-translate-y-0.5 focus-visible:ring-glow-ink focus-visible:ring-offset-glow-paper',
  buttonSecondary:
    'border border-glow-ink/60 text-glow-ink hover:bg-[#E9E4DA] motion-safe:hover:-translate-y-0.5 focus-visible:ring-glow-ink focus-visible:ring-offset-glow-paper',
  heading: 'font-glow-display font-semibold leading-[1.1] tracking-[-0.01em]',
  number: 'font-glow-display font-medium',
  screenFrame: 'border-glow-line bg-glow-deep shadow-[0_30px_60px_-30px_rgba(4,6,14,0.85)]',
  chromeBar: 'border-glow-line bg-glow-surface',
  chromeDot: 'bg-glow-line-strong',
  phoneFrame: 'bg-glow-raised shadow-[0_28px_50px_-26px_rgba(4,6,14,0.9)]',
  labelBefore: 'border border-glow-line-strong bg-glow-surface text-glow-text',
  labelAfter: 'bg-glow-accent text-glow-ink',
  showcase: {
    desktopFrame: 'bg-glow-surface shadow-[0_30px_70px_-26px_rgba(4,6,14,0.9)]',
    bar: 'bg-glow-surface',
    dot: 'bg-glow-line-strong',
    pill: 'bg-glow-raised',
    phone: 'bg-glow-raised shadow-[0_30px_60px_-20px_rgba(4,6,14,0.95)]',
    colors: {
      frame: '#1E2436',
      bar: '#1E2436',
      barDot: '#737C9C',
      urlPill: '#282F45',
      phone: '#282F45',
      shadow: 'rgb(4, 6, 14)',
    },
  },
}

export const PresentationThemeContext = createContext<PresentationTheme>(porchlightTheme)

export function usePresentationTheme() {
  return useContext(PresentationThemeContext)
}
