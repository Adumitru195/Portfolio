import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { folderPaper } from '@/lib/folderPaper'
import { folderSheetColors, type FolderTint } from '@/data/work-folders'

/**
 * Decorative paper layer for the homepage folders: one shared canvas over the
 * whole grid, drawing the two loose sheets tucked behind each preview. The
 * camera is orthographic in CSS pixels, so each sheet sits exactly where its
 * card's preview is. Frames are rendered on demand, only while a sheet is
 * still moving toward its target; the scene is otherwise idle.
 */

interface SceneCard {
  id: string
  tint: FolderTint
}

// Rest and hover poses, matching the CSS fallback in index.css. Offsets are
// CSS px (x right, y down); angles are CSS degrees (clockwise positive).
const BACK = { rest: [-5, -10, -1.6], hover: [-9, -18, -3] }
const FRONT = { rest: [6, -6, 1.3], hover: [10, -12, 2.4] }
const LIFT = 10
const TILT_Y = THREE.MathUtils.degToRad(4)
const TILT_X = THREE.MathUtils.degToRad(3)
const RADIUS = 12
const SHADOW_PAD = 26
const DAMPING = 12

function roundedRect(width: number, height: number, radius: number) {
  const x = -width / 2
  const y = -height / 2
  const shape = new THREE.Shape()
  shape.moveTo(x + radius, y)
  shape.lineTo(x + width - radius, y)
  shape.quadraticCurveTo(x + width, y, x + width, y + radius)
  shape.lineTo(x + width, y + height - radius)
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  shape.lineTo(x + radius, y + height)
  shape.quadraticCurveTo(x, y + height, x, y + height - radius)
  shape.lineTo(x, y + radius)
  shape.quadraticCurveTo(x, y, x + radius, y)
  return new THREE.ShapeGeometry(shape, 6)
}

// A soft, blurred rounded rectangle used as the alpha of every sheet shadow.
function createShadowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const context = canvas.getContext('2d')
  if (context) {
    context.fillStyle = '#000'
    context.fillRect(0, 0, 128, 128)
    // Draw the rectangle off-canvas and keep only its blurred shadow, which
    // every browser supports (canvas filters are not universal).
    context.shadowColor = '#fff'
    context.shadowBlur = 18
    context.shadowOffsetX = 1000
    context.fillStyle = '#fff'
    context.fillRect(24 - 1000, 24, 80, 80)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.NoColorSpace
  return texture
}

const mix = (a: number, b: number, t: number) => a + (b - a) * t

interface SheetMeshes {
  edge: THREE.Mesh | null
  sheet: THREE.Mesh | null
  shadow: THREE.Mesh | null
}

function placeSheet(
  meshes: SheetMeshes,
  pose: { rest: number[]; hover: number[] },
  centerX: number,
  centerY: number,
  depth: number,
  lift: number,
  tiltX: number,
  tiltY: number,
) {
  const x = centerX + mix(pose.rest[0], pose.hover[0], lift)
  const y = centerY - mix(pose.rest[1], pose.hover[1], lift) + LIFT * lift
  const angle = -THREE.MathUtils.degToRad(mix(pose.rest[2], pose.hover[2], lift))
  for (const mesh of [meshes.edge, meshes.sheet]) {
    if (!mesh) continue
    mesh.position.set(x, y, mesh === meshes.edge ? depth - 0.1 : depth)
    mesh.rotation.set(tiltX, tiltY, angle)
    mesh.visible = true
  }
  if (meshes.shadow) {
    meshes.shadow.position.set(x, y - 3 - 4 * lift, depth - 0.3)
    meshes.shadow.rotation.set(0, 0, angle)
    meshes.shadow.visible = true
    const material = meshes.shadow.material as THREE.MeshBasicMaterial
    material.opacity = 0.16 + 0.14 * lift
  }
}

