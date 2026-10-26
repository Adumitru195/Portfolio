import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import type { MutableRefObject, RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { ServiceId } from '@/data/services'
import { offsetWithin } from '@/lib/folderPaper'
import type { FolderSlot } from '@/lib/folderPaper'
import {
  CAMERA_Z,
  FOV,
  FRAME_H,
  FRAME_W,
  KNOB_REST,
  PART_ROTATION,
  REST_TILT,
  SHADOW,
  TRACK_LEFT,
  VISUALS,
  swell,
  wave,
} from '@/lib/serviceVisuals'
import type { VisualPart } from '@/lib/serviceVisuals'

/**
 * Three.js version of the "How I can help" visuals.
 *
 *  - One canvas covers the services list. Each visual is its own small scene
 *    and camera, drawn into its column's slot with a scissored viewport, so
 *    the section uses a single WebGL context.
 *  - Rounded slabs and knobs use matte Lambert shading; printed shapes are
 *    flat. Ambient and direct light sum so forward-facing surfaces show their
 *    token colours exactly, matching the static SVG.
 *  - Motion is a single gentle play of PLAY_SECONDS (a small tilt plus one
 *    movement inside each visual) that starts and ends at the resting pose.
 *    It plays when the list scrolls into view and again when a mouse moves
 *    onto a column. Each play is under five seconds, then rendering stops.
 *  - Rendering is on demand at ~30 fps, only while something moves, the list
 *    is on screen and the tab is visible. The device pixel ratio is capped at
 *    1.5, and everything is released on unmount.
 */

const PLAY_SECONDS = 4.5
const STAGGER = 0.35 // seconds between columns on entry
const FRAME_INTERVAL = 1000 / 30
const TILT_X = 0.035
const TILT_Y = 0.08
const HEADLINE_SHRINK = 0.3
const KNOB_TRAVEL = [0.16, -0.14, 0.12]
const SCREEN_LIFT = 0.05
const SHADOW_RESOLUTION = 200 // shadow texture pixels per frame unit

// Ambient + direct light along the face normal sum to PI (Lambert), so a
// forward-facing surface shows exactly its base colour.
const LIGHT_DIRECTION = new THREE.Vector3(-0.4, 0.6, 1).normalize()
const AMBIENT = 2.0
const DIRECT = (Math.PI - AMBIENT) / LIGHT_DIRECTION.z

function roundedRect(w: number, h: number, r: number) {
  const shape = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  shape.moveTo(x + r, y)
  shape.lineTo(x + w - r, y)
  shape.quadraticCurveTo(x + w, y, x + w, y + r)
  shape.lineTo(x + w, y + h - r)
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  shape.lineTo(x + r, y + h)
  shape.quadraticCurveTo(x, y + h, x, y + h - r)
  shape.lineTo(x, y + r)
  shape.quadraticCurveTo(x, y, x + r, y)
  return shape
}

// A panel whose front face rests at z = 0, with softly rounded edges.
function createSlab(part: VisualPart) {
  const depth = part.depth ?? 0.06
  const bevel = depth * 0.4
  const shape = roundedRect(part.w - 2 * bevel, part.h - 2 * bevel, Math.max(part.r - bevel, 0.001))
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: depth - 2 * bevel,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 8,
  })
  geometry.translate(0, 0, -(depth - bevel))
  return geometry
}

// A blurred rounded rectangle behind a panel, tinted like the CSS shadows.
function createShadow(part: VisualPart) {
  const pad = SHADOW.blur * 1.5 + SHADOW.y
  const planeW = part.w + pad * 2
  const planeH = part.h + pad * 2
  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(planeW * SHADOW_RESOLUTION)
  canvas.height = Math.ceil(planeH * SHADOW_RESOLUTION)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2D canvas unavailable')
  // Draw the shape far off-canvas so only its shadow lands on the texture.
  const away = canvas.width + 1000
  ctx.shadowColor = SHADOW.color
  ctx.shadowBlur = SHADOW.blur * SHADOW_RESOLUTION
  ctx.shadowOffsetX = away
  ctx.shadowOffsetY = SHADOW.y * SHADOW_RESOLUTION
  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.roundRect(
    pad * SHADOW_RESOLUTION - away,
    pad * SHADOW_RESOLUTION,
    part.w * SHADOW_RESOLUTION,
    part.h * SHADOW_RESOLUTION,
    part.r * SHADOW_RESOLUTION,
  )
  ctx.fill()
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const geometry = new THREE.PlaneGeometry(planeW, planeH)
  geometry.translate(0, 0, -(part.depth ?? 0.06) - 0.002)
  return { geometry, texture }
}

