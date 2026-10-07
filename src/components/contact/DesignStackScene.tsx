import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { BLEED, PERSPECTIVE, PIECES, STAGE_RATIO, faceDataUrl } from '@/lib/designStack'
import type { StackPiece } from '@/lib/designStack'

/**
 * Three.js version of the contact section's design-element composition.
 *
 *  - Scene units are stage widths. The camera sits PERSPECTIVE stage widths
 *    away with a field of view that frames the stage plus its bleed, which
 *    matches the CSS `perspective` of the static version.
 *  - Each piece is a shallow rounded slab (matte Lambert sides) with an
 *    unlit face carrying its SVG artwork as a texture, so the face colours
 *    match the static version exactly, plus a soft tinted shadow plane.
 *  - A short staggered entrance plays the first time the stage is visible,
 *    unless the static version was already on screen. The pointer tilts the
 *    whole group up to MAX_TILT degrees, and the pieces drift by different
 *    amounts for depth.
 *  - Rendering is on demand: it stops once everything settles, and while
 *    the stage is offscreen or the tab is hidden.
 */

const MAX_TILT = 3 // degrees
const ENTRANCE = 0.75 // seconds per piece
const STAGGER = 0.12 // seconds between pieces
const RISE = 0.06 // entrance travel, in stage widths
const SINK = 0.03 // entrance depth travel, in stage widths
const SETTLED = 0.0005
const FACE_OFFSET = 0.0008 // keeps the face clear of the slab's front cap
const SHADOW_RESOLUTION = 320 // shadow texture pixels per stage width
const MAX_TEXTURE = 2048

// Ambient + direct light along the face normal sum to PI (Lambert), so a
// forward-facing slab surface shows exactly its base colour.
const LIGHT_DIRECTION = new THREE.Vector3(-0.4, 0.6, 1).normalize()
const AMBIENT = 2.0
const DIRECT = (Math.PI - AMBIENT) / LIGHT_DIRECTION.z

const FOV = THREE.MathUtils.radToDeg(2 * Math.atan((STAGE_RATIO + 2 * BLEED) / 2 / PERSPECTIVE))

const deg = THREE.MathUtils.degToRad
const unit = (percent: number) => percent / 100
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

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

