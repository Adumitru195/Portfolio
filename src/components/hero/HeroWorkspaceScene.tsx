import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { MutableRefObject, RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { cubicBezier } from 'framer-motion'
import * as THREE from 'three'
import { PANEL_ORDER, POINTER, SCENE_BLEED, WORKSPACE_EASE, panelMotion } from '@/lib/heroWorkspace'
import type { PanelKind, PanelPose, WorkspaceLayout } from '@/lib/heroWorkspace'

/**
 * Three.js version of the hero workspace. Each panel is a thin slab whose
 * face is the same painted canvas the HTML version shows.
 *
 *  - The entrance replays the HTML assembly on the same timeline, so the
 *    canvas can take over mid-entrance without a jump.
 *  - Afterwards the panels answer the pointer with a few degrees of tilt and
 *    a small parallax shift that grows with their depth, then settle.
 *  - Panels nearer the camera are scaled back toward the centre so at rest
 *    they project at exactly their HTML position and size.
 *  - Unlit materials keep the screenshots' colours true. Rendering is on
 *    demand and stops once everything settles, while the hero is offscreen,
 *    or while the tab is hidden.
 */

const FOV = 20
const SLAB_DEPTH = 6 // px
const SMOOTHING = 5 // higher settles faster
const SETTLED = 0.0005
const SHADOW_TINT = '#2E2B6E'

const EDGE: Record<PanelKind, string> = {
  wireframe: '#E3E0D8',
  browser: '#E3E0D8',
  components: '#E3E0D8',
  phone: '#141414',
  chip: '#E3E0D8',
}

// Shadow sprite: size relative to the panel, drop below it, and strength.
const SHADOW: Record<PanelKind, { sx: number; sy: number; drop: number; opacity: number }> = {
  wireframe: { sx: 1.18, sy: 1.22, drop: 0.05, opacity: 0.3 },
  browser: { sx: 1.2, sy: 1.26, drop: 0.07, opacity: 0.42 },
  components: { sx: 1.24, sy: 1.3, drop: 0.07, opacity: 0.42 },
  phone: { sx: 1.3, sy: 1.12, drop: 0.04, opacity: 0.38 },
  chip: { sx: 1.12, sy: 1.5, drop: 0.12, opacity: 0.22 },
}

const ease = cubicBezier(...WORKSPACE_EASE)
const deg = THREE.MathUtils.degToRad

function roundedRect(w: number, h: number, r: number) {
  const x = -w / 2
  const y = -h / 2
  const radius = Math.min(r, w / 2, h / 2)
  const shape = new THREE.Shape()
  shape.moveTo(x + radius, y)
  shape.lineTo(x + w - radius, y)
  shape.quadraticCurveTo(x + w, y, x + w, y + radius)
  shape.lineTo(x + w, y + h - radius)
  shape.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
  shape.lineTo(x + radius, y + h)
  shape.quadraticCurveTo(x, y + h, x, y + h - radius)
  shape.lineTo(x, y + radius)
  shape.quadraticCurveTo(x, y, x + radius, y)
  return shape
}

function createShadowTexture() {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    // Draw the shape off-canvas and keep only its blurred shadow.
    ctx.shadowColor = '#ffffff'
    ctx.shadowBlur = 20
    ctx.shadowOffsetX = size * 4
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.roundRect(size * 0.2 - size * 4, size * 0.2, size * 0.6, size * 0.6, size * 0.06)
    ctx.fill()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function canvasTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.generateMipmaps = false
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  return texture
}

interface Smoothed {
  tiltX: number
  tiltY: number
  shiftX: number
  shiftY: number
}

interface BuiltPanel {
  pose: PanelPose
  slab: THREE.ExtrudeGeometry
  face: THREE.PlaneGeometry
  shadow: THREE.PlaneGeometry
  texture: THREE.CanvasTexture
  materials: {
    face: THREE.MeshBasicMaterial
    edge: THREE.MeshBasicMaterial
    shadow: THREE.MeshBasicMaterial
  }
}

interface PanelsProps {
  layout: WorkspaceLayout
  canvases: MutableRefObject<Partial<Record<PanelKind, HTMLCanvasElement>>>
  paintVersion: number
  interactionRef: RefObject<HTMLElement>
  entranceStart: number
  active: boolean
  onFirstFrame: () => void
}

function Panels({ layout, canvases, paintVersion, interactionRef, entranceStart, active, onFirstFrame }: PanelsProps) {
  const { size, camera, invalidate } = useThree()
  const activeRef = useRef(active)
  activeRef.current = active

  // One world unit is one CSS pixel at z = 0.
  const cameraZ = size.height / 2 / Math.tan(deg(FOV / 2))
  useEffect(() => {
    camera.position.set(0, 0, cameraZ)
    camera.near = cameraZ / 10
    camera.far = cameraZ * 3
    camera.updateProjectionMatrix()
    invalidate()
  }, [camera, cameraZ, invalidate])

  const sizeKey = layout.panels.map((p) => `${p.kind}:${p.w.toFixed(1)}x${p.h.toFixed(1)}`).join('|')

  // Geometry, materials and textures are rebuilt only when a panel's size
  // changes; positions update every frame.
  const built = useMemo(() => {
    const shadowTexture = createShadowTexture()
    const panels: BuiltPanel[] = []
    for (const pose of layout.panels) {
      const canvas = canvases.current[pose.kind]
      if (!canvas) continue
      const inset = pose.kind === 'phone' ? pose.w * 0.012 : 0.5
      const slab = new THREE.ExtrudeGeometry(roundedRect(pose.w - inset * 2, pose.h - inset * 2, pose.radius), {
        depth: SLAB_DEPTH,
        bevelEnabled: false,
        curveSegments: 10,
      })
      slab.translate(0, 0, -SLAB_DEPTH - 0.5)
      const shadowSpec = SHADOW[pose.kind]
      const texture = canvasTexture(canvas)
      panels.push({
        pose,
        slab,
        face: new THREE.PlaneGeometry(pose.w, pose.h),
        shadow: new THREE.PlaneGeometry(pose.w * shadowSpec.sx, pose.h * shadowSpec.sy),
        texture,
        materials: {
          face: new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.01, toneMapped: false }),
          edge: new THREE.MeshBasicMaterial({ color: EDGE[pose.kind], transparent: true, toneMapped: false }),
          shadow: new THREE.MeshBasicMaterial({
            map: shadowTexture,
            color: SHADOW_TINT,
            transparent: true,
            depthWrite: false,
            toneMapped: false,
          }),
        },
      })
    }
    return { shadowTexture, panels }
    // The size key stands in for the panels' dimensions.
  }, [sizeKey, canvases])

  useEffect(
    () => () => {
      built.shadowTexture.dispose()
      for (const p of built.panels) {
        p.slab.dispose()
        p.face.dispose()
        p.shadow.dispose()
        p.texture.dispose()
        Object.values(p.materials).forEach((m) => m.dispose())
      }
    },
    [built],
  )

  // Repainted canvases (a resize, or a late image) re-upload.
  useEffect(() => {
    for (const p of built.panels) p.texture.needsUpdate = true
    invalidate()
  }, [paintVersion, built, invalidate])

  // Latest resting poses, read per frame without rebuilding anything.
  const poses = useRef(new Map<PanelKind, PanelPose>())
  poses.current = new Map(layout.panels.map((p) => [p.kind, p]))

  const groups = useRef(new Map<PanelKind, THREE.Group>())
  const shadows = useRef(new Map<PanelKind, THREE.Mesh>())
  const smoothed = useRef(new Map<PanelKind, Smoothed>())
  const target = useRef({ x: 0, y: 0 })
  const lastTime = useRef(performance.now())

  // Pointer over the hero, normalised to -1..1. Mouse only.
  useEffect(() => {
    const area = interactionRef.current
    if (!area) return
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const r = area.getBoundingClientRect()
      target.current.x = Math.max(-1, Math.min(1, ((event.clientX - r.left) / r.width) * 2 - 1))
      target.current.y = Math.max(-1, Math.min(1, ((event.clientY - r.top) / r.height) * 2 - 1))
      if (activeRef.current) invalidate()
    }
    const onLeave = () => {
      target.current.x = 0
      target.current.y = 0
      if (activeRef.current) invalidate()
    }
    area.addEventListener('pointermove', onMove, { passive: true })
    area.addEventListener('pointerleave', onLeave)
    return () => {
      area.removeEventListener('pointermove', onMove)
      area.removeEventListener('pointerleave', onLeave)
    }
  }, [interactionRef, invalidate])

  // Resume when the hero comes back on screen or the tab is shown again.
  useEffect(() => {
    lastTime.current = performance.now()
    if (active) invalidate()
  }, [active, invalidate])

  const firstFrame = useRef(false)

  useFrame(() => {
    const now = performance.now()
    const dt = Math.min(0.1, (now - lastTime.current) / 1000)
    lastTime.current = now
    const blend = 1 - Math.exp(-dt * SMOOTHING)
    const { width, height } = size
    let moving = false

    for (const p of built.panels) {
      const kind = p.pose.kind
      const pose = poses.current.get(kind) ?? p.pose
      const group = groups.current.get(kind)
      const shadow = shadows.current.get(kind)
      if (!group || !shadow) continue
      const m = panelMotion[kind]

      // Entrance progress on the shared timeline.
      const t = (now - entranceStart) / 1000 - m.delay
      const prog = t <= 0 ? 0 : t >= m.duration ? 1 : ease(t / m.duration)
      if (prog < 1) moving = true

      // Ease the pointer response toward its target.
      const reach = POINTER.baseShift + pose.depth * POINTER.shiftPerDepth
      const goal: Smoothed = {
        tiltX: target.current.y * POINTER.tiltX,
        tiltY: target.current.x * POINTER.tiltY,
        shiftX: -target.current.x * reach,
        shiftY: -target.current.y * reach * 0.6,
      }
      const s = smoothed.current.get(kind) ?? { tiltX: 0, tiltY: 0, shiftX: 0, shiftY: 0 }
      for (const key of ['tiltX', 'tiltY', 'shiftX', 'shiftY'] as const) {
        s[key] += (goal[key] - s[key]) * blend
        if (Math.abs(goal[key] - s[key]) > SETTLED) moving = true
        else s[key] = goal[key]
      }
      smoothed.current.set(kind, s)

      // Rest position in canvas pixels, then into world units (y up).
      const cx = pose.x + pose.w / 2 + SCENE_BLEED + m.fromX * (1 - prog) + s.shiftX
      const cy = pose.y + pose.h / 2 + SCENE_BLEED + m.fromY * (1 - prog) + s.shiftY
      const roll = pose.rotate + m.fromRotate * (1 - prog)
      const x = cx - width / 2
      const y = height / 2 - cy
      const z = pose.depth

      const f = (cameraZ - z) / cameraZ
      group.position.set(x * f, y * f, z)
      group.scale.setScalar(f)
      group.rotation.set(deg(s.tiltX), deg(s.tiltY), -deg(roll))

      const spec = SHADOW[kind]
      const shadowZ = z - SLAB_DEPTH - 2
      const fs = (cameraZ - shadowZ) / cameraZ
      shadow.position.set(x * fs, (y - pose.h * spec.drop) * fs, shadowZ)
      shadow.scale.setScalar(fs)
      shadow.rotation.set(0, 0, -deg(roll))

      p.materials.face.opacity = prog
      p.materials.edge.opacity = prog
      p.materials.shadow.opacity = prog * spec.opacity
    }

    if (!firstFrame.current) {
      firstFrame.current = true
      requestAnimationFrame(onFirstFrame)
    }
    if (moving && activeRef.current) invalidate()
  })

  return (
    <>
      {built.panels.map((p) => {
        const order = PANEL_ORDER.indexOf(p.pose.kind) * 3
        return (
          <group key={p.pose.kind}>
            <mesh
              ref={(el) => {
                if (el) shadows.current.set(p.pose.kind, el)
                else shadows.current.delete(p.pose.kind)
              }}
              geometry={p.shadow}
              material={p.materials.shadow}
              renderOrder={order}
            />
            <group
              ref={(el) => {
                if (el) groups.current.set(p.pose.kind, el)
                else groups.current.delete(p.pose.kind)
              }}
            >
              <mesh geometry={p.slab} material={p.materials.edge} renderOrder={order + 1} />
              <mesh geometry={p.face} material={p.materials.face} renderOrder={order + 2} />
            </group>
          </group>
        )
      })}
    </>
  )
}