function FolderSheets({ id, tint, shadowTexture }: SceneCard & { shadowTexture: THREE.Texture }) {
  const { size, invalidate } = useThree()
  const colors = folderSheetColors[tint]
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null)
  const pose = useRef({ lift: 0, px: 0, py: 0 })
  const back = useRef<SheetMeshes>({ edge: null, sheet: null, shadow: null })
  const front = useRef<SheetMeshes>({ edge: null, sheet: null, shadow: null })

  // Rebuild geometry only when the preview's size changes.
  useEffect(() => {
    const sync = () => {
      const slot = folderPaper.get(id).slot
      if (!slot) return
      setDims((current) => (current && current.w === slot.w && current.h === slot.h ? current : { w: slot.w, h: slot.h }))
    }
    sync()
    return folderPaper.subscribe(sync)
  }, [id])

  const geometry = useMemo(() => {
    if (!dims) return null
    return {
      sheet: roundedRect(dims.w, dims.h, RADIUS),
      edge: roundedRect(dims.w + 2, dims.h + 2, RADIUS + 1),
      shadow: new THREE.PlaneGeometry(dims.w + SHADOW_PAD * 2, dims.h + SHADOW_PAD * 2),
    }
  }, [dims])
  useEffect(
    () => () => {
      geometry?.sheet.dispose()
      geometry?.edge.dispose()
      geometry?.shadow.dispose()
    },
    [geometry],
  )

  useFrame((_, delta) => {
    const entry = folderPaper.get(id)
    const slot = entry.slot
    if (!slot || !geometry) return
    const current = pose.current
    const step = 1 - Math.exp(-Math.min(delta, 0.05) * DAMPING)
    const target = entry.hover ? 1 : 0
    current.lift += (target - current.lift) * step
    current.px += (entry.px - current.px) * step
    current.py += (entry.py - current.py) * step

    const centerX = slot.x + slot.w / 2 - size.width / 2
    const centerY = size.height / 2 - (slot.y + slot.h / 2)
    const tiltX = current.py * TILT_X
    const tiltY = current.px * TILT_Y
    placeSheet(back.current, BACK, centerX, centerY, -2, current.lift, tiltX, tiltY)
    placeSheet(front.current, FRONT, centerX, centerY, -1, current.lift, tiltX, tiltY)

    const moving =
      Math.abs(target - current.lift) > 0.002 ||
      Math.abs(entry.px - current.px) > 0.002 ||
      Math.abs(entry.py - current.py) > 0.002
    if (moving) invalidate()
  })

  if (!geometry) return null
  const layer = (refs: SheetMeshes, color: string) => (
    <>
      <mesh ref={(mesh) => { refs.shadow = mesh }} geometry={geometry.shadow} visible={false}>
        <meshBasicMaterial color={colors.shadow} alphaMap={shadowTexture} transparent depthWrite={false} opacity={0.16} />
      </mesh>
      <mesh ref={(mesh) => { refs.edge = mesh }} geometry={geometry.edge} visible={false}>
        <meshStandardMaterial color={colors.edge} roughness={1} metalness={0} />
      </mesh>
      <mesh ref={(mesh) => { refs.sheet = mesh }} geometry={geometry.sheet} visible={false}>
        <meshStandardMaterial color={color} roughness={1} metalness={0} />
      </mesh>
    </>
  )
  return (
    <>
      {layer(back.current, colors.back)}
      {layer(front.current, colors.front)}
    </>
  )
}

// Requests a frame whenever card state changes, while the grid is on screen.
function Driver({ running }: { running: boolean }) {
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => {
    if (!running) return
    invalidate()
    return folderPaper.subscribe(() => invalidate())
  }, [running, invalidate])
  return null
}

// Reports readiness once every card's sheets have been placed and drawn, so
// the CSS sheets are only hidden when the 3D ones are already visible.
function ReadySignal({ cards, onReady }: { cards: SceneCard[]; onReady: () => void }) {
  const invalidate = useThree((state) => state.invalidate)
  const frames = useRef(0)
  const done = useRef(false)
  useFrame(() => {
    if (done.current) return
    const placed = cards.every((card) => folderPaper.get(card.id).slot)
    frames.current = placed ? frames.current + 1 : 0
    if (frames.current >= 3) {
      done.current = true
      onReady()
    } else invalidate()
  })
  return null
}

interface FolderPaperSceneProps {
  cards: SceneCard[]
  running: boolean
  onReady: () => void
  onFail: () => void
}

export default function FolderPaperScene({ cards, running, onReady, onFail }: FolderPaperSceneProps) {
  const shadowTexture = useMemo(createShadowTexture, [])
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const callbacks = useRef({ onReady, onFail })
  callbacks.current = { onReady, onFail }

  const handleContextLost = useCallback((event: Event) => {
    event.preventDefault()
    callbacks.current.onFail()
  }, [])

  useEffect(
    () => () => {
      shadowTexture.dispose()
      canvasRef.current?.removeEventListener('webglcontextlost', handleContextLost)
    },
    [shadowTexture, handleContextLost],
  )

  return (
    <Canvas
      orthographic
      flat
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 100], near: 1, far: 200, zoom: 1 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      // R3F sets pointer events on its own wrapper; the paper must never catch clicks.
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      onCreated={({ gl }) => {
        canvasRef.current = gl.domElement
        gl.domElement.addEventListener('webglcontextlost', handleContextLost)
      }}
    >
      <ambientLight intensity={2.5} />
      <directionalLight position={[-0.35, 0.5, 1]} intensity={0.75} />
      {cards.map((card) => (
        <FolderSheets key={card.id} id={card.id} tint={card.tint} shadowTexture={shadowTexture} />
      ))}
      <Driver running={running} />
      <ReadySignal cards={cards} onReady={() => callbacks.current.onReady()} />
    </Canvas>
  )
}
