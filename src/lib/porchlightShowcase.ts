import * as THREE from 'three'
import { DESKTOP, PHONE, STAGE } from '@/lib/showcaseLayout'

/**
 * Porchlight opening showcase: a shallow desktop browser panel and a phone
 * panel, each faced with a real Porchlight screenshot.
 *
 * - Loaded with a dynamic import, only on the Porchlight route.
 * - Renders on demand: one frame when ready, then only while a pointer tilt
 *   is easing. No idle animation loop.
 * - Skips rendering while offscreen or while the tab is hidden.
 * - Screenshots use unlit materials so their colors are reproduced exactly.
 * - `dispose()` releases every geometry, material, texture and the context.
 */

export interface ShowcaseOptions {
  host: HTMLElement
  pointerTarget: HTMLElement
  desktopSrc: string
  mobileSrc: string
  tilt: boolean
  onReady: () => void
  onFail: () => void
}

export interface ShowcaseHandle {
  dispose: () => void
}

const COLORS = {
  frame: '#FFFFFF',
  bar: '#F4EFE7',
  barDot: '#D9CFC0',
  urlPill: '#FFFFFF',
  phone: '#1D1B18',
  shadow: 'rgb(30, 52, 41)',
} as const

const FOV = 22
const MAX_DPR = 2
const TILT_X = 0.06
const TILT_Y = 0.04
const EASE = 0.12

function roundedRect(
  width: number,
  height: number,
  radii: { tl: number; tr: number; br: number; bl: number },
) {
  const x = -width / 2
  const y = -height / 2
  const shape = new THREE.Shape()
  shape.moveTo(x + radii.bl, y)
  shape.lineTo(x + width - radii.br, y)
  shape.quadraticCurveTo(x + width, y, x + width, y + radii.br)
  shape.lineTo(x + width, y + height - radii.tr)
  shape.quadraticCurveTo(x + width, y + height, x + width - radii.tr, y + height)
  shape.lineTo(x + radii.tl, y + height)
  shape.quadraticCurveTo(x, y + height, x, y + height - radii.tl)
  shape.lineTo(x, y + radii.bl)
  shape.quadraticCurveTo(x, y, x + radii.bl, y)
  return shape
}

const uniform = (r: number) => ({ tl: r, tr: r, br: r, bl: r })

// ShapeGeometry UVs are in shape space; remap them to 0..1 so a texture
// covers the shape exactly once, preserving the image's aspect ratio.
function shapeWithUVs(shape: THREE.Shape, width: number, height: number) {
  const geometry = new THREE.ShapeGeometry(shape, 16)
  const pos = geometry.attributes.position
  const uv = geometry.attributes.uv
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, pos.getX(i) / width + 0.5, pos.getY(i) / height + 0.5)
  }
  uv.needsUpdate = true
  return geometry
}

// A soft, tinted drop shadow baked into a canvas texture. The shadow shape is
// inset from the panel and lightly blurred so its falloff ends well inside
// the stage; the padding is several blur radii wide and the outermost pixels
// are cleared, so the texture is fully transparent at the plane's edges.
const SHADOW_BLUR = 8
const SHADOW_INSET = 0.05
const SHADOW_PAD = SHADOW_BLUR * 4

function shadowTexture(aspect: number) {
  const canvas = document.createElement('canvas')
  const w = 256
  const h = Math.round(w / aspect)
  canvas.width = w + SHADOW_PAD * 2
  canvas.height = h + SHADOW_PAD * 2
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.filter = `blur(${SHADOW_BLUR}px)`
    ctx.fillStyle = COLORS.shadow
    const insetX = w * SHADOW_INSET
    const insetY = h * SHADOW_INSET
    ctx.fillRect(SHADOW_PAD + insetX, SHADOW_PAD + insetY, w - insetX * 2, h - insetY * 2)
    ctx.filter = 'none'
    const edge = 2
    ctx.clearRect(0, 0, canvas.width, edge)
    ctx.clearRect(0, canvas.height - edge, canvas.width, edge)
    ctx.clearRect(0, 0, edge, canvas.height)
    ctx.clearRect(canvas.width - edge, 0, edge, canvas.height)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return { texture, padX: canvas.width / w, padY: canvas.height / h }
}