interface Visual {
  id: ServiceId
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  root: THREE.Group
  meshes: Map<string, THREE.Mesh>
  groups: Map<string, THREE.Group>
}

interface Built {
  visuals: Visual[]
  dispose: () => void
}

function buildVisuals(ids: ServiceId[]): Built {
  const geometries: THREE.BufferGeometry[] = []
  const textures: THREE.Texture[] = []
  const materials: THREE.Material[] = []
  const lambert = new Map<string, THREE.MeshLambertMaterial>()
  const material = (color: string) => {
    let m = lambert.get(color)
    if (!m) {
      m = new THREE.MeshLambertMaterial({ color })
      lambert.set(color, m)
      materials.push(m)
    }
    return m
  }
  const knobGeometry = new THREE.SphereGeometry(1, 24, 16)
  geometries.push(knobGeometry)

  const visuals = ids.map((id): Visual => {
    const scene = new THREE.Scene()
    scene.add(new THREE.AmbientLight(0xffffff, AMBIENT))
    const light = new THREE.DirectionalLight(0xffffff, DIRECT)
    light.position.copy(LIGHT_DIRECTION)
    scene.add(light)

    const root = new THREE.Group()
    root.rotation.set(REST_TILT.x, REST_TILT.y, 0)
    scene.add(root)

    const meshes = new Map<string, THREE.Mesh>()
    const groups = new Map<string, THREE.Group>()
    const parentOf = (key?: string) => {
      if (!key) return root
      let group = groups.get(key)
      if (!group) {
        group = new THREE.Group()
        groups.set(key, group)
        root.add(group)
      }
      return group
    }

    VISUALS[id].forEach((part, order) => {
      const parent = parentOf(part.group)
      let mesh: THREE.Mesh
      if (part.kind === 'slab') {
        const geometry = createSlab(part)
        geometries.push(geometry)
        mesh = new THREE.Mesh(geometry, material(part.color))
        if (part.shadow) {
          const shadow = createShadow(part)
          const shadowMaterial = new THREE.MeshBasicMaterial({
            map: shadow.texture,
            transparent: true,
            depthWrite: false,
          })
          geometries.push(shadow.geometry)
          textures.push(shadow.texture)
          materials.push(shadowMaterial)
          const shadowMesh = new THREE.Mesh(shadow.geometry, shadowMaterial)
          shadowMesh.position.set(part.x, part.y, part.z)
          shadowMesh.renderOrder = -1
          parent.add(shadowMesh)
        }
      } else if (part.kind === 'knob') {
        mesh = new THREE.Mesh(knobGeometry, material(part.color))
        mesh.scale.set(part.r, part.r, part.r * 0.55)
      } else {
        const geometry = new THREE.ShapeGeometry(roundedRect(part.w, part.h, part.r), 8)
        geometries.push(geometry)
        mesh = new THREE.Mesh(geometry, material(part.color))
      }
      mesh.position.set(part.x, part.y, part.z)
      mesh.rotation.z = PART_ROTATION[part.id] ?? 0
      mesh.renderOrder = order
      meshes.set(part.id, mesh)
      parent.add(mesh)
    })

    const camera = new THREE.PerspectiveCamera(FOV, FRAME_W / FRAME_H, 0.1, CAMERA_Z * 4)
    camera.position.set(0, 0, CAMERA_Z)
    return { id, scene, camera, root, meshes, groups }
  })

  return {
    visuals,
    dispose: () => {
      geometries.forEach((g) => g.dispose())
      textures.forEach((t) => t.dispose())
      materials.forEach((m) => m.dispose())
    },
  }
}

