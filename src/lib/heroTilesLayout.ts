import type { HeroTileIconId } from '@/data/hero-tiles'

/**
 * Layout for the hero's floating software tiles, shared by the Three.js scene
 * and the static HTML composition so both draw the same arrangement.
 *
 * Everything is in hero-local CSS pixels (origin top-left, y down). The hero
 * text is measured at runtime, line by line, so each lane only runs where
 * nothing readable sits at its height, whatever the font metrics or viewport.
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

// Space kept clear under the fixed nav and above the hero's bottom edge.
const NAV_CLEARANCE = 80
const BOTTOM_CLEARANCE = 40
// Gap between the widest line of text and the free column for the lanes.
const TEXT_GAP = 64
// Clear space between text at a lane's height and any tile in that lane,
// even while the tile is still transparent.
const TILE_CLEARANCE = 32
// Extra height checked above and below a lane's tiles for text.
const TEXT_MARGIN = 14
// Distance over which a tile fades in as it passes a lane's left boundary.
const FEATHER = 160
// Height of the gentle vertical bob, each way.
const BOB = 6
// A lane narrower than this (beside wide text) stays empty.
const MIN_LANE_RUN = 220
// Seconds per crossing at the narrowest and widest lanes.
const CROSS_MIN = 35
const CROSS_MAX = 55
const RUN_NARROW = 400
const RUN_WIDE = 1400
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
  /** Seconds per vertical bob cycle. */
  drift: number
  /** Phase for bob and tilt, radians. */
  phase: number
}

interface Lane {
  /** Lane position within the free band: 0 at the top, 1 at the bottom. */
  y: number
  size: number
  depth: number
  /** Multiplier on the crossing time, so lanes never move in step. */
  pace: number
  /** Where the first tile starts along the loop, as a fraction of it. */
  phase: number
  tiles: LaneTile[]
}

// Four loosely staggered lanes, each tool appearing once. Smaller tiles sit
// further back. Speeds, phases and per-tile nudges are deliberately uneven so
// no two tiles recycle together and no conveyor rhythm emerges.
const LANES: Lane[] = [
  {
    y: 0,
    size: 56,
    depth: -1.6,
    pace: 1.06,
    phase: 0.12,
    tiles: [
      { icon: 'github', offset: 0, dy: 0, scale: 1, roll: -0.05, drift: 11.5, phase: 0.4 },
      { icon: 'photoshop', offset: 0.06, dy: 3, scale: 0.94, roll: 0.06, drift: 13.2, phase: 2.1 },
    ],
  },
  {
    y: 0.34,
    size: 86,
    depth: 0.6,
    pace: 0.95,
    phase: 0.58,
    tiles: [
      { icon: 'figma', offset: 0, dy: -6, scale: 1, roll: 0.05, drift: 10.4, phase: 1.2 },
      { icon: 'vscode', offset: 0.08, dy: 6, scale: 0.92, roll: -0.06, drift: 14.1, phase: 3.6 },
    ],
  },
  {
    y: 0.64,
    size: 68,
    depth: -0.8,
    pace: 1.02,
    phase: 0.31,
    tiles: [{ icon: 'react', offset: 0, dy: 4, scale: 1.04, roll: 0.04, drift: 12.9, phase: 5.2 }],
  },
  {
    y: 0.94,
    size: 76,
    depth: 0,
    pace: 0.9,
    phase: 0.83,
    tiles: [
      { icon: 'illustrator', offset: -0.05, dy: -4, scale: 0.96, roll: -0.05, drift: 11.1, phase: 0.9 },
      { icon: 'expo', offset: 0.04, dy: 4, scale: 1, roll: 0.04, drift: 12.2, phase: 4.4 },
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

// Right edge of the text overlapping a horizontal band, or null when the
// band is clear across the whole hero.
function textRightWithin(geometry: HeroGeometry, top: number, bottom: number) {
  let right: number | null = null
  for (const r of geometry.obstacles) {
    if (r.bottom > top && r.top < bottom) right = Math.max(right ?? 0, r.right)
  }
  return right
}

/**
 * Poses for the drifting lanes at scene time `t` (seconds). Tiles move left
 * to right. A lane beside text starts TILE_CLEARANCE past that text and fades
 * its tiles in over FEATHER; a lane clear of text starts beyond the left edge.
 * Each tile leaves past the right edge, waits there out of view, and
 * re-enters at the start while still invisible, so recycling never shows.
 */
export function laneTiles(geometry: HeroGeometry, t: number): TilePose[] {
  const { width, height } = geometry
  const bandTop = NAV_CLEARANCE
  const bandBottom = height - BOTTOM_CLEARANCE
  const poses: TilePose[] = []

  LANES.forEach((lane, laneIndex) => {
    const largest = lane.size * Math.max(...lane.tiles.map((tile) => tile.scale))
    const reach = largest / 2 + Math.max(...lane.tiles.map((tile) => Math.abs(tile.dy))) + BOB
    const laneY = bandTop + reach + lane.y * Math.max(0, bandBottom - bandTop - reach * 2)
    const textRight = textRightWithin(geometry, laneY - reach - TEXT_MARGIN, laneY + reach + TEXT_MARGIN)

    // Tile centres run from xStart (invisible) to xEnd (fully past the right edge).
    const feathered = textRight !== null
    const xStart = feathered ? textRight + TILE_CLEARANCE + largest / 2 : -largest
    const xEnd = width + largest
    const run = xEnd - xStart
    const usable = !feathered || width - (textRight + TILE_CLEARANCE) >= MIN_LANE_RUN

    const count = lane.tiles.length
    // Generous room between tiles in a lane, and a loop at least as long as
    // the run, so every tile spends some time waiting out of view.
    const loop = Math.max(run + largest, count * largest * 3.4)
    const widthFactor = Math.min(1, Math.max(0, (run - RUN_NARROW) / (RUN_WIDE - RUN_NARROW)))
    const cross = (CROSS_MIN + (CROSS_MAX - CROSS_MIN) * widthFactor) * lane.pace
    const speed = run / cross

    lane.tiles.forEach((tile, i) => {
      const travelled = (((lane.phase + (i + tile.offset) / count) * loop + speed * t) % loop + loop) % loop
      const x = xStart + travelled
      const fadeIn = feathered ? smoothstep(xStart, xStart + FEATHER, x) : 1
      const opacity = usable && travelled <= run ? fadeIn : 0

      poses.push({
        key: `lane-${laneIndex}-${i}`,
        icon: tile.icon,
        x,
        y: laneY + tile.dy + Math.sin((t / tile.drift) * Math.PI * 2 + tile.phase) * BOB,
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
