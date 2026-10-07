/**
 * Shared layout for the contact section's design-element composition: a
 * miniature browser panel, a typography tile and a colour palette tile.
 *
 * The static CSS version and the Three.js scene are both built from these
 * numbers, and both use the same perspective, so the hand-off between them
 * is exact.
 *
 * Units: percentages of the stage width (so 100 = full width), with the
 * origin at the stage's top-left corner and y running down, as in CSS.
 * Rotations are CSS degrees, applied as `rotateZ() rotateY() rotateX()`.
 */

/** Stage height as a fraction of its width. */
export const STAGE_RATIO = 0.88

/** Camera distance from the stage, in stage widths (CSS `perspective`). */
export const PERSPECTIVE = 2.8

/** Extra canvas room on every side, in stage widths, so tilts aren't clipped. */
export const BLEED = 0.12

// Colours: the accent, lavender and tile tokens from tailwind.config.js.
const ACCENT = '#4F46E5'
const IVORY = '#FBF9F4'
const INK = '#1C1C1C'
const LAVENDER = '#E4E1FA'
const LAVENDER_MID = '#C7C1F6'

export interface StackShadow {
  /** Downward offset, blur radius and spread, in stage-width percent. */
  y: number
  blur: number
  spread: number
  color: string
}

export interface StackPiece {
  id: 'browser' | 'type' | 'palette'
  /** Centre, size and distance toward the viewer. */
  cx: number
  cy: number
  w: number
  h: number
  z: number
  rotate: { x: number; y: number; z: number }
  /** Slab thickness and corner radius. */
  depth: number
  radius: number
  /** Colour of the slab's sides. */
  edge: string
  shadow: StackShadow
  /** How far the piece drifts with the pointer, in stage-width percent. */
  drift: number
  /** Face artwork, drawn in a viewBox of (w × 10) by (h × 10). */
  face: string
}

const browserFace = `
  <defs><clipPath id="hero"><rect x="164" y="78" width="500" height="210" rx="14"/></clipPath></defs>
  <rect width="700" height="480" fill="${IVORY}"/>
  <rect width="700" height="46" fill="#F1EEE7"/>
  <rect y="45" width="700" height="2" fill="#E7E3DA"/>
  <circle cx="30" cy="23" r="6.5" fill="#D9D4CA"/>
  <circle cx="52" cy="23" r="6.5" fill="#D9D4CA"/>
  <circle cx="74" cy="23" r="6.5" fill="#D9D4CA"/>
  <rect x="250" y="13" width="200" height="20" rx="10" fill="${IVORY}"/>
  <rect y="47" width="130" height="433" fill="${ACCENT}"/>
  <circle cx="42" cy="92" r="17" fill="${LAVENDER}"/>
  <rect x="25" y="130" width="72" height="12" rx="6" fill="#FFFFFF" fill-opacity="0.6"/>
  <rect x="25" y="154" width="50" height="12" rx="6" fill="#FFFFFF" fill-opacity="0.4"/>
  <rect x="164" y="78" width="500" height="210" rx="14" fill="${LAVENDER}"/>
  <path clip-path="url(#hero)" d="M164 300 C 270 300 330 150 432 150 C 534 150 590 300 664 300 Z" fill="${LAVENDER_MID}"/>
  <rect x="164" y="316" width="120" height="120" rx="12" fill="${LAVENDER}"/>
  <rect x="312" y="326" width="250" height="18" rx="9" fill="${LAVENDER_MID}"/>
  <rect x="312" y="362" width="310" height="13" rx="6.5" fill="#E7E3DA"/>
  <rect x="312" y="390" width="220" height="13" rx="6.5" fill="#E7E3DA"/>
`

const typeFace = `
  <rect width="280" height="300" fill="#DCD8FA"/>
  <text x="140" y="196" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="150" fill="${INK}">Aa</text>
`

const paletteFace = `
  <rect width="400" height="180" fill="#F4F1EB"/>
  <circle cx="82" cy="90" r="46" fill="${ACCENT}"/>
  <circle cx="200" cy="90" r="46" fill="${LAVENDER_MID}"/>
  <circle cx="318" cy="90" r="44.5" fill="#FFFDF8" stroke="#E2DDD2" stroke-width="3"/>
`

// Tinted toward the indigo accent rather than black.
const SHADOW_COLOR = 'rgba(55, 48, 163, 0.16)'

export const PIECES: StackPiece[] = [
  {
    id: 'browser',
    cx: 44,
    cy: 39,
    w: 70,
    h: 48,
    z: 0,
    rotate: { x: 6, y: 16, z: 5 },
    depth: 2,
    radius: 3,
    edge: '#E4DFD4',
    shadow: { y: 3.5, blur: 8, spread: -1.5, color: SHADOW_COLOR },
    drift: 0.4,
    face: browserFace,
  },
  {
    id: 'type',
    cx: 80,
    cy: 57,
    w: 28,
    h: 30,
    z: 10,
    rotate: { x: 6, y: 12, z: 6 },
    depth: 2.6,
    radius: 3.6,
    edge: '#C6BFF2',
    shadow: { y: 2.6, blur: 6, spread: -1, color: SHADOW_COLOR },
    drift: 1.2,
    face: typeFace,
  },
  {
    id: 'palette',
    cx: 49,
    cy: 72,
    w: 40,
    h: 18,
    z: 15,
    rotate: { x: 6, y: 12, z: 5 },
    depth: 2.6,
    radius: 3.6,
    edge: '#DEDACF',
    shadow: { y: 2.6, blur: 6, spread: -1, color: SHADOW_COLOR },
    drift: 1.7,
    face: paletteFace,
  },
]

/** A piece's face as standalone SVG, optionally rendered at a pixel size. */
export function faceSvg(piece: StackPiece, width?: number, height?: number) {
  const size = width && height ? ` width="${width}" height="${height}"` : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${piece.w * 10} ${piece.h * 10}"${size} preserveAspectRatio="none">${piece.face}</svg>`
}

export function faceDataUrl(piece: StackPiece, width?: number, height?: number) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(faceSvg(piece, width, height))}`
}