// Stretches a part from its left edge, keeping that edge in place.
function stretchFromLeft(mesh: THREE.Mesh | undefined, left: number, width: number, scale: number) {
  if (!mesh) return
  mesh.scale.x = scale
  mesh.position.x = left + (width * scale) / 2
}

// Places a visual at progress `u` through its play (0 and 1 are at rest).
function pose(visual: Visual, u: number) {
  const amount = swell(u)
  visual.root.rotation.x = REST_TILT.x - TILT_X * amount
  visual.root.rotation.y = REST_TILT.y + TILT_Y * Math.sin(2 * Math.PI * u) * amount

  if (visual.id === 'build') {
    const headline = VISUALS.build.find((p) => p.id === 'headline')
    if (headline) {
      stretchFromLeft(visual.meshes.get('headline'), headline.x - headline.w / 2, headline.w, 1 - HEADLINE_SHRINK * amount)
    }
  } else if (visual.id === 'improve') {
    KNOB_REST.forEach((rest, i) => {
      const x = rest + KNOB_TRAVEL[i] * wave(u, i)
      const knob = visual.meshes.get(`knob-${i}`)
      if (knob) knob.position.x = x
      const restWidth = rest - TRACK_LEFT
      stretchFromLeft(visual.meshes.get(`fill-${i}`), TRACK_LEFT, restWidth, (x - TRACK_LEFT) / restWidth)
    })
  } else {
    for (let i = 0; i < 3; i++) {
      const group = visual.groups.get(`screen-${i}`)
      if (!group) continue
      const lift = wave(u, i)
      group.position.set(0, lift * SCREEN_LIFT * 0.3, lift * SCREEN_LIFT)
    }
  }
}

export interface ServiceColumn {
  id: ServiceId
  column: HTMLElement
  slot: HTMLElement
}

interface VisualsProps {
  gridRef: RefObject<HTMLElement>
  columns: MutableRefObject<ServiceColumn[]>
  inView: boolean
  running: boolean
  onFirstFrame: () => void
}

