/**
 * Content for the homepage hero's floating software tiles.
 *
 * The icons are the tools used across the case studies. They are decorative
 * only: no links, no claims of certification or partnership.
 *
 * Source: devicon v2.17.0 (MIT), https://github.com/devicons/devicon,
 * stored locally in `public/brand-icons/`. See `public/brand-icons/SOURCES.md`.
 * Every mark is a trademark of its owner.
 */

/**
 * Feature flag for the animated Three.js scene. When false the hero keeps
 * the same still composition of tiles and never loads Three.js.
 */
export const HERO_TILES_ANIMATION_ENABLED = true

export type HeroTileIconId = 'figma' | 'illustrator' | 'photoshop' | 'vscode' | 'react'

export interface HeroTileIcon {
  id: HeroTileIconId
  name: string
  /** Path relative to the site base URL. */
  file: string
}

export const heroTileIcons: Record<HeroTileIconId, HeroTileIcon> = {
  figma: { id: 'figma', name: 'Figma', file: 'brand-icons/figma.svg' },
  illustrator: { id: 'illustrator', name: 'Adobe Illustrator', file: 'brand-icons/illustrator.svg' },
  photoshop: { id: 'photoshop', name: 'Adobe Photoshop', file: 'brand-icons/photoshop.svg' },
  vscode: { id: 'vscode', name: 'Visual Studio Code', file: 'brand-icons/vscode.svg' },
  react: { id: 'react', name: 'React', file: 'brand-icons/react.svg' },
}

export function heroTileIconUrl(id: HeroTileIconId): string {
  return `${import.meta.env.BASE_URL}${heroTileIcons[id].file}`
}
