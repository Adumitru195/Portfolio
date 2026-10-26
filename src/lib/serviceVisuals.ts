import type { ServiceId } from '@/data/services'

/**
 * Shared layout for the small visuals above each "How I can help" service:
 * a browser frame, an interface with adjustment sliders, and three screens
 * joined as a user flow.
 *
 * The static SVG version and the Three.js scene are both drawn from these
 * parts, and the SVG is tilted with the scene's resting pose and camera
 * distance, so the hand-off between them is close to seamless.
 *
 * Units: the visual's frame is FRAME_W wide and FRAME_W / FRAME_ASPECT tall,
 * with the origin at its centre and y running up, as in Three.js.
 */

/** Width-to-height ratio of each visual's slot (Tailwind `aspect-[8/5]`). */
export const FRAME_ASPECT = 8 / 5
export const FRAME_W = 2.4
export const FRAME_H = FRAME_W / FRAME_ASPECT

/** Vertical field of view of the scene camera, in degrees. */
export const FOV = 30

/** Camera distance, and the matching CSS perspective in frame widths. */
export const CAMERA_Z = FRAME_H / 2 / Math.tan(((FOV / 2) * Math.PI) / 180)
export const PERSPECTIVE = CAMERA_Z / FRAME_W

/** Resting tilt in radians, as Three.js rotations: the top and right lean away. */
export const REST_TILT = { x: -0.1, y: 0.14 }

// Colours: the tile, lavender and accent tokens from tailwind.config.js.
export const IVORY = '#FBF9F4'
const BAR = '#F1EEE7'
const EDGE = '#E7E3DA'
const DOT = '#D9D4CA'
const LAVENDER = '#E4E1FA'
const LAVENDER_SOFT = '#EEECFB'
const LAVENDER_LINE = '#D6D2F2'
const LAVENDER_MID = '#C7C1F6'
const ACCENT = '#4F46E5'
export const KNOB_WHITE = '#FFFFFF'

/** Shadows take the indigo of the accent, not pure black. */
export const SHADOW = { color: 'rgba(46, 43, 95, 0.16)', y: 0.05, blur: 0.08 }

export interface VisualPart {
  id: string
  /**
   * slab: a rounded panel with depth, its front face at `z`.
   * flat: a rounded shape printed on a panel.
   * knob: a small rounded control.
   */
  kind: 'slab' | 'flat' | 'knob'
  x: number
  y: number
  w: number
  h: number
  r: number
  z: number
  color: string
  depth?: number
  shadow?: boolean
  /** Parts sharing a group move together (the flow's screens). */
  group?: string
}

const slab = (id: string, x: number, y: number, w: number, h: number, r: number, depth: number, group?: string): VisualPart => ({
  id,
  kind: 'slab',
  x,
  y,
  w,
  h,
  r,
  z: 0,
  depth,
  color: IVORY,
  shadow: true,
  group,
})

// Printed shapes: layer 1 sits on a panel, layer 2 on top of layer 1.
const flat = (
  id: string,
  color: string,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  layer = 1,
  group?: string,
): VisualPart => ({ id, kind: 'flat', x, y, w, h, r, z: layer * 0.003, color, group })

const knob = (id: string, color: string, x: number, y: number, size: number): VisualPart => ({
  id,
  kind: 'knob',
  x,
  y,
  w: size,
  h: size,
  r: size / 2,
  z: 0.012,
  color,
})

// Website design + build: a browser frame with a hero and three cards.
const CARD_W = 0.54
const browser: VisualPart[] = [
  slab('panel', 0, 0, 1.9, 1.2, 0.09, 0.08),
  flat('toolbar', BAR, 0, 0.5, 1.78, 0.12, 0.06),
  flat('dot-0', DOT, -0.8, 0.5, 0.044, 0.044, 0.022, 2),
  flat('dot-1', DOT, -0.73, 0.5, 0.044, 0.044, 0.022, 2),
  flat('dot-2', DOT, -0.66, 0.5, 0.044, 0.044, 0.022, 2),
  flat('address', IVORY, 0.05, 0.5, 0.7, 0.06, 0.03, 2),
  flat('hero', LAVENDER, 0, 0.17, 1.74, 0.44, 0.05),
  flat('headline', ACCENT, -0.5, 0.26, 0.56, 0.07, 0.035, 2),
  flat('intro-0', LAVENDER_MID, -0.58, 0.14, 0.4, 0.04, 0.02, 2),
  flat('intro-1', LAVENDER_MID, -0.63, 0.06, 0.3, 0.04, 0.02, 2),
  flat('image', LAVENDER_MID, 0.55, 0.17, 0.44, 0.3, 0.04, 2),
  ...[-0.6, 0, 0.6].flatMap((x, i) => [
    flat(`card-${i}`, LAVENDER_SOFT, x, -0.32, CARD_W, 0.38, 0.04),
    flat(`card-${i}-image`, LAVENDER, x, -0.22, 0.44, 0.12, 0.025, 2),
    flat(`card-${i}-line-0`, LAVENDER_LINE, x - 0.07, -0.36, 0.3, 0.035, 0.0175, 2),
    flat(`card-${i}-line-1`, LAVENDER_LINE, x - 0.12, -0.43, 0.2, 0.035, 0.0175, 2),
  ]),
]

