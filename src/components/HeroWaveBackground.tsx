import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Ambient wireframe-wave backdrop for the hero.
 *
 * A tilted indigo wireframe plane whose vertices are displaced by slow,
 * overlapping sine waves. A faint mouse-driven tilt adds depth. The layer
 * sits behind the hero content and never captures pointer events.
 *
 * Performance / a11y:
 *  - Lazy-loaded by the caller so it never blocks first paint.
 *  - Honors `prefers-reduced-motion`: renders a single static frame, no loop.
 *  - Pauses rendering when the hero scrolls out of view.
 *  - Device pixel ratio capped to keep GitHub Pages builds light.
 */

const ACCENT = '#4F46E5'

// Plane resolution. 40x40 segments = ~1.6k vertices; trivially cheap to
// displace on the CPU each frame and keeps the code GLSL-free.
const SEGMENTS = 40
const PLANE_WIDTH = 18
const PLANE_HEIGHT = 12

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

function displace(positions: THREE.BufferAttribute, base: Float32Array, t: number) {
  for (let i = 0; i < positions.count; i++) {
    const x = base[i * 3]
    const y = base[i * 3 + 1]
    // Two overlapping waves on different axes/frequencies for an organic ripple.
    const z =
      Math.sin(x * 0.5 + t) * 0.6 +
      Math.sin(y * 0.4 + t * 0.8) * 0.5 +
      Math.sin((x + y) * 0.3 + t * 0.6) * 0.4
    positions.setZ(i, z)
  }
  positions.needsUpdate = true
}

function WaveMesh({ animate }: { animate: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const { invalidate } = useThree()

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(PLANE_WIDTH, PLANE_HEIGHT, SEGMENTS, SEGMENTS),
    [],
  )

  // Pristine copy of the flat vertex positions to displace from each frame.
  const basePositions = useMemo(
    () => Float32Array.from(geometry.attributes.position.array),
    [geometry],
  )

  useEffect(() => () => geometry.dispose(), [geometry])

  // Smoothed mouse target for the parallax tilt (normalized -1..1).
  const mouse = useRef({ x: 0, y: 0 })
  useEffect(() => {
    if (!animate) return
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [animate])

  // Reduced-motion: displace once into a gentle static ripple, render a frame.
  useEffect(() => {
    if (animate) return
    const positions = geometry.attributes.position as THREE.BufferAttribute
    displace(positions, basePositions, 0)
    invalidate()
  }, [animate, geometry, basePositions, invalidate])

  useFrame((_, delta) => {
    if (!animate || !meshRef.current || !groupRef.current) return
    const t = performance.now() / 1000
    displace(meshRef.current.geometry.attributes.position as THREE.BufferAttribute, basePositions, t)

    // Ease the group toward a faint mouse-driven tilt.
    const targetX = -0.9 + mouse.current.y * 0.08
    const targetY = mouse.current.x * 0.12
    const k = Math.min(1, delta * 2.5)
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * k
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * k
  })

  return (
    <group ref={groupRef} rotation={[-0.9, 0, 0]}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshBasicMaterial
          color={ACCENT}
          wireframe
          transparent
          opacity={0.28}
        />
      </mesh>
    </group>
  )
}

export default function HeroWaveBackground() {
  const reducedMotion = usePrefersReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)

  // Pause the render loop while the hero is scrolled out of view.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const animate = !reducedMotion && inView

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 9], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        frameloop={reducedMotion ? 'demand' : inView ? 'always' : 'never'}
        style={{ background: 'transparent' }}
      >
        <WaveMesh animate={animate} />
      </Canvas>
    </div>
  )
}
