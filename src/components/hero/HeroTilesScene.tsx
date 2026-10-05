import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { MutableRefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { heroTileIconUrl } from '@/data/hero-tiles'
import type { HeroTileIconId } from '@/data/hero-tiles'
import { LAYOUT_START_TIME, laneIcons, laneTiles } from '@/lib/heroTilesLayout'
import type { HeroGeometry } from '@/lib/heroTilesLayout'

/**
 * Three.js scene for the homepage hero: softly rounded software tiles that
 * drift right to left in three loose streams beside the headline.
 *
 * Positions come from `laneTiles`, the same layout the static composition
 * uses, so the hand-off from the still frame is seamless.
 *
 * Performance:
 *  - Renders on demand at ~30 fps, and only while `running` is true. When it
 *    is false no animation frames are requested at all.
 *  - One shared tile geometry, small canvas textures, Lambert shading and a
 *    pre-blurred shadow sprite instead of real-time shadow maps.
 *  - Device pixel ratio capped at 1.5.
 *  - All geometries, materials, textures and listeners are released on
 *    unmount; a lost WebGL context reports through `onFail`.
 */

// Same values as the `tile` tokens in tailwind.config.js.
const TILE_FACE = '#FBF9F4'
// Shadows take the indigo of the accent, not pure black.
const SHADOW_TINT = '#2E2B5F'
const SHADOW_OPACITY = 0.2

const CAMERA_Z = 16
const FOV = 30
const FRAME_INTERVAL = 1000 / 30
const ICON_TEXTURE_SIZE = 128
const ICON_FRACTION = 0.52

const TILE_DEPTH = 0.12
const BEVEL = 0.05
const CORNER = 0.24

const ICON_IDS: HeroTileIconId[] = ['figma', 'illustrator', 'photoshop', 'vscode', 'react']

type IconTextures = Record<HeroTileIconId, THREE.Texture>

// A unit tile (1 x 1, centred) with a shallow rounded bevel.
function createTileGeometry() {
  const inner = 1 - BEVEL * 2
  const half = inner / 2
  const r = CORNER - BEVEL
  const shape = new THREE.Shape()
  shape.moveTo(-half + r, -half)
  shape.lineTo(half - r, -half)
  shape.quadraticCurveTo(half, -half, half, -half + r)
  shape.lineTo(half, half - r)
  shape.quadraticCurveTo(half, half, half - r, half)
  shape.lineTo(-half + r, half)
  shape.quadraticCurveTo(-half, half, -half, half - r)
  shape.lineTo(-half, -half + r)
  shape.quadraticCurveTo(-half, -half, -half + r, -half)
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: TILE_DEPTH,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: BEVEL,
    bevelSegments: 4,
    curveSegments: 10,
  })
  geometry.center()
  return geometry
}

// A soft rounded-square blur, drawn once and reused as every tile's shadow.
function createShadowTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    // Draw the shape off-canvas and keep only its blurred shadow.
    ctx.shadowColor = '#ffffff'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = size * 4
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.roundRect(size * 0.2 - size * 4, size * 0.2, size * 0.6, size * 0.6, size * 0.14)
    ctx.fill()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// SVGs are fetched and given explicit dimensions so every browser can
// rasterise them, then drawn once into a small canvas texture.
async function loadIconTexture(id: HeroTileIconId, signal: AbortSignal) {
  const response = await fetch(heroTileIconUrl(id), { signal })
  if (!response.ok) throw new Error(`Icon ${id} failed to load`)
  const source = (await response.text()).replace(
    '<svg ',
    `<svg width="${ICON_TEXTURE_SIZE}" height="${ICON_TEXTURE_SIZE}" `,
  )
  const url = URL.createObjectURL(new Blob([source], { type: 'image/svg+xml' }))
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = ICON_TEXTURE_SIZE
    canvas.height = ICON_TEXTURE_SIZE
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('2D canvas unavailable')
    // Slightly restrained colour, matching the static tiles.
    ctx.filter = 'saturate(0.9)'
    ctx.drawImage(image, 0, 0, ICON_TEXTURE_SIZE, ICON_TEXTURE_SIZE)
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  } finally {
    URL.revokeObjectURL(url)
  }
}

interface TilesProps {
  geometry: HeroGeometry
  textures: IconTextures
  clock: MutableRefObject<number>
  onFirstFrame: () => void
}