// Website improvements: three rows, each with a label and a slider.
export const TRACK_LEFT = -0.1
const TRACK_W = 0.72
export const KNOB_REST = [0.2, 0.38, 0.1]
const ROW_Y = [0.36, 0, -0.36]
const adjust: VisualPart[] = [
  slab('panel', 0, 0, 1.9, 1.2, 0.09, 0.08),
  ...ROW_Y.flatMap((y, i) => [
    flat(`row-${i}`, LAVENDER_SOFT, 0, y, 1.7, 0.28, 0.07),
    flat(`row-${i}-label`, LAVENDER_LINE, -0.6, y + 0.04, 0.34, 0.045, 0.0225, 2),
    flat(`row-${i}-hint`, EDGE, -0.66, y - 0.05, 0.22, 0.04, 0.02, 2),
    flat(`track-${i}`, LAVENDER_LINE, TRACK_LEFT + TRACK_W / 2, y, TRACK_W, 0.03, 0.015, 2),
    flat(`fill-${i}`, LAVENDER_MID, (TRACK_LEFT + KNOB_REST[i]) / 2, y, KNOB_REST[i] - TRACK_LEFT, 0.03, 0.015, 3),
    knob(`knob-${i}`, i === 1 ? ACCENT : KNOB_WHITE, KNOB_REST[i], y, 0.11),
  ]),
]

// UX/UI design: three screens joined left to right.
const SCREEN_X = [-0.72, 0, 0.72]
const SCREEN_W = 0.5
const screen = (i: number) => `screen-${i}`
const flow: VisualPart[] = [
  // Connectors between neighbouring screens, with a node at each end.
  ...[-0.36, 0.36].flatMap((x, i) => [
    flat(`link-${i}`, LAVENDER_MID, x, 0, 0.14, 0.016, 0.008),
    flat(`link-${i}-start`, LAVENDER_MID, x - 0.08, 0, 0.04, 0.04, 0.02, 2),
    flat(`link-${i}-end`, LAVENDER_MID, x + 0.08, 0, 0.04, 0.04, 0.02, 2),
  ]),
  ...SCREEN_X.map((x, i) => slab(screen(i), x, 0, SCREEN_W, 0.74, 0.06, 0.06, screen(i))),

  // Start: a picture, two lines and a button.
  flat('s0-image', LAVENDER, SCREEN_X[0], 0.19, 0.38, 0.22, 0.04, 1, screen(0)),
  flat('s0-line-0', LAVENDER_LINE, SCREEN_X[0] - 0.04, -0.03, 0.3, 0.035, 0.0175, 1, screen(0)),
  flat('s0-line-1', LAVENDER_LINE, SCREEN_X[0] - 0.08, -0.1, 0.22, 0.035, 0.0175, 1, screen(0)),
  flat('s0-button', LAVENDER_MID, SCREEN_X[0], -0.25, 0.3, 0.08, 0.04, 1, screen(0)),

  // Choose: three options.
  ...[0.2, 0.06, -0.08].flatMap((y, j) => [
    flat(`s1-option-${j}`, LAVENDER_SOFT, SCREEN_X[1], y, 0.38, 0.1, 0.03, 1, screen(1)),
    flat(`s1-option-${j}-dot`, LAVENDER_MID, SCREEN_X[1] - 0.13, y, 0.044, 0.044, 0.022, 2, screen(1)),
    flat(`s1-option-${j}-line`, LAVENDER_LINE, SCREEN_X[1] + 0.03, y, 0.2, 0.03, 0.015, 2, screen(1)),
  ]),
  flat('s1-button', LAVENDER_MID, SCREEN_X[1], -0.25, 0.3, 0.08, 0.04, 1, screen(1)),

  // Done: a confirmation mark and two lines.
  flat('s2-mark', ACCENT, SCREEN_X[2], 0.12, 0.18, 0.18, 0.09, 1, screen(2)),
  flat('s2-tick-0', IVORY, SCREEN_X[2] - 0.025, 0.105, 0.05, 0.022, 0.011, 2, screen(2)),
  flat('s2-tick-1', IVORY, SCREEN_X[2] + 0.02, 0.116, 0.08, 0.022, 0.011, 2, screen(2)),
  flat('s2-line-0', LAVENDER_LINE, SCREEN_X[2], -0.08, 0.3, 0.035, 0.0175, 1, screen(2)),
  flat('s2-line-1', LAVENDER_LINE, SCREEN_X[2], -0.15, 0.2, 0.035, 0.0175, 1, screen(2)),
  flat('s2-button', LAVENDER_MID, SCREEN_X[2], -0.27, 0.3, 0.08, 0.04, 1, screen(2)),
]

/** Rotations (radians, about the part's centre) for the flow's tick strokes. */
export const PART_ROTATION: Record<string, number> = {
  's2-tick-0': -Math.PI / 4,
  's2-tick-1': Math.PI / 4,
}

export const VISUALS: Record<ServiceId, VisualPart[]> = {
  build: browser,
  improve: adjust,
  ux: flow,
}

/** Envelope for one gentle play: 0 at both ends, 1 in the middle. */
export const swell = (u: number) => Math.sin(Math.PI * Math.min(1, Math.max(0, u))) ** 2

/** A swell that passes through item `i` of three in turn, left to right. */
export const wave = (u: number, i: number) => swell(u * 1.6 - i * 0.3)
