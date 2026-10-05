import type { HeroTileIconId } from '@/data/hero-tiles'

/**
 * Layout for the hero's floating software tiles, shared by the Three.js scene
 * and the static HTML composition so both draw the same arrangement.
 *
 * Everything is in hero-local CSS pixels (origin top-left, y down). The hero
 * text is measured at runtime, so the tiles always stay to the right of the
 * headline and paragraph whatever the font metrics or viewport.
 */

export interface Rect {
  left: number
  top: number
  right: number
  bottom: number
}

export interface HeroGeometry {
  width: number
  height: number
  /** Text and controls the tiles must keep clear of. */
  obstacles: Rect[]
}

export interface TilePose {
  key: string
  icon: HeroTileIconId
  /** Tile centre. */
  x: number
  y: number
  size: number
  /** Depth hint for the 3D scene: larger values sit nearer the camera. */
  depth: number
  rotX: number
  rotY: number
  rotZ: number
  opacity: number
}

/** Scene time at which both the still composition and the animation begin. */
export const LAYOUT_START_TIME = 14

// Space kept clear under the fixed nav and above the pause control.
const NAV_CLEARANCE = 96
const BOTTOM_CLEARANCE = 96
// Gap between the widest line of text and the point where tiles are gone.
const TEXT_GAP = 64
// Fade lengths at each end of a lane.
const FADE_OUT = 140
// Smallest free column that still reads as a composition, not a squeeze.
const MIN_LANE_ZONE = 300
const MIN_LANE_WIDTH = 1024

interface LaneTile {
  icon: HeroTileIconId
  /** Fraction of the spacing to nudge this tile along its lane. */
  offset: number
  /** Pixels above or below the lane's centre line. */
  dy: number
  /** Multiplier on the lane's tile size. */
  scale: number
  /** Resting roll, radians. */
  roll: number
  /** Seconds per vertical drift cycle. */
  drift: number
  /** Phase for drift and tilt, radians. */
  phase: number
}

interface Lane {
  /** Lane centre as a fraction of the free band's height. */
  y: number
  size: number
  depth: number
  /** Seconds to cross the visible area. */
  cross: number
  /** Where the first tile starts along the loop, as a fraction of it. */
  phase: number
  tiles: LaneTile[]
}

// Three loosely staggered streams. Speeds, phases and per-tile nudges are
// deliberately uneven so no two tiles restart together and no grid emerges.
const LANES: Lane[] = [
  {
    y: 0.1,
    size: 74,
    depth: -1.2,
    cross: 47,
    phase: 0.17,
    tiles: [
      { icon: 'figma', offset: 0.04, dy: 6, scale: 1, roll: -0.05, drift: 11.5, phase: 0.4 },
      { icon: 'photoshop', offset: -0.08, dy: -10, scale: 0.94, roll: 0.06, drift: 13.2, phase: 2.1 },
      { icon: 'react', offset: 0.09, dy: 14, scale: 1.04, roll: -0.03, drift: 12.4, phase: 4.3 },
    ],
  },
  {
    y: 0.5,
    size: 90,
    depth: 0.6,
    cross: 38,
    phase: 0.62,
    tiles: [
      { icon: 'vscode', offset: 0, dy: -8, scale: 1, roll: 0.05, drift: 10.4, phase: 1.2 },
      { icon: 'illustrator', offset: 0.1, dy: 12, scale: 0.92, roll: -0.06, drift: 14.1, phase: 3.6 },
    ],
  },
  {
    y: 0.9,
    size: 70,
    depth: -0.4,
    cross: 43,
    phase: 0.38,
    tiles: [
      { icon: 'react', offset: -0.06, dy: 4, scale: 1.06, roll: 0.04, drift: 12.9, phase: 5.2 },
      { icon: 'figma', offset: 0.07, dy: -12, scale: 0.96, roll: -0.05, drift: 11.1, phase: 0.9 },
    ],
  },
]

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function textRight(geometry: HeroGeometry) {
  return geometry.obstacles.reduce((max, r) => Math.max(max, r.right), 0)
}

/** True when there is room for the drifting streams beside the text. */
export function supportsLanes(geometry: HeroGeometry) {
  return (
    geometry.width >= MIN_LANE_WIDTH &&
    geometry.width - (textRight(geometry) + TEXT_GAP) >= MIN_LANE_ZONE
  )
}

/** Icons of the stream tiles, in the order `laneTiles` returns them. */
export function laneIcons(): HeroTileIconId[] {
  return LANES.flatMap((lane) => lane.tiles.map((tile) => tile.icon))
}

