/**
 * The homepage hero's "workspace" composition, shared by the HTML version
 * (src/components/hero/HeroWorkspace.tsx) and the Three.js scene
 * (src/components/hero/HeroWorkspaceScene.tsx) so the hand-off between them
 * is exact.
 *
 * Every panel is painted once into a <canvas>: the HTML version shows that
 * canvas, and the scene uploads the very same canvas as its texture.
 *
 * Distances are CSS pixels and angles degrees, in screen terms: +x right,
 * +y down, +rotate clockwise.
 */
import { heroWorkspaceAssets as assets } from '@/data/hero'

export type PanelKind = 'wireframe' | 'browser' | 'components' | 'phone' | 'chip'

/** Back to front: the order panels are drawn and stacked in. */
export const PANEL_ORDER: PanelKind[] = ['wireframe', 'browser', 'components', 'phone', 'chip']

/** Same curve as the site's reveals (src/lib/motion.ts). */
export const WORKSPACE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** Extra room around the stage so tilted panels and shadows aren't clipped. */
export const SCENE_BLEED = 72

/** Below this stage width the composition drops to its compact arrangement. */
export const COMPACT_BELOW = 440

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export interface PanelPose extends Rect {
  kind: PanelKind
  /** Resting roll. */
  rotate: number
  /** Corner radius of the panel's card, for shadows and the 3D slab. */
  radius: number
  /** Distance in front of the stage plane; nearer panels move more. */
  depth: number
}

export interface WorkspaceLayout {
  width: number
  height: number
  compact: boolean
  plate: Rect
  panels: PanelPose[]
}

export interface PanelMotion {
  delay: number
  duration: number
  fromX: number
  fromY: number
  fromRotate: number
}

/**
 * The assembly, in order: the wireframe lands first where the finished page
 * will sit, then eases back as the build arrives over it; the components and
 * the app follow. Offsets are relative to each panel's resting place.
 */
export const panelMotion: Record<PanelKind, PanelMotion> = {
  wireframe: { delay: 0.1, duration: 1.7, fromX: 150, fromY: 104, fromRotate: 2.5 },
  browser: { delay: 0.75, duration: 1.1, fromX: 0, fromY: 56, fromRotate: 1.5 },
  components: { delay: 1.1, duration: 1, fromX: -36, fromY: 28, fromRotate: -5 },
  phone: { delay: 1.25, duration: 1.1, fromX: 40, fromY: 64, fromRotate: 8 },
  chip: { delay: 1.6, duration: 0.8, fromX: 0, fromY: 16, fromRotate: 0 },
}

/** When the whole entrance has finished, in seconds from its start. */
export const ENTRANCE_END = Math.max(
  ...Object.values(panelMotion).map((m) => m.delay + m.duration),
)

/** Pointer response on desktop. Deeper panels tilt and shift a little more. */
export const POINTER = { tiltX: 2.5, tiltY: 3.5, shiftPerDepth: 0.06, baseShift: 4 }

/** Height of a panel for a given width, from its content's proportions. */
function heightFor(kind: PanelKind, w: number) {
  switch (kind) {
    case 'wireframe': {
      const u = w / 320
      const imgW = w - 20 * u
      return 30 * u + imgW * (assets.wireframe.height / assets.wireframe.width) + 10 * u
    }
    case 'browser':
      return 30 * (w / 480) + w * (assets.browser.height / assets.browser.width)
    case 'components':
      return w * 0.86
    case 'phone':
      return w * (assets.phone.height / assets.phone.width)
    case 'chip':
      return w * (40 / 184)
  }
}

function radiusFor(kind: PanelKind, w: number, h: number) {
  switch (kind) {
    case 'wireframe':
      return 8 * (w / 320)
    case 'browser':
      return 10 * (w / 480)
    case 'components':
      return 10 * (w / 200)
    case 'phone':
      return w * 0.14
    case 'chip':
      return h / 2
  }
}

const DEPTH: Record<PanelKind, number> = {
  wireframe: 0,
  browser: 40,
  components: 90,
  phone: 120,
  chip: 150,
}