interface HeroWorkspaceSceneProps {
  layout: WorkspaceLayout
  canvases: MutableRefObject<Partial<Record<PanelKind, HTMLCanvasElement>>>
  paintVersion: number
  interactionRef: RefObject<HTMLElement>
  entranceStart: number
  active: boolean
  onReady: () => void
  onFail: () => void
}

export default function HeroWorkspaceScene({
  layout,
  canvases,
  paintVersion,
  interactionRef,
  entranceStart,
  active,
  onReady,
  onFail,
}: HeroWorkspaceSceneProps) {
  const callbacks = useRef({ onReady, onFail })
  callbacks.current = { onReady, onFail }
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const handleContextLost = useCallback((event: Event) => {
    event.preventDefault()
    callbacks.current.onFail()
  }, [])

  useEffect(
    () => () => canvasRef.current?.removeEventListener('webglcontextlost', handleContextLost),
    [handleContextLost],
  )

  return (
    <Canvas
      flat
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ fov: FOV, position: [0, 0, 1000] }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      onCreated={({ gl }) => {
        canvasRef.current = gl.domElement
        gl.domElement.addEventListener('webglcontextlost', handleContextLost)
      }}
    >
      <Panels
        layout={layout}
        canvases={canvases}
        paintVersion={paintVersion}
        interactionRef={interactionRef}
        entranceStart={entranceStart}
        active={active}
        onFirstFrame={() => callbacks.current.onReady()}
      />
    </Canvas>
  )
}
