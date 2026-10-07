import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { ARROW_DEPTH, ARROW_POINTS, ARROW_ROUNDING, DISC_ARROW, DISC_FACE, DISC_THICKNESS } from '@/lib/arrowDisc'

/**
 * Three.js arrow disc for the contact section: a shallow, matte lavender
 * disc with a rounded rim and a raised dark arrow.
 *
 *  - Hover tilts the disc toward the pointer (up to ~4 degrees) and lifts the
 *    arrow; pressing compresses the disc and arrow; leaving eases back.
 *  - Matte Lambert shading. The two lights are balanced so a forward-facing
 *    surface shows exactly its base colour, matching the static SVG; only
 *    the rim and arrow sides pick up shading.
 *  - Rendering is on demand and stops once everything settles, and while
 *    the disc is offscreen or the tab is hidden.
 */

const FOV = 20
const MAX_TILT = 4 // degrees
const LIFT = 0.035 // arrow lift on hover, in disc radii
const PRESS_DEPTH = 0.22 // fraction of thickness the disc compresses
const SETTLED = 0.0005

// Ambient + direct light along the face normal must sum to PI (Lambert).
const LIGHT_DIRECTION = new THREE.Vector3(-0.4, 0.6, 1).normalize()
const AMBIENT = 2.0
const DIRECT = (Math.PI - AMBIENT) / LIGHT_DIRECTION.z

const deg = THREE.MathUtils.degToRad

// A disc profile with a fully rounded rim, spun around the y axis and then
// turned to face the camera. The back face sits at z = 0, so scaling z
// presses the front face inward.
function createDiscGeometry(radius: number) {
  const half = (DISC_THICKNESS * radius) / 2
  const inner = radius - half
  const points: THREE.Vector2[] = [new THREE.Vector2(0, half)]
  const steps = 12
  for (let i = 0; i <= steps; i++) {
    const a = Math.PI / 2 - (i / steps) * Math.PI
    points.push(new THREE.Vector2(inner + Math.cos(a) * half, Math.sin(a) * half))
  }
  points.push(new THREE.Vector2(0, -half))
  const geometry = new THREE.LatheGeometry(points, 96)
  geometry.rotateX(Math.PI / 2)
  geometry.translate(0, 0, half)
  return geometry
}

function createArrowGeometry(radius: number) {
  const shape = new THREE.Shape()
  ARROW_POINTS.forEach(([x, y], i) => {
    if (i === 0) shape.moveTo(x * radius, y * radius)
    else shape.lineTo(x * radius, y * radius)
  })
  shape.closePath()
  const bevel = ARROW_ROUNDING * radius
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: ARROW_DEPTH * radius,
    bevelEnabled: true,
    bevelSize: bevel,
    bevelThickness: bevel,
    bevelSegments: 4,
    curveSegments: 4,
  })
  return geometry
}

interface DiscProps {
  linkRef: RefObject<HTMLAnchorElement>
  discSize: number
  active: boolean
  onFirstFrame: () => void
}

