/**
 * Motion for the About page's opening photographs, shared by the HTML
 * composition and the Three.js scene so the hand-off between them is exact.
 *
 * Distances are CSS pixels and angles are degrees, in screen terms: +x right,
 * +y down, +rotate clockwise.
 */

/** Same curve as the site's reveals (src/lib/motion.ts). */
export const PHOTO_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export interface PanelMotion {
  /** Resting roll of the photo. */
  rotate: number
  entrance: {
    delay: number
    duration: number
    fromX: number
    fromY: number
    fromRotate: number
  }
  /** Pointer response on desktop: maximum tilt and sideways shift. */
  tilt: { x: number; y: number; shift: number }
}

export const photoMotion: Record<'main' | 'support', PanelMotion> = {
  main: {
    rotate: 0,
    entrance: { delay: 0.2, duration: 0.9, fromX: 0, fromY: 32, fromRotate: 2.5 },
    tilt: { x: 3, y: 4, shift: 5 },
  },
  support: {
    rotate: -4,
    entrance: { delay: 0.38, duration: 0.9, fromX: -24, fromY: 40, fromRotate: -9 },
    tilt: { x: 4, y: 5, shift: -12 },
  },
}

/** Corner radii in CSS pixels, matching the HTML composition. */
export const PHOTO_RADIUS = { main: 28, support: 20 }

/** Extra room around the stage so tilted panels and shadows aren't clipped. */
export const SCENE_BLEED = 56

/** A panel's resting layout box inside the stage, in CSS pixels. */
export interface PanelRect {
  x: number
  y: number
  w: number
  h: number
}

export interface StageLayout {
  width: number
  height: number
  main: PanelRect
  support: PanelRect
}
