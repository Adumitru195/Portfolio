import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { cubicBezier } from 'framer-motion'
import * as THREE from 'three'
import type { Photo } from '@/data/about'
import { PHOTO_EASE, PHOTO_RADIUS, SCENE_BLEED, photoMotion } from '@/lib/aboutPhotoMotion'
import type { PanelMotion, PanelRect, StageLayout } from '@/lib/aboutPhotoMotion'

/**
 * Three.js version of the About page's opening photos: two shallow panels
 * textured with the real photographs.
 *
 *  - The entrance replays the HTML composition's curve from the same start
 *    time, so the canvas can take over mid-entrance without a jump.
 *  - Pointer movement over the stage tilts each panel a few degrees; the
 *    smaller panel moves more and shifts the other way to read as nearer.
 *  - Photos use unlit materials and linear filtering at roughly 1:1 texel
 *    size, so colours stay natural and edges stay sharp.
 *  - Rendering is on demand and stops as soon as everything settles, or
 *    while the stage is offscreen or the tab is hidden.
 */

const FOV = 20
const PANEL_DEPTH = 10 // px
const SUPPORT_FRAME = 4 // px border around the supporting photo
const FRAME_COLOR = '#F7F7F5' // page background, as in the HTML border
const EDGE_COLOR = '#ECEAF4'
const SHADOW_TINT = '#2E2B6E'
const SHADOW_OPACITY = { main: 0.5, support: 0.55 }
const SMOOTHING = 7 // higher settles faster
const SUPPORT_Z = 80 // px in front of the main panel
const SETTLED = 0.0005

const ease = cubicBezier(...PHOTO_EASE)
const deg = THREE.MathUtils.degToRad

type PanelKind = 'main' | 'support'