function Disc({ linkRef, discSize, active, onFirstFrame }: DiscProps) {
  const { camera, size, invalidate } = useThree()
  const radius = discSize / 2
  const activeRef = useRef(active)
  activeRef.current = active

  // Camera distance at which the z = 0 plane maps 1:1 to CSS pixels.
  const cameraZ = size.height / 2 / Math.tan(deg(FOV / 2))
  useEffect(() => {
    camera.position.set(0, 0, cameraZ)
    camera.near = cameraZ / 10
    camera.far = cameraZ * 3
    camera.updateProjectionMatrix()
    invalidate()
  }, [camera, cameraZ, invalidate])

  const built = useMemo(() => {
    const disc = createDiscGeometry(radius)
    const arrow = createArrowGeometry(radius)
    const discMaterial = new THREE.MeshLambertMaterial({ color: DISC_FACE })
    const arrowMaterial = new THREE.MeshLambertMaterial({ color: DISC_ARROW })
    return { disc, arrow, discMaterial, arrowMaterial }
  }, [radius])

  useEffect(
    () => () => {
      built.disc.dispose()
      built.arrow.dispose()
      built.discMaterial.dispose()
      built.arrowMaterial.dispose()
    },
    [built],
  )

  const tiltGroup = useRef<THREE.Group>(null)
  const discMesh = useRef<THREE.Mesh>(null)
  const arrowMesh = useRef<THREE.Mesh>(null)

  const target = useRef({ x: 0, y: 0, hover: 0, press: 0 })
  const state = useRef({ x: 0, y: 0, hover: 0, press: 0 })
  const lastTime = useRef(performance.now())

  useEffect(() => {
    const link = linkRef.current
    if (!link) return
    // document.hidden is read directly so no frame slips through before
    // React has processed a visibility change.
    const wake = () => {
      lastTime.current = performance.now()
      if (activeRef.current && !document.hidden) invalidate()
    }
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const r = link.getBoundingClientRect()
      target.current.x = Math.max(-1, Math.min(1, ((event.clientX - r.left) / r.width) * 2 - 1))
      target.current.y = Math.max(-1, Math.min(1, ((event.clientY - r.top) / r.height) * 2 - 1))
      target.current.hover = 1
      wake()
    }
    const onLeave = () => {
      target.current = { x: 0, y: 0, hover: 0, press: 0 }
      wake()
    }
    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      target.current.press = 1
      wake()
    }
    const onUp = () => {
      target.current.press = 0
      wake()
    }
    link.addEventListener('pointermove', onMove, { passive: true })
    link.addEventListener('pointerleave', onLeave)
    link.addEventListener('pointerdown', onDown)
    link.addEventListener('pointerup', onUp)
    link.addEventListener('pointercancel', onUp)
    return () => {
      link.removeEventListener('pointermove', onMove)
      link.removeEventListener('pointerleave', onLeave)
      link.removeEventListener('pointerdown', onDown)
      link.removeEventListener('pointerup', onUp)
      link.removeEventListener('pointercancel', onUp)
    }
  }, [linkRef, invalidate])

  useEffect(() => {
    lastTime.current = performance.now()
    if (active) invalidate()
  }, [active, invalidate])

  const firstFrame = useRef(false)
  const thickness = DISC_THICKNESS * radius

  useFrame(() => {
    const now = performance.now()
    const dt = Math.min(0.1, (now - lastTime.current) / 1000)
    lastTime.current = now
    const s = state.current
    const t = target.current
    let moving = false

    // Tilt and lift ease gently; the press responds faster.
    const ease = (key: 'x' | 'y' | 'hover' | 'press', rate: number) => {
      s[key] += (t[key] - s[key]) * (1 - Math.exp(-dt * rate))
      if (Math.abs(t[key] - s[key]) > SETTLED) moving = true
      else s[key] = t[key]
    }
    ease('x', 7)
    ease('y', 7)
    ease('hover', 9)
    ease('press', 22)

    if (tiltGroup.current && discMesh.current && arrowMesh.current) {
      // Lean toward the pointer: the side under the cursor dips away.
      tiltGroup.current.rotation.set(deg(s.y * MAX_TILT), deg(s.x * MAX_TILT), 0)
      const squash = 1 - PRESS_DEPTH * s.press
      discMesh.current.scale.set(1, 1, squash)
      arrowMesh.current.position.z = thickness * (squash - 1) + radius * (LIFT * s.hover - 0.02 * s.press)
    }

    if (!firstFrame.current) {
      firstFrame.current = true
      requestAnimationFrame(onFirstFrame)
    }
    if (moving && activeRef.current && !document.hidden) invalidate()
  })

  return (
    <>
      <ambientLight intensity={AMBIENT} />
      <directionalLight position={LIGHT_DIRECTION.toArray()} intensity={DIRECT} />
      <group ref={tiltGroup}>
        {/* Positioned so the front face rests exactly at z = 0 */}
        <mesh ref={discMesh} geometry={built.disc} material={built.discMaterial} position={[0, 0, -thickness]} />
        <mesh ref={arrowMesh} geometry={built.arrow} material={built.arrowMaterial} />
      </group>
    </>
  )
}

interface ArrowDiscSceneProps {
  linkRef: RefObject<HTMLAnchorElement>
  discSize: number
  bleed: number
  active: boolean
  onReady: () => void
  onFail: () => void
}

export default function ArrowDiscScene({ linkRef, discSize, active, onReady, onFail }: ArrowDiscSceneProps) {
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
      <Disc linkRef={linkRef} discSize={discSize} active={active} onFirstFrame={() => callbacks.current.onReady()} />
    </Canvas>
  )
}