// A slab whose front face rests at z = 0 and back face at z = -depth, with
// rounded front and back edges.
function createSlab(piece: StackPiece) {
  const w = unit(piece.w)
  const h = unit(piece.h)
  const depth = unit(piece.depth)
  const r = unit(piece.radius)
  const bevel = depth * 0.4
  const shape = roundedRect(w - 2 * bevel, h - 2 * bevel, Math.max(r - bevel, 0.001))
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

// The flat face, with UVs spanning the piece so the artwork fills it.
function createFace(piece: StackPiece) {
  const w = unit(piece.w)
  const h = unit(piece.h)
  const geometry = new THREE.ShapeGeometry(roundedRect(w, h, unit(piece.radius)), 12)
  const position = geometry.attributes.position
  const uv = geometry.attributes.uv
  for (let i = 0; i < position.count; i++) {
    uv.setXY(i, (position.getX(i) + w / 2) / w, (position.getY(i) + h / 2) / h)
  }
  uv.needsUpdate = true
  geometry.translate(0, 0, FACE_OFFSET)
  return geometry
}

// A blurred rounded rectangle matching the static version's box-shadow
// (canvas shadowBlur and CSS blur radius share the same Gaussian).
function createShadow(piece: StackPiece) {
  const { y, blur, spread, color } = piece.shadow
  const pad = unit(blur * 1.5 + Math.abs(spread) + Math.abs(y))
  const planeW = unit(piece.w) + pad * 2
  const planeH = unit(piece.h) + pad * 2
  const scale = SHADOW_RESOLUTION
  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(planeW * scale)
  canvas.height = Math.ceil(planeH * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2D canvas unavailable')
  // Draw the shape far off-canvas so only its shadow lands on the texture.
  const away = canvas.width + 1000
  ctx.shadowColor = color
  ctx.shadowBlur = unit(blur) * scale
  ctx.shadowOffsetX = away
  ctx.shadowOffsetY = unit(y) * scale
  const s = unit(spread)
  const rw = (unit(piece.w) + 2 * s) * scale
  const rh = (unit(piece.h) + 2 * s) * scale
  const rr = Math.max(0, unit(piece.radius) + s) * scale
  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.roundRect((canvas.width - rw) / 2 - away, (canvas.height - rh) / 2, rw, rh, rr)
  ctx.fill()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const geometry = new THREE.PlaneGeometry(planeW, planeH)
  geometry.translate(0, 0, -unit(piece.depth) - FACE_OFFSET)
  return { geometry, texture }
}

async function rasterizeFace(piece: StackPiece, pixelsPerStage: number, anisotropy: number) {
  const width = Math.min(MAX_TEXTURE, Math.round(unit(piece.w) * pixelsPerStage))
  const height = Math.min(MAX_TEXTURE, Math.round(unit(piece.h) * pixelsPerStage))
  const image = new Image()
  image.src = faceDataUrl(piece, width, height)
  await image.decode()
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2D canvas unavailable')
  ctx.drawImage(image, 0, 0, width, height)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = anisotropy
  return texture
}

interface BuiltPiece {
  piece: StackPiece
  slab: THREE.ExtrudeGeometry
  face: THREE.ShapeGeometry
  shadow: { geometry: THREE.PlaneGeometry; texture: THREE.CanvasTexture }
  slabMaterial: THREE.MeshLambertMaterial
  faceMaterial: THREE.MeshBasicMaterial
  shadowMaterial: THREE.MeshBasicMaterial
}

function buildPieces(): BuiltPiece[] {
  return PIECES.map((piece) => {
    const shadow = createShadow(piece)
    return {
      piece,
      slab: createSlab(piece),
      face: createFace(piece),
      shadow,
      slabMaterial: new THREE.MeshLambertMaterial({ color: piece.edge, transparent: true }),
      faceMaterial: new THREE.MeshBasicMaterial({ transparent: true }),
      shadowMaterial: new THREE.MeshBasicMaterial({ map: shadow.texture, transparent: true, depthWrite: false }),
    }
  })
}

type Phase = 'pending' | 'waiting' | 'entering' | 'rest'

interface StackProps {
  stageRef: RefObject<HTMLDivElement>
  inView: boolean
  active: boolean
  onFirstFrame: () => void
  onFail: () => void
}

function Stack({ stageRef, inView, active, onFirstFrame, onFail }: StackProps) {
  const { gl, invalidate } = useThree()
  const activeRef = useRef(active)
  activeRef.current = active
  const inViewRef = useRef(inView)
  inViewRef.current = inView

  const built = useMemo(buildPieces, [])
  const [facesReady, setFacesReady] = useState(false)

  useEffect(
    () => () => {
      built.forEach((b) => {
        b.slab.dispose()
        b.face.dispose()
        b.shadow.geometry.dispose()
        b.shadow.texture.dispose()
        b.slabMaterial.dispose()
        b.faceMaterial.map?.dispose()
        b.faceMaterial.dispose()
        b.shadowMaterial.dispose()
      })
    },
    [built],
  )

  // Rasterize the face artwork at the stage's on-screen size, at the
  // canvas's capped pixel ratio, twice over so it stays sharp when tilted.
  useEffect(() => {
    let cancelled = false
    const stageWidth = stageRef.current?.offsetWidth ?? 480
    const pixelsPerStage = stageWidth * gl.getPixelRatio() * 2
    const anisotropy = gl.capabilities.getMaxAnisotropy()
    Promise.all(built.map((b) => rasterizeFace(b.piece, pixelsPerStage, anisotropy)))
      .then((textures) => {
        if (cancelled) {
          textures.forEach((t) => t.dispose())
          return
        }
        textures.forEach((texture, i) => {
          built[i].faceMaterial.map = texture
          built[i].faceMaterial.needsUpdate = true
        })
        setFacesReady(true)
        invalidate()
      })
      .catch(() => {
        if (!cancelled) onFail()
      })
    return () => {
      cancelled = true
    }
  }, [built, gl, invalidate, stageRef, onFail])

  // The pieces mount once the faces are ready; draw that first frame.
  useEffect(() => {
    if (facesReady) invalidate()
  }, [facesReady, invalidate])

  const root = useRef<THREE.Group>(null)
  const groups = useRef<(THREE.Group | null)[]>([])
  const target = useRef({ x: 0, y: 0 })
  const tilt = useRef({ x: 0, y: 0 })
  const phase = useRef<Phase>('pending')
  const elapsed = useRef(0)
  const lastTime = useRef(performance.now())

  // Wake on pointer movement over the stage. document.hidden is read
  // directly so no frame slips through before React sees a visibility change.
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const wake = () => {
      if (activeRef.current && !document.hidden) invalidate()
    }
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const r = stage.getBoundingClientRect()
      target.current.x = clamp01((event.clientX - r.left) / r.width) * 2 - 1
      target.current.y = clamp01((event.clientY - r.top) / r.height) * 2 - 1
      wake()
    }
    const onLeave = () => {
      target.current = { x: 0, y: 0 }
      wake()
    }
    stage.addEventListener('pointermove', onMove, { passive: true })
    stage.addEventListener('pointerleave', onLeave)
    return () => {
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', onLeave)
    }
  }, [stageRef, invalidate])

  useEffect(() => {
    lastTime.current = performance.now()
    if (active) invalidate()
  }, [active, invalidate])

  useFrame(() => {
    const now = performance.now()
    const dt = Math.min(0.1, (now - lastTime.current) / 1000)
    lastTime.current = now
    if (!facesReady || !root.current) return

    // First frame: if the static version is already on screen, take over at
    // rest; otherwise hold the pieces back for the entrance.
    if (phase.current === 'pending') {
      phase.current = inViewRef.current ? 'rest' : 'waiting'
      requestAnimationFrame(onFirstFrame)
    }
    if (phase.current === 'waiting' && activeRef.current) {
      phase.current = 'entering'
      elapsed.current = 0
    }
    let moving = false
    if (phase.current === 'entering') {
      elapsed.current += dt
      if (elapsed.current >= ENTRANCE + STAGGER * (built.length - 1)) phase.current = 'rest'
      else moving = true
    }

    const s = tilt.current
    const t = target.current
    const ease = (key: 'x' | 'y') => {
      s[key] += (t[key] - s[key]) * (1 - Math.exp(-dt * 6))
      if (Math.abs(t[key] - s[key]) > SETTLED) moving = true
      else s[key] = t[key]
    }
    ease('x')
    ease('y')

    // Lean toward the pointer: the side under the cursor dips away.
    root.current.rotation.set(deg(s.y * MAX_TILT), deg(s.x * MAX_TILT), 0)

    built.forEach((b, i) => {
      const group = groups.current[i]
      if (!group) return
      const p =
        phase.current === 'waiting'
          ? 0
          : phase.current === 'rest'
            ? 1
            : easeOutCubic(clamp01((elapsed.current - i * STAGGER) / ENTRANCE))
      const { piece } = b
      const drift = unit(piece.drift)
      group.position.set(
        unit(piece.cx) - 0.5 + s.x * drift,
        -(unit(piece.cy) - STAGE_RATIO / 2) - s.y * drift - (1 - p) * RISE,
        unit(piece.z) - (1 - p) * SINK,
      )
      group.visible = p > 0
      b.slabMaterial.opacity = p
      b.faceMaterial.opacity = p
      b.shadowMaterial.opacity = p
    })

    if (moving && activeRef.current && !document.hidden) invalidate()
  })

  if (!facesReady) return null

  return (
    <>
      <ambientLight intensity={AMBIENT} />
      <directionalLight position={LIGHT_DIRECTION.toArray()} intensity={DIRECT} />
      <group ref={root}>
        {built.map((b, i) => (
          <group
            key={b.piece.id}
            ref={(el) => {
              groups.current[i] = el
            }}
            rotation={new THREE.Euler(-deg(b.piece.rotate.x), deg(b.piece.rotate.y), -deg(b.piece.rotate.z), 'ZYX')}
          >
            <mesh geometry={b.shadow.geometry} material={b.shadowMaterial} renderOrder={i * 3} />
            <mesh geometry={b.slab} material={b.slabMaterial} renderOrder={i * 3 + 1} />
            <mesh geometry={b.face} material={b.faceMaterial} renderOrder={i * 3 + 2} />
          </group>
        ))}
      </group>
    </>
  )
}

interface DesignStackSceneProps {
  stageRef: RefObject<HTMLDivElement>
  inView: boolean
  active: boolean
  onReady: () => void
  onFail: () => void
}

export default function DesignStackScene({ stageRef, inView, active, onReady, onFail }: DesignStackSceneProps) {
  const callbacks = useRef({ onReady, onFail })
  callbacks.current = { onReady, onFail }
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const handleContextLost = useCallback((event: Event) => {
    event.preventDefault()
    callbacks.current.onFail()
  }, [])
  const handleFirstFrame = useCallback(() => callbacks.current.onReady(), [])
  const handleFail = useCallback(() => callbacks.current.onFail(), [])

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
      camera={{ fov: FOV, position: [0, 0, PERSPECTIVE], near: 0.1, far: PERSPECTIVE * 3 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      onCreated={({ gl }) => {
        canvasRef.current = gl.domElement
        gl.domElement.addEventListener('webglcontextlost', handleContextLost)
      }}
    >
      <Stack stageRef={stageRef} inView={inView} active={active} onFirstFrame={handleFirstFrame} onFail={handleFail} />
    </Canvas>
  )
}
