/**
 * Shared geometry for the contact section's arrow disc. The static SVG and
 * the Three.js disc are both built from these numbers, so the hand-off from
 * one to the other is exact.
 *
 * Units are fractions of the disc radius, with +y up.
 */

/** Same values as the `lavender` and `text.primary` tokens in tailwind.config.js. */
export const DISC_FACE = '#E4E1FA'
export const DISC_ARROW = '#1C1C1C'

/** Disc thickness and the radius of its rounded rim. */
export const DISC_THICKNESS = 0.14
/** How far the arrow's outline is rounded outward (3D bevel / SVG stroke). */
export const ARROW_ROUNDING = 0.018
/** Raised height of the arrow above the face. */
export const ARROW_DEPTH = 0.045

/** Extra room around the disc so the tilted 3D disc isn't clipped. */
export const DISC_BLEED = 0.18

// A block arrow pointing up, drawn around the origin.
const UP_ARROW: [number, number][] = [
  [-0.075, -0.46],
  [0.075, -0.46],
  [0.075, 0.03],
  [0.26, 0.03],
  [0, 0.44],
  [-0.26, 0.03],
  [-0.075, 0.03],
]

const ARROW_SCALE = 1.08

/** The arrow outline, turned 45 degrees clockwise to point north-east. */
export const ARROW_POINTS: [number, number][] = UP_ARROW.map(([x, y]) => {
  const c = Math.SQRT1_2
  return [(x * c + y * c) * ARROW_SCALE, (-x * c + y * c) * ARROW_SCALE]
})

/** SVG path for the arrow in a viewBox of "-1 -1 2 2" (SVG y runs down). */
export const ARROW_PATH = `M ${ARROW_POINTS.map(([x, y]) => `${x.toFixed(4)} ${(-y).toFixed(4)}`).join(' L ')} Z`