function Tiles({ geometry, textures, clock, onFirstFrame }: TilesProps) {
  const { camera, size, invalidate } = useThree()
  const geometryRef = useRef(geometry)
  geometryRef.current = geometry

  // Re-render once when the measured layout changes, even while paused.
  useEffect(() => invalidate(), [geometry, invalidate])

  const tileGeometry = useMemo(createTileGeometry, [])
  const planeGeometry = useMemo(() => new THREE.PlaneGeometry(1, 1), [])
  const shadowTexture = useMemo(createShadowTexture, [])

  // Tile count and icons are fixed by the lane definitions.
  const icons = useMemo(laneIcons, [])
  const materials = useMemo(
    () =>
      icons.map((icon) => ({
        body: new THREE.MeshLambertMaterial({ color: TILE_FACE, transparent: true }),
        icon: new THREE.MeshBasicMaterial({
          map: textures[icon],
          transparent: true,
          depthWrite: false,
          toneMapped: false,
        }),
        shadow: new THREE.MeshBasicMaterial({
          map: shadowTexture,
          color: SHADOW_TINT,
          transparent: true,
          depthWrite: false,
          toneMapped: false,
        }),
      })),
    [icons, textures, shadowTexture],
  )

  useEffect(
    () => () => {
      tileGeometry.dispose()
      planeGeometry.dispose()
      shadowTexture.dispose()
      materials.forEach((set) => {
        set.body.dispose()
        set.icon.dispose()
        set.shadow.dispose()
      })
    },
    [tileGeometry, planeGeometry, shadowTexture, materials],
  )

  const tileRefs = useRef<(THREE.Group | null)[]>([])
  const shadowRefs = useRef<(THREE.Mesh | null)[]>([])

  // Faint pointer parallax: the camera eases a little toward the cursor.
  const pointer = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  const firstFrame = useRef(false)
  const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(FOV / 2))

  useFrame(() => {
    camera.position.x += (pointer.current.x * 0.18 - camera.position.x) * 0.05
    camera.position.y += (-pointer.current.y * 0.12 - camera.position.y) * 0.05

    const poses = laneTiles(geometryRef.current, clock.current)
    poses.forEach((pose, i) => {
      const tile = tileRefs.current[i]
      const shadow = shadowRefs.current[i]
      const set = materials[i]
      if (!tile || !shadow || !set) return
      const visible = pose.opacity > 0.01
      tile.visible = visible
      shadow.visible = visible
      if (!visible) return

      // World units per CSS pixel at this tile's depth.
      const k = (2 * (CAMERA_Z - pose.depth) * tanHalfFov) / size.height
      const x = (pose.x - size.width / 2) * k
      const y = (size.height / 2 - pose.y) * k
      const s = pose.size * k

      tile.position.set(x, y, pose.depth)
      tile.scale.setScalar(s)
      tile.rotation.set(pose.rotX, pose.rotY, pose.rotZ)
      shadow.position.set(x + s * 0.04, y - s * 0.12, pose.depth - 0.4)
      shadow.scale.setScalar(s * 1.55)

      set.body.opacity = pose.opacity
      set.icon.opacity = pose.opacity
      set.shadow.opacity = pose.opacity * SHADOW_OPACITY
    })

    if (!firstFrame.current) {
      firstFrame.current = true
      requestAnimationFrame(onFirstFrame)
    }
  })

  const iconZ = TILE_DEPTH / 2 + BEVEL + 0.004

  return (
    <>
      {icons.map((icon, i) => (
        <group key={`${icon}-${i}`}>
          <mesh
            ref={(el) => {
              shadowRefs.current[i] = el
            }}
            geometry={planeGeometry}
            material={materials[i].shadow}
            renderOrder={0}
          />
          <group
            ref={(el) => {
              tileRefs.current[i] = el
            }}
          >
            <mesh geometry={tileGeometry} material={materials[i].body} renderOrder={1} />
            <mesh
              geometry={planeGeometry}
              material={materials[i].icon}
              position={[0, 0, iconZ]}
              scale={ICON_FRACTION}
              renderOrder={2}
            />
          </group>
        </group>
      ))}
    </>
  )
}

// Drives on-demand rendering at ~30 fps. While `running` is false the loop
// is cancelled, so no frames are requested.
function Driver({ running, clock }: { running: boolean; clock: MutableRefObject<number> }) {
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => {
    if (!running) return
    let frame = 0
    let previous = performance.now()
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      const elapsed = now - previous
      if (elapsed < FRAME_INTERVAL - 2) return
      previous = now
      // Clamped so a long stall never jumps the tiles forward.
      clock.current += Math.min(elapsed, 100) / 1000
      invalidate()
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [running, clock, invalidate])
  return null
}

interface HeroTilesSceneProps {
  geometry: HeroGeometry
  running: boolean
  onReady: () => void
  onFail: () => void
}

export default function HeroTilesScene({ geometry, running, onReady, onFail }: HeroTilesSceneProps) {
  const [textures, setTextures] = useState<IconTextures | null>(null)
  const [ready, setReady] = useState(false)
  const clock = useRef(LAYOUT_START_TIME)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const callbacks = useRef({ onReady, onFail })
  callbacks.current = { onReady, onFail }

  useEffect(() => {
    const controller = new AbortController()
    let loaded: THREE.Texture[] = []
    Promise.all(ICON_IDS.map((id) => loadIconTexture(id, controller.signal)))
      .then((list) => {
        loaded = list
        if (controller.signal.aborted) {
          list.forEach((texture) => texture.dispose())
          return
        }
        const [figma, illustrator, photoshop, vscode, react] = list
        setTextures({ figma, illustrator, photoshop, vscode, react })
      })
      .catch(() => {
        if (!controller.signal.aborted) callbacks.current.onFail()
      })
    return () => {
      controller.abort()
      loaded.forEach((texture) => texture.dispose())
    }
  }, [])

  const handleContextLost = useCallback((event: Event) => {
    event.preventDefault()
    callbacks.current.onFail()
  }, [])

  // Context-loss listener, removed with the canvas.
  useEffect(
    () => () => canvasRef.current?.removeEventListener('webglcontextlost', handleContextLost),
    [handleContextLost],
  )

  return (
    <Canvas
      flat
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, CAMERA_Z], fov: FOV, near: 1, far: 60 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      onCreated={({ gl }) => {
        canvasRef.current = gl.domElement
        gl.domElement.addEventListener('webglcontextlost', handleContextLost)
      }}
    >
      <ambientLight intensity={2.2} />
      <directionalLight position={[-3, 5, 7]} intensity={1.25} />
      {textures && (
        <Tiles
          geometry={geometry}
          textures={textures}
          clock={clock}
          onFirstFrame={() => {
            setReady(true)
            callbacks.current.onReady()
          }}
        />
      )}
      <Driver running={running && ready} clock={clock} />
    </Canvas>
  )
}
