// Shared geometry for the Porchlight opening showcase.
//
// The static HTML composition and the Three.js scene are both laid out from
// these numbers, so swapping one for the other never shifts the artwork.
// Units are scene units on a 16 x 10 stage, origin at the center, y up.

export const STAGE = { width: 16, height: 10 } as const

const DESKTOP_IMAGE_ASPECT = 2048 / 1280
const MOBILE_IMAGE_ASPECT = 780 / 1688

const desktopWidth = 12.0
const desktopBar = 0.42
const desktopScreenHeight = desktopWidth / DESKTOP_IMAGE_ASPECT

const phoneHeight = 6.8
const phoneBezel = 0.14
const phoneScreenHeight = phoneHeight - phoneBezel * 2
const phoneScreenWidth = phoneScreenHeight * MOBILE_IMAGE_ASPECT

export const DESKTOP = {
  cx: -1.25,
  cy: 0.35,
  width: desktopWidth,
  height: desktopScreenHeight + desktopBar,
  bar: desktopBar,
  screenHeight: desktopScreenHeight,
  radius: 0.22,
} as const

export const PHONE = {
  cx: 5.3,
  cy: -0.85,
  width: phoneScreenWidth + phoneBezel * 2,
  height: phoneHeight,
  bezel: phoneBezel,
  screenWidth: phoneScreenWidth,
  screenHeight: phoneScreenHeight,
  radius: 0.46,
  screenRadius: 0.34,
} as const

export interface StageRect {
  left: string
  top: string
  width: string
  height: string
}

// Converts a centered rectangle in stage units into CSS percentages.
export function toStageRect(cx: number, cy: number, width: number, height: number): StageRect {
  const pct = (n: number) => `${(n * 100).toFixed(3)}%`
  return {
    left: pct((cx - width / 2 + STAGE.width / 2) / STAGE.width),
    top: pct((STAGE.height / 2 - (cy + height / 2)) / STAGE.height),
    width: pct(width / STAGE.width),
    height: pct(height / STAGE.height),
  }
}