export function mountShowcase(options: ShowcaseOptions): ShowcaseHandle {
  const { host, pointerTarget, desktopSrc, mobileSrc, tilt, onReady, onFail } = options
  let disposed = false

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NoToneMapping
  renderer.setClearColor(0x000000, 0)
  const canvas = renderer.domElement
  canvas.setAttribute('aria-hidden', 'true')
  canvas.style.display = 'block'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  host.appendChild(canvas)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(FOV, STAGE.width / STAGE.height, 0.1, 100)
  camera.position.set(0, 0, STAGE.height / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2)))
  camera.lookAt(0, 0, 0)

  scene.add(new THREE.AmbientLight(0xffffff, 1.6))
  const key = new THREE.DirectionalLight(0xfff4e0, 1.1)
  key.position.set(-6, 8, 10)
  scene.add(key)

  const root = new THREE.Group()
  scene.add(root)

  const loader = new THREE.TextureLoader()
  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy()

  // --- Desktop browser panel ---
  const desktop = new THREE.Group()
  desktop.position.set(DESKTOP.cx, DESKTOP.cy, 0)
  desktop.rotation.set(0.01, 0.07, 0)
  root.add(desktop)

  const desktopDepth = 0.16
  const desktopBody = new THREE.Mesh(
    new THREE.ExtrudeGeometry(roundedRect(DESKTOP.width, DESKTOP.height, uniform(DESKTOP.radius)), {
      depth: desktopDepth,
      bevelEnabled: false,
      curveSegments: 12,
    }),
    new THREE.MeshStandardMaterial({ color: COLORS.frame, roughness: 0.9, metalness: 0 }),
  )
  desktopBody.position.z = -desktopDepth
  desktop.add(desktopBody)

  const barShape = roundedRect(DESKTOP.width, DESKTOP.bar, {
    tl: DESKTOP.radius,
    tr: DESKTOP.radius,
    br: 0,
    bl: 0,
  })
  const bar = new THREE.Mesh(
    new THREE.ShapeGeometry(barShape, 12),
    new THREE.MeshBasicMaterial({ color: COLORS.bar }),
  )
  bar.position.set(0, DESKTOP.height / 2 - DESKTOP.bar / 2, 0.002)
  desktop.add(bar)

  const dotGeometry = new THREE.CircleGeometry(0.055, 20)
  const dotMaterial = new THREE.MeshBasicMaterial({ color: COLORS.barDot })
  for (let i = 0; i < 3; i++) {
    const dot = new THREE.Mesh(dotGeometry, dotMaterial)
    dot.position.set(-DESKTOP.width / 2 + 0.3 + i * 0.19, DESKTOP.height / 2 - DESKTOP.bar / 2, 0.004)
    desktop.add(dot)
  }
  const pill = new THREE.Mesh(
    new THREE.ShapeGeometry(roundedRect(3.4, 0.22, uniform(0.11)), 8),
    new THREE.MeshBasicMaterial({ color: COLORS.urlPill }),
  )
  pill.position.set(0, DESKTOP.height / 2 - DESKTOP.bar / 2, 0.004)
  desktop.add(pill)

  const desktopScreenShape = roundedRect(DESKTOP.width, DESKTOP.screenHeight, {
    tl: 0,
    tr: 0,
    br: DESKTOP.radius,
    bl: DESKTOP.radius,
  })
  const desktopScreenMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const desktopScreen = new THREE.Mesh(
    shapeWithUVs(desktopScreenShape, DESKTOP.width, DESKTOP.screenHeight),
    desktopScreenMaterial,
  )
  desktopScreen.position.set(0, -DESKTOP.bar / 2, 0.003)
  desktop.add(desktopScreen)

  // --- Phone panel ---
  const phone = new THREE.Group()
  phone.position.set(PHONE.cx, PHONE.cy, 0.5)
  phone.rotation.set(0.02, -0.1, 0)
  root.add(phone)

  const phoneDepth = 0.24
  const phoneBody = new THREE.Mesh(
    new THREE.ExtrudeGeometry(roundedRect(PHONE.width, PHONE.height, uniform(PHONE.radius)), {
      depth: phoneDepth,
      bevelEnabled: false,
      curveSegments: 16,
    }),
    new THREE.MeshStandardMaterial({ color: COLORS.phone, roughness: 0.55, metalness: 0.1 }),
  )
  phoneBody.position.z = -phoneDepth
  phone.add(phoneBody)

  const phoneScreenMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const phoneScreen = new THREE.Mesh(
    shapeWithUVs(
      roundedRect(PHONE.screenWidth, PHONE.screenHeight, uniform(PHONE.screenRadius)),
      PHONE.screenWidth,
      PHONE.screenHeight,
    ),
    phoneScreenMaterial,
  )
  phoneScreen.position.z = 0.003
  phone.add(phoneScreen)

  // --- Soft tinted shadows behind each panel ---
  const addShadow = (group: THREE.Group, width: number, height: number, opacity: number) => {
    const { texture, padX, padY } = shadowTexture(width / height)
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width * padX, height * padY),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity, depthWrite: false }),
    )
    mesh.position.set(0.1, -0.28, -0.4)
    group.add(mesh)
  }
  addShadow(desktop, DESKTOP.width, DESKTOP.height, 0.34)
  addShadow(phone, PHONE.width, PHONE.height, 0.4)

  // --- Rendering on demand ---
  let raf = 0
  let onScreen = true
  let pageVisible = document.visibilityState === 'visible'
  let ready = false
  const current = { x: 0, y: 0 }
  const target = { x: 0, y: 0 }

  const resize = () => {
    const width = host.clientWidth
    const height = host.clientHeight
    if (width === 0 || height === 0) return
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  const frame = () => {
    raf = 0
    if (disposed || !ready || !onScreen || !pageVisible) return
    current.x += (target.x - current.x) * EASE
    current.y += (target.y - current.y) * EASE
    root.rotation.set(current.y, current.x, 0)
    renderer.render(scene, camera)
    if (Math.abs(target.x - current.x) > 1e-4 || Math.abs(target.y - current.y) > 1e-4) request()
  }

  function request() {
    if (!raf && !disposed) raf = requestAnimationFrame(frame)
  }

  const resizeObserver = new ResizeObserver(() => {
    resize()
    request()
  })
  resizeObserver.observe(host)
  resize()

  const intersection = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting
    if (onScreen) request()
    else if (raf) {
      cancelAnimationFrame(raf)
      raf = 0
    }
  })
  intersection.observe(host)

  const onVisibility = () => {
    pageVisible = document.visibilityState === 'visible'
    if (pageVisible) request()
    else if (raf) {
      cancelAnimationFrame(raf)
      raf = 0
    }
  }
  document.addEventListener('visibilitychange', onVisibility)

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
    const rect = pointerTarget.getBoundingClientRect()
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1
    target.x = THREE.MathUtils.clamp(nx, -1, 1) * TILT_X
    target.y = THREE.MathUtils.clamp(ny, -1, 1) * TILT_Y
    request()
  }
  const onPointerLeave = () => {
    target.x = 0
    target.y = 0
    request()
  }
  if (tilt) {
    pointerTarget.addEventListener('pointermove', onPointerMove)
    pointerTarget.addEventListener('pointerleave', onPointerLeave)
  }

  const onContextLost = (event: Event) => {
    event.preventDefault()
    onFail()
  }
  canvas.addEventListener('webglcontextlost', onContextLost)

  const prepare = (texture: THREE.Texture) => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = maxAnisotropy
    texture.minFilter = THREE.LinearMipmapLinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = true
    return texture
  }

  Promise.all([loader.loadAsync(desktopSrc), loader.loadAsync(mobileSrc)])
    .then(([desktopTexture, mobileTexture]) => {
      if (disposed) {
        desktopTexture.dispose()
        mobileTexture.dispose()
        return
      }
      desktopScreenMaterial.map = prepare(desktopTexture)
      phoneScreenMaterial.map = prepare(mobileTexture)
      desktopScreenMaterial.needsUpdate = true
      phoneScreenMaterial.needsUpdate = true
      ready = true
      resize()
      renderer.render(scene, camera)
      onReady()
    })
    .catch(() => {
      if (!disposed) onFail()
    })

  return {
    dispose() {
      if (disposed) return
      disposed = true
      if (raf) cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      intersection.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      pointerTarget.removeEventListener('pointermove', onPointerMove)
      pointerTarget.removeEventListener('pointerleave', onPointerLeave)
      canvas.removeEventListener('webglcontextlost', onContextLost)

      const materials = new Set<THREE.Material>()
      const geometries = new Set<THREE.BufferGeometry>()
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          geometries.add(object.geometry)
          const material = object.material as THREE.Material | THREE.Material[]
          ;(Array.isArray(material) ? material : [material]).forEach((m) => materials.add(m))
        }
      })
      materials.forEach((material) => {
        const map = (material as THREE.MeshBasicMaterial).map
        if (map) map.dispose()
        material.dispose()
      })
      geometries.forEach((geometry) => geometry.dispose())

      renderer.dispose()
      renderer.forceContextLoss()
      canvas.remove()
    },
  }
}