interface Placement {
  kind: PanelKind
  /** Left edge and width as fractions of the stage width. */
  x: number
  w: number
  /** Top edge as a fraction of the stage height. */
  y: number
  rotate: number
}

// Wide: the finished page dominates, the wireframe peeks out behind it, the
// components overlap its lower left and the app stands in front on the right.
const WIDE: Placement[] = [
  { kind: 'wireframe', x: 0, y: 0, w: 0.5, rotate: -3 },
  { kind: 'browser', x: 0.19, y: 0.22, w: 0.7, rotate: 0 },
  { kind: 'components', x: 0.0, y: 0.68, w: 0.28, rotate: -2 },
  { kind: 'phone', x: 0.72, y: 0.31, w: 0.25, rotate: 3 },
  { kind: 'chip', x: 0.5, y: 0.885, w: 0.27, rotate: 0 },
]

// Compact (phones, small tablets): three pieces, larger, no small text.
const COMPACT: Placement[] = [
  { kind: 'wireframe', x: 0, y: 0, w: 0.62, rotate: -3 },
  { kind: 'browser', x: 0.1, y: 0.27, w: 0.76, rotate: 0 },
  { kind: 'phone', x: 0.69, y: 0.3, w: 0.3, rotate: 3 },
]

/** Stage height as a fraction of its width (the stage's CSS aspect-ratio). */
export const STAGE_RATIO = 0.86

export function computeLayout(width: number, height: number): WorkspaceLayout {
  const compact = width < COMPACT_BELOW
  const placements = compact ? COMPACT : WIDE
  const panels = placements.map<PanelPose>((p) => {
    const w = p.w * width
    const h = heightFor(p.kind, w)
    return {
      kind: p.kind,
      x: p.x * width,
      y: p.y * height,
      w,
      h,
      rotate: p.rotate,
      radius: radiusFor(p.kind, w, h),
      depth: DEPTH[p.kind],
    }
  })
  const plate = compact
    ? { x: -width * 0.04, y: height * 0.04, w: width * 1.08, h: height * 0.96 }
    : { x: width * 0.02, y: height * 0.0, w: width * 1.0, h: height * 1.04 }
  return { width, height, compact, plate, panels }
}

/* -------------------------------------------------------------------------- */
/* Painting                                                                    */
/* -------------------------------------------------------------------------- */

export type WorkspaceImages = Partial<Record<'wireframe' | 'browser' | 'phone', HTMLImageElement>>

const UI_FONT = 'Geist, system-ui, sans-serif'
const INK = '#1C1C1C'
const MUTED = '#8A8A86'
const PAPER = '#FFFFFF'
const HAIRLINE = '#E6E3DC'
const IMAGE_PLACEHOLDER = '#F1EFEA'

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

/** Draws an image to cover a box, anchored at its top. */
function drawCoverTop(ctx: CanvasRenderingContext2D, img: HTMLImageElement | undefined, x: number, y: number, w: number, h: number) {
  if (!img) {
    ctx.fillStyle = IMAGE_PLACEHOLDER
    ctx.fillRect(x, y, w, h)
    return
  }
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight)
  const sw = w / scale
  const sh = h / scale
  const sx = (img.naturalWidth - sw) / 2
  ctx.drawImage(img, sx, 0, sw, sh, x, y, w, h)
}

function card(ctx: CanvasRenderingContext2D, w: number, h: number, r: number) {
  roundRectPath(ctx, 0, 0, w, h, r)
  ctx.fillStyle = PAPER
  ctx.fill()
  ctx.save()
  ctx.clip()
}

function hairline(ctx: CanvasRenderingContext2D, w: number, h: number, r: number, u: number) {
  ctx.restore()
  roundRectPath(ctx, 0.5 * u, 0.5 * u, w - u, h - u, r)
  ctx.strokeStyle = HAIRLINE
  ctx.lineWidth = u
  ctx.stroke()
}