/** Poses for the drifting streams at scene time `t` (seconds). */
export function laneTiles(geometry: HeroGeometry, t: number): TilePose[] {
  const { width, height } = geometry
  const clearX = textRight(geometry) + TEXT_GAP
  const bandTop = NAV_CLEARANCE
  const bandBottom = height - BOTTOM_CLEARANCE
  const poses: TilePose[] = []

  LANES.forEach((lane, laneIndex) => {
    const laneY = bandTop + lane.y * (bandBottom - bandTop)
    const xStart = width + lane.size * 0.7
    const xEnd = clearX + lane.size / 2
    const visible = xStart - xEnd
    const count = lane.tiles.length
    // The loop is always longer than the visible run, so each tile wraps
    // while fully transparent and re-enters from beyond the right edge.
    const spacing = Math.max(visible / (count - 0.35), lane.size * 2.3)
    const loop = spacing * count
    const speed = visible / lane.cross

    lane.tiles.forEach((tile, i) => {
      const travelled =
        (((lane.phase + (i + tile.offset) / count) * loop + speed * t) % loop + loop) % loop
      const x = xStart - travelled
      const fadeIn = smoothstep(xStart, width - lane.size * 0.6, x)
      const fadeOut = smoothstep(xEnd, xEnd + FADE_OUT, x)
      const opacity = travelled > visible ? 0 : fadeIn * fadeOut

      poses.push({
        key: `lane-${laneIndex}-${i}`,
        icon: tile.icon,
        x,
        y: laneY + tile.dy + Math.sin((t / tile.drift) * Math.PI * 2 + tile.phase) * 9,
        size: lane.size * tile.scale,
        depth: lane.depth,
        rotX: Math.sin(t * 0.19 + tile.phase * 1.7) * 0.08,
        rotY: Math.sin(t * 0.23 + tile.phase) * 0.15,
        rotZ: tile.roll + Math.sin(t * 0.31 + tile.phase * 0.6) * 0.035,
        opacity,
      })
    })
  })

  return poses
}

interface CompactSlot {
  /** Centre as fractions of the hero's width and height. */
  fx: number
  fy: number
  size: number
  icon: HeroTileIconId
  roll: number
}

// Candidate spots for phones, tablets and narrow windows. Any spot that would
// touch text or controls is dropped, so small screens show fewer tiles.
const COMPACT_SLOTS: CompactSlot[] = [
  { fx: 0.86, fy: 0.15, size: 50, icon: 'figma', roll: -0.06 },
  { fx: 0.96, fy: 0.29, size: 46, icon: 'vscode', roll: 0.05 },
  { fx: 0.66, fy: 0.12, size: 40, icon: 'react', roll: 0.04 },
  { fx: 0.9, fy: 0.42, size: 44, icon: 'illustrator', roll: -0.04 },
  { fx: 0.97, fy: 0.08, size: 38, icon: 'photoshop', roll: 0.06 },
]
const COMPACT_MARGIN = 16
const COMPACT_MAX = 4

function intersects(a: Rect, b: Rect) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
}

/** A sparse still arrangement for screens without room for the streams. */
export function compactTiles(geometry: HeroGeometry): TilePose[] {
  const { width, height, obstacles } = geometry
  const placed: Rect[] = []
  const poses: TilePose[] = []

  for (const slot of COMPACT_SLOTS) {
    if (poses.length >= COMPACT_MAX) break
    const x = slot.fx * width
    const y = slot.fy * height
    const half = slot.size / 2 + COMPACT_MARGIN
    const box = { left: x - half, top: y - half, right: x + half, bottom: y + half }
    if (y - slot.size / 2 < NAV_CLEARANCE - 16) continue
    if (obstacles.some((r) => intersects(box, r)) || placed.some((r) => intersects(box, r))) continue
    placed.push(box)
    poses.push({
      key: `compact-${poses.length}`,
      icon: slot.icon,
      x,
      y,
      size: slot.size,
      depth: 0,
      rotX: 0,
      rotY: 0,
      rotZ: slot.roll,
      opacity: 1,
    })
  }

  return poses
}

/**
 * Measures the hero's text and controls relative to `frame`. Text is
 * measured per line box, so a wide block element with short lines doesn't
 * block the space beside it.
 */
export function measureHero(frame: HTMLElement, content: HTMLElement): HeroGeometry {
  const origin = frame.getBoundingClientRect()
  const obstacles: Rect[] = []
  const push = (r: DOMRect) => {
    if (r.width === 0 || r.height === 0) return
    obstacles.push({
      left: r.left - origin.left,
      top: r.top - origin.top,
      right: r.right - origin.left,
      bottom: r.bottom - origin.top,
    })
  }

  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim()) continue
    range.selectNodeContents(node)
    for (const r of Array.from(range.getClientRects())) push(r)
  }
  content.querySelectorAll('a, button, svg').forEach((el) => push(el.getBoundingClientRect()))

  return { width: origin.width, height: origin.height, obstacles }
}