function roundedRect(w: number, h: number, r: number) {
  const x = -w / 2
  const y = -h / 2
  const shape = new THREE.Shape()
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

// UVs that stretch the whole texture across the shape's bounding box.
function fitUVs(geometry: THREE.BufferGeometry, w: number, h: number) {
  const pos = geometry.attributes.position
  const uv = new Float32Array(pos.count * 2)
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = pos.getX(i) / w + 0.5
    uv[i * 2 + 1] = pos.getY(i) / h + 0.5
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
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
    ctx.shadowBlur = 22
    ctx.shadowOffsetX = size * 4
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.roundRect(size * 0.2 - size * 4, size * 0.2, size * 0.6, size * 0.6, size * 0.08)
    ctx.fill()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// The smallest source that covers the panel at the capped pixel ratio.
function pickSource(photo: Photo, cssWidth: number) {
  const needed = cssWidth * Math.min(window.devicePixelRatio || 1, 1.5)
  return photo.sources.find((s) => s.width >= needed) ?? photo.sources[photo.sources.length - 1]
}

function loadTexture(url: string, loader: THREE.TextureLoader) {
  return new Promise<THREE.Texture>((resolve, reject) => {
    loader.load(
      url,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        // Close to 1:1 texels, so plain linear filtering stays sharpest.
        texture.generateMipmaps = false
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        resolve(texture)
      },
      undefined,
      () => reject(new Error(`Texture failed: ${url}`)),
    )
  })
}

interface PanelState {
  tiltX: number
  tiltY: number
  shift: number
}

interface PanelsProps {
  layout: StageLayout
  textures: Record<PanelKind, THREE.Texture>
  stageRef: RefObject<HTMLDivElement>
  entranceStart: number
  active: boolean
  onFirstFrame: () => void
}

function Panels({ layout, textures, stageRef, entranceStart, active, onFirstFrame }: PanelsProps) {
  const { size, invalidate } = useThree()
  const layoutRef = useRef(layout)
  layoutRef.current = layout
  const activeRef = useRef(active)
  activeRef.current = active

  // World units per CSS pixel at z = 0, and the camera distance for FOV.
  const k = 1
  const cameraZ = size.height / 2 / Math.tan(deg(FOV / 2))
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(0, 0, cameraZ)
    camera.near = cameraZ / 10
    camera.far = cameraZ * 3
    camera.updateProjectionMatrix()
    invalidate()
  }, [camera, cameraZ, invalidate])

  const built = useMemo(() => {
    const shadowTexture = createShadowTexture()
    const make = (kind: PanelKind, rect: PanelRect) => {
      const frame = kind === 'support' ? SUPPORT_FRAME : 0
      const radius = PHOTO_RADIUS[kind]
      const body = new THREE.ExtrudeGeometry(roundedRect(rect.w, rect.h, radius), {
        depth: PANEL_DEPTH,
        bevelEnabled: false,
        curveSegments: 12,
      })
      body.translate(0, 0, -PANEL_DEPTH)
      const photoW = rect.w - frame * 2
      const photoH = rect.h - frame * 2
      const photo = new THREE.ShapeGeometry(roundedRect(photoW, photoH, Math.max(2, radius - frame)), 12)
      fitUVs(photo, photoW, photoH)
      const shadow = new THREE.PlaneGeometry(rect.w * 1.3, rect.h * 1.22)
      const materials = {
        face: new THREE.MeshBasicMaterial({ color: FRAME_COLOR, transparent: true }),
        edge: new THREE.MeshBasicMaterial({ color: EDGE_COLOR, transparent: true }),
        photo: new THREE.MeshBasicMaterial({ map: textures[kind], transparent: true, toneMapped: false }),
        shadow: new THREE.MeshBasicMaterial({
          map: shadowTexture,
          color: SHADOW_TINT,
          transparent: true,
          depthWrite: false,
          toneMapped: false,
        }),
      }
      return { body, photo, shadow, materials }
    }
    return {
      shadowTexture,
      main: make('main', layout.main),
      support: make('support', layout.support),
    }
    // Rebuilt only when a panel's size changes; positions update per frame.
  }, [layout.main.w, layout.main.h, layout.support.w, layout.support.h, textures])

  useEffect(
    () => () => {
      built.shadowTexture.dispose()
      for (const kind of ['main', 'support'] as const) {
        const p = built[kind]
        p.body.dispose()
        p.photo.dispose()
        p.shadow.dispose()
        Object.values(p.materials).forEach((m) => m.dispose())
      }
    },
    [built],
  )

  const groups = useRef<Record<PanelKind, THREE.Group | null>>({ main: null, support: null })
  const shadows = useRef<Record<PanelKind, THREE.Mesh | null>>({ main: null, support: null })

  // Pointer target (-1..1) and the smoothed state of each panel.
  const target = useRef({ x: 0, y: 0 })
  const state = useRef<Record<PanelKind, PanelState>>({
    main: { tiltX: 0, tiltY: 0, shift: 0 },
    support: { tiltX: 0, tiltY: 0, shift: 0 },
  })
  const lastTime = useRef(performance.now())

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const r = stage.getBoundingClientRect()
      target.current.x = Math.max(-1, Math.min(1, ((event.clientX - r.left) / r.width) * 2 - 1))
      target.current.y = Math.max(-1, Math.min(1, ((event.clientY - r.top) / r.height) * 2 - 1))
      if (activeRef.current) invalidate()
    }
    const onLeave = () => {
      target.current.x = 0
      target.current.y = 0
      if (activeRef.current) invalidate()
    }
    stage.addEventListener('pointermove', onMove, { passive: true })
    stage.addEventListener('pointerleave', onLeave)
    return () => {
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', onLeave)
    }
  }, [stageRef, invalidate])

  // Resume when the stage comes back on screen or the tab is shown again.
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

    for (const kind of ['main', 'support'] as const) {
      const group = groups.current[kind]
      const shadow = shadows.current[kind]
      if (!group || !shadow) continue
      const motion: PanelMotion = photoMotion[kind]
      const rect = layoutRef.current[kind]
      const s = state.current[kind]

      // Entrance progress on the shared timeline.
      const t = (now - entranceStart) / 1000 - motion.entrance.delay
      const p = t <= 0 ? 0 : t >= motion.entrance.duration ? 1 : ease(t / motion.entrance.duration)
      if (p < 1) moving = true

      // Ease the pointer response toward its target.
      const goal = {
        tiltX: target.current.y * motion.tilt.x,
        tiltY: target.current.x * motion.tilt.y,
        shift: target.current.x * motion.tilt.shift,
      }
      for (const key of ['tiltX', 'tiltY', 'shift'] as const) {
        s[key] += (goal[key] - s[key]) * blend
        if (Math.abs(goal[key] - s[key]) > SETTLED) moving = true
        else s[key] = goal[key]
      }

      // Rest position in canvas pixels, then into world units (y up).
      const cx = rect.x + rect.w / 2 + SCENE_BLEED + motion.entrance.fromX * (1 - p) + s.shift
      const cy = rect.y + rect.h / 2 + SCENE_BLEED + motion.entrance.fromY * (1 - p)
      const roll = motion.rotate + (motion.entrance.fromRotate - motion.rotate) * (1 - p)
      const x = (cx - width / 2) * k
      const y = (height / 2 - cy) * k
      // Far enough forward that the main panel's tilted edge never reaches it.
      const z = kind === 'support' ? SUPPORT_Z : 0

      // Anything nearer the camera is scaled back toward the centre so it
      // projects at exactly its HTML position and size.
      const f = (cameraZ - z) / cameraZ
      group.position.set(x * f, y * f, z)
      group.scale.setScalar(f)
      group.rotation.set(deg(s.tiltX), deg(s.tiltY), -deg(roll))
      const shadowZ = z - PANEL_DEPTH - 2
      const fs = (cameraZ - shadowZ) / cameraZ
      shadow.position.set(x * fs, (y - rect.h * 0.08) * fs, shadowZ)
      shadow.scale.setScalar(fs)
      shadow.rotation.set(0, 0, -deg(roll))

      const m = built[kind].materials
      m.face.opacity = p
      m.edge.opacity = p
      m.photo.opacity = p
      m.shadow.opacity = p * SHADOW_OPACITY[kind]
    }

    if (!firstFrame.current) {
      firstFrame.current = true
      requestAnimationFrame(onFirstFrame)
    }
    if (moving && activeRef.current) invalidate()
  })

  return (
    <>
      {(['main', 'support'] as const).map((kind) => (
        <group key={kind}>
          <mesh
            ref={(el) => {
              shadows.current[kind] = el
            }}
            geometry={built[kind].shadow}
            material={built[kind].materials.shadow}
            renderOrder={kind === 'main' ? 0 : 3}
          />
          <group
            ref={(el) => {
              groups.current[kind] = el
            }}
          >
            <mesh
              geometry={built[kind].body}
              material={[built[kind].materials.face, built[kind].materials.edge]}
              renderOrder={kind === 'main' ? 1 : 4}
            />
            <mesh
              geometry={built[kind].photo}
              material={built[kind].materials.photo}
              position={[0, 0, 0.5]}
              renderOrder={kind === 'main' ? 2 : 5}
            />
          </group>
        </group>
      ))}
    </>
  )
}