function paintWireframe(ctx: CanvasRenderingContext2D, w: number, h: number, img?: HTMLImageElement) {
  const u = w / 320
  const r = radiusFor('wireframe', w, h)
  card(ctx, w, h, r)
  ctx.fillStyle = MUTED
  ctx.font = `500 ${10.5 * u}px ${UI_FONT}`
  ctx.textBaseline = 'middle'
  // A dashed square: the sketch marker.
  ctx.setLineDash([2 * u, 2 * u])
  ctx.strokeStyle = '#B9B6AE'
  ctx.lineWidth = u
  ctx.strokeRect(12 * u, 11 * u, 8 * u, 8 * u)
  ctx.setLineDash([])
  ctx.fillText(assets.wireframe.caption, 27 * u, 15.5 * u)
  ctx.textAlign = 'right'
  ctx.fillText(assets.wireframe.project, w - 12 * u, 15.5 * u)
  ctx.textAlign = 'left'
  const imgW = w - 20 * u
  const imgH = h - 40 * u
  drawCoverTop(ctx, img, 10 * u, 30 * u, imgW, imgH)
  ctx.strokeStyle = HAIRLINE
  ctx.lineWidth = u
  ctx.strokeRect(10 * u, 30 * u, imgW, imgH)
  hairline(ctx, w, h, r, u)
}