function Visuals({ gridRef, columns, inView, running, onFirstFrame }: VisualsProps) {
  const invalidate = useThree((state) => state.invalidate)
  const ids = useMemo(() => columns.current.map((c) => c.id), [columns])
  const built = useMemo(() => buildVisuals(ids), [ids])
  useEffect(() => built.dispose, [built])

  const rects = useRef<(FolderSlot | null)[]>([])
  const clock = useRef(0)
  const plays = useRef<(number | null)[]>(ids.map(() => null))
  const runningRef = useRef(running)
  runningRef.current = running
  const firstFrame = useRef(false)
  const loop = useRef({ frame: 0, previous: 0 })

  const playing = useCallback(
    () => plays.current.some((start) => start !== null && clock.current - start < PLAY_SECONDS),
    [],
  )

  // Advances the clock at ~30 fps while something is playing. The clock only
  // moves while the list is visible, so a hidden tab picks up where it left.
  const wake = useCallback(() => {
    const state = loop.current
    if (state.frame || !runningRef.current || document.hidden || !playing()) return
    state.previous = performance.now()
    const tick = (now: number) => {
      state.frame = requestAnimationFrame(tick)
      const elapsed = now - state.previous
      if (elapsed < FRAME_INTERVAL - 2) return
      state.previous = now
      clock.current += Math.min(elapsed, 100) / 1000
      invalidate()
      if (!playing()) {
        cancelAnimationFrame(state.frame)
        state.frame = 0
      }
    }
    state.frame = requestAnimationFrame(tick)
  }, [invalidate, playing])

  const sleep = useCallback(() => {
    cancelAnimationFrame(loop.current.frame)
    loop.current.frame = 0
  }, [])

  useEffect(() => {
    if (running) wake()
    else sleep()
  }, [running, wake, sleep])
  useEffect(() => sleep, [sleep])

  // Each time the list comes into view, play any visual that is at rest,
  // left to right.
  useEffect(() => {
    if (!inView) return
    plays.current = plays.current.map((start, i) =>
      start !== null && clock.current - start < PLAY_SECONDS ? start : clock.current + i * STAGGER,
    )
    wake()
  }, [inView, wake])

  // A mouse moving onto a column replays that column's visual once.
  useEffect(() => {
    const cleanups = columns.current.map(({ column }, i) => {
      const onEnter = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return
        const start = plays.current[i]
        if (start !== null && clock.current - start < PLAY_SECONDS) return
        plays.current[i] = clock.current
        wake()
      }
      column.addEventListener('pointerenter', onEnter)
      return () => column.removeEventListener('pointerenter', onEnter)
    })
    return () => cleanups.forEach((cleanup) => cleanup())
  }, [columns, wake])

  // Keep each slot's position within the list up to date.
  useLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    let frame = 0
    const read = () => {
      rects.current = columns.current.map(({ slot }) => {
        const rect = offsetWithin(slot, grid)
        return rect.w > 0 && rect.h > 0 ? rect : null
      })
      invalidate()
    }
    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(read)
    }
    read()
    const observer = new ResizeObserver(measure)
    observer.observe(grid)
    columns.current.forEach(({ slot }) => observer.observe(slot))
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [gridRef, columns, invalidate])

  // Priority 1 takes over rendering: clear once, then draw each visual into
  // its own slot.
  useFrame(({ gl, size }) => {
    gl.setScissorTest(false)
    gl.clear()
    gl.setScissorTest(true)
    let drawn = false
    built.visuals.forEach((visual, i) => {
      const rect = rects.current[i]
      if (!rect) return
      const start = plays.current[i]
      const u = start === null ? 0 : (clock.current - start) / PLAY_SECONDS
      if (start !== null && u >= 1) plays.current[i] = null
      pose(visual, start === null || u >= 1 ? 0 : u)

      // Fit the whole frame inside the slot, whatever its rounded size.
      const aspect = rect.w / rect.h
      const frameH = Math.max(FRAME_H, FRAME_W / aspect)
      visual.camera.aspect = aspect
      visual.camera.position.z = frameH / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2))
      visual.camera.updateProjectionMatrix()

      const bottom = size.height - rect.y - rect.h
      gl.setViewport(rect.x, bottom, rect.w, rect.h)
      gl.setScissor(rect.x, bottom, rect.w, rect.h)
      gl.render(visual.scene, visual.camera)
      drawn = true
    })
    gl.setScissorTest(false)
    gl.setViewport(0, 0, size.width, size.height)

    if (drawn && !firstFrame.current) {
      firstFrame.current = true
      requestAnimationFrame(onFirstFrame)
    }
  }, 1)

  return null
}

interface ServiceVisualsSceneProps {
  gridRef: RefObject<HTMLElement>
  columns: MutableRefObject<ServiceColumn[]>
  inView: boolean
  running: boolean
  onReady: () => void
  onFail: () => void
}

export default function ServiceVisualsScene({ gridRef, columns, inView, running, onReady, onFail }: ServiceVisualsSceneProps) {
  const callbacks = useRef({ onReady, onFail })
  callbacks.current = { onReady, onFail }
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const handleContextLost = useCallback((event: Event) => {
    event.preventDefault()
    callbacks.current.onFail()
  }, [])
  const handleFirstFrame = useCallback(() => callbacks.current.onReady(), [])

  // Removed before R3F tears the context down, so an unmount isn't reported
  // as a failure.
  useEffect(
    () => () => canvasRef.current?.removeEventListener('webglcontextlost', handleContextLost),
    [handleContextLost],
  )

  return (
    <Canvas
      flat
      frameloop="demand"
      dpr={[1, 1.5]}
      // Size only, not page position: scroll-driven re-measures would redraw
      // the visuals while they are at rest or offscreen.
      resize={{ scroll: false }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      onCreated={({ gl }) => {
        gl.autoClear = false
        gl.setClearColor(0x000000, 0)
        canvasRef.current = gl.domElement
        gl.domElement.addEventListener('webglcontextlost', handleContextLost)
      }}
    >
      <Visuals
        gridRef={gridRef}
        columns={columns}
        inView={inView}
        running={running}
        onFirstFrame={handleFirstFrame}
      />
    </Canvas>
  )
}