interface AboutPhotoSceneProps {
  stageRef: RefObject<HTMLDivElement>
  layout: StageLayout
  main: Photo
  support: Photo
  entranceStart: number
  active: boolean
  onReady: () => void
  onFail: () => void
}

export default function AboutPhotoScene({
  stageRef,
  layout,
  main,
  support,
  entranceStart,
  active,
  onReady,
  onFail,
}: AboutPhotoSceneProps) {
  const [textures, setTextures] = useState<Record<PanelKind, THREE.Texture> | null>(null)
  const callbacks = useRef({ onReady, onFail })
  callbacks.current = { onReady, onFail }
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Texture resolution is chosen once, from the first measured layout.
  const initial = useRef(layout)
  useEffect(() => {
    let cancelled = false
    let loaded: THREE.Texture[] = []
    const loader = new THREE.TextureLoader()
    Promise.all([
      loadTexture(pickSource(main, initial.current.main.w).src, loader),
      loadTexture(pickSource(support, initial.current.support.w).src, loader),
    ])
      .then(([mainTexture, supportTexture]) => {
        loaded = [mainTexture, supportTexture]
        if (cancelled) {
          loaded.forEach((t) => t.dispose())
          return
        }
        setTextures({ main: mainTexture, support: supportTexture })
      })
      .catch(() => {
        if (!cancelled) callbacks.current.onFail()
      })
    return () => {
      cancelled = true
      loaded.forEach((t) => t.dispose())
    }
  }, [main, support])

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
      {textures && (
        <Panels
          layout={layout}
          textures={textures}
          stageRef={stageRef}
          entranceStart={entranceStart}
          active={active}
          onFirstFrame={() => callbacks.current.onReady()}
        />
      )}
    </Canvas>
  )
}