function paintBrowser(ctx: CanvasRenderingContext2D, w: number, h: number, img?: HTMLImageElement) {
  const u = w / 480
  const r = radiusFor('browser', w, h)
  const chrome = 30 * u
  card(ctx, w, h, r)
  ctx.fillStyle = '#FBFAF8'
  ctx.fillRect(0, 0, w, chrome)
  ;['#E2DFD8', '#E2DFD8', '#E2DFD8'].forEach((c, i) => {
    ctx.beginPath()
    ctx.arc(14 * u + i * 11 * u, chrome / 2, 3.5 * u, 0, Math.PI * 2)
    ctx.fillStyle = c
    ctx.fill()
  })
  const pillW = w * 0.42
  roundRectPath(ctx, (w - pillW) / 2, chrome / 2 - 9 * u, pillW, 18 * u, 9 * u)
  ctx.fillStyle = '#F0EEE9'
  ctx.fill()
  ctx.fillStyle = MUTED
  ctx.font = `500 ${9.5 * u}px ${UI_FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(assets.browser.caption, w / 2, chrome / 2 + 0.5 * u)
  ctx.textAlign = 'left'
  ctx.fillStyle = HAIRLINE
  ctx.fillRect(0, chrome - u, w, u)
  drawCoverTop(ctx, img, 0, chrome, w, h - chrome)
  hairline(ctx, w, h, r, u)
}

function paintComponents(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const u = w / 200
  const r = radiusFor('components', w, h)
  const c = assets.components
  card(ctx, w, h, r)
  ctx.textBaseline = 'middle'
  ctx.fillStyle = INK
  ctx.font = `500 ${10.5 * u}px ${UI_FONT}`
  ctx.fillText(c.title, 14 * u, 18 * u)
  ctx.fillStyle = MUTED
  ctx.textAlign = 'right'
  ctx.fillText(c.project, w - 14 * u, 18 * u)
  ctx.textAlign = 'left'
  ctx.fillStyle = HAIRLINE
  ctx.fillRect(14 * u, 32 * u, w - 28 * u, u)

  // Colour tokens.
  const sw = 34 * u
  const gap = (w - 28 * u - sw * 4) / 3
  c.swatches.forEach((s, i) => {
    const x = 14 * u + i * (sw + gap)
    roundRectPath(ctx, x, 42 * u, sw, sw, 5 * u)
    ctx.fillStyle = s.hex
    ctx.fill()
    if (s.name === 'Sunken') {
      ctx.strokeStyle = HAIRLINE
      ctx.lineWidth = u
      ctx.stroke()
    }
    ctx.fillStyle = MUTED
    ctx.font = `400 ${7 * u}px ${UI_FONT}`
    ctx.fillText(s.hex.toUpperCase(), x, 84 * u)
  })

  // Input + button, as on Porchlight's search card.
  const rowY = 98 * u
  const rowH = 26 * u
  const btnW = 52 * u
  const inputW = w - 28 * u - btnW - 6 * u
  roundRectPath(ctx, 14 * u, rowY, inputW, rowH, 5 * u)
  ctx.fillStyle = PAPER
  ctx.fill()
  ctx.strokeStyle = c.input.border
  ctx.lineWidth = u
  ctx.stroke()
  ctx.fillStyle = c.input.text
  ctx.font = `400 ${8 * u}px ${UI_FONT}`
  ctx.fillText(c.input.placeholder, 22 * u, rowY + rowH / 2)
  roundRectPath(ctx, w - 14 * u - btnW, rowY, btnW, rowH, 5 * u)
  ctx.fillStyle = c.button.fill
  ctx.fill()
  ctx.fillStyle = c.button.text
  ctx.font = `500 ${8.5 * u}px ${UI_FONT}`
  ctx.textAlign = 'center'
  ctx.fillText(c.button.label, w - 14 * u - btnW / 2, rowY + rowH / 2)
  ctx.textAlign = 'left'

  // Status pill.
  const pillY = 136 * u
  ctx.font = `500 ${7.5 * u}px ${UI_FONT}`
  const pillW = ctx.measureText(c.pill.label).width + 16 * u
  roundRectPath(ctx, 14 * u, pillY, pillW, 16 * u, 8 * u)
  ctx.fillStyle = c.pill.fill
  ctx.fill()
  ctx.strokeStyle = c.pill.border
  ctx.stroke()
  ctx.fillStyle = c.pill.text
  ctx.fillText(c.pill.label, 22 * u, pillY + 8.5 * u)
  hairline(ctx, w, h, r, u)
}

function paintPhone(ctx: CanvasRenderingContext2D, w: number, h: number, img?: HTMLImageElement) {
  if (img) ctx.drawImage(img, 0, 0, w, h)
  else {
    roundRectPath(ctx, 0, 0, w, h, radiusFor('phone', w, h))
    ctx.fillStyle = '#1A1A1A'
    ctx.fill()
  }
}

function paintChip(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const u = w / 184
  const chip = assets.phoneChip
  roundRectPath(ctx, 0, 0, w, h, h / 2)
  ctx.fillStyle = PAPER
  ctx.fill()
  ctx.strokeStyle = HAIRLINE
  ctx.lineWidth = u
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(18 * u, h / 2, 4 * u, 0, Math.PI * 2)
  ctx.fillStyle = chip.dot
  ctx.fill()
  ctx.textBaseline = 'middle'
  ctx.fillStyle = INK
  ctx.font = `500 ${10.5 * u}px ${UI_FONT}`
  ctx.fillText(chip.title, 30 * u, h / 2 + 0.5 * u)
  const titleW = ctx.measureText(chip.title).width
  ctx.fillStyle = MUTED
  ctx.font = `400 ${10.5 * u}px ${UI_FONT}`
  ctx.fillText(chip.meta, 30 * u + titleW + 7 * u, h / 2 + 0.5 * u)
}

/** Texture resolution: enough for a 2x display, capped to keep uploads small. */
export function canvasScale(cssWidth: number) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  return Math.min(dpr, 1600 / cssWidth)
}

/** Paints a panel into its canvas at the panel's size. */
export function paintPanel(canvas: HTMLCanvasElement, pose: PanelPose, images: WorkspaceImages) {
  const scale = canvasScale(pose.w)
  const width = Math.max(1, Math.round(pose.w * scale))
  const height = Math.max(1, Math.round(pose.h * scale))
  if (canvas.width !== width) canvas.width = width
  if (canvas.height !== height) canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, width, height)
  ctx.setTransform(width / pose.w, 0, 0, height / pose.h, 0, 0)
  ctx.imageSmoothingQuality = 'high'
  switch (pose.kind) {
    case 'wireframe':
      return paintWireframe(ctx, pose.w, pose.h, images.wireframe)
    case 'browser':
      return paintBrowser(ctx, pose.w, pose.h, images.browser)
    case 'components':
      return paintComponents(ctx, pose.w, pose.h)
    case 'phone':
      return paintPhone(ctx, pose.w, pose.h, images.phone)
    case 'chip':
      return paintChip(ctx, pose.w, pose.h)
  }
}
