import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { displace, usePrefersReducedMotion } from '@/components/HeroWaveBackground'

/**
 * Full-page ambient backdrop for case study pages.
 *
 * A fixed Three.js layer that stays behind the content for the whole read:
 * the same indigo wireframe wave used in the hero, plus a sparse field of
 * floating points. Scrolling through the case study slowly tilts the wave,
 * drifts the camera, and turns the point field, so the backdrop moves with
 * the reader instead of ending after the header.
 *
 * Performance / a11y:
 *  - Lazy-loaded by the caller so it never blocks first paint.
 *  - Honors `prefers-reduced-motion`: one static frame, no loop, no scroll motion.
 *  - Uses requestAnimationFrame, which browsers suspend in hidden tabs.
 *  - Device pixel ratio capped; geometry is small and displaced on the CPU.
 */

const ACCENT = '#4F46E5'

const SEGMENTS = 40
const PLANE_WIDTH = 22
const PLANE_HEIGHT = 14
const SPEED = 0.35

const POINT_COUNT = 420
const POINT_SPREAD = { x: 22, y: 26, z: 8 }

// Scroll progress (0..1) shared with the render loop without re-rendering React.
function useScrollProgress() {
  const progress = useRef(0)
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      progress.current = max > 0 ? window.scrollY / max : 0
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])
  return progress
}

function createPointPositions(count: number) {
  const positions = new Float32Array(count * 3)
  // Deterministic pseudo-random spread so the field looks the same every visit.
  let seed = 7
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (rand() - 0.5) * POINT_SPREAD.x
    positions[i * 3 + 1] = (rand() - 0.5) * POINT_SPREAD.y
    positions[i * 3 + 2] = (rand() - 0.5) * POINT_SPREAD.z
  }
  return positions
}

function Scene({
  animate,
  waveOpacity,
  pointOpacity,
}: {
  animate: boolean
  waveOpacity: number
  pointOpacity: number
}) {
  const waveRef = useRef<THREE.Mesh>(null)
  const waveGroupRef = useRef<THREE.Group>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const { camera, invalidate } = useThree()
  const scroll = useScrollProgress()
  const eased = useRef(0)

  const waveGeometry = useMemo(
    () => new THREE.PlaneGeometry(PLANE_WIDTH, PLANE_HEIGHT, SEGMENTS, SEGMENTS),
    [],
  )
  const basePositions = useMemo(
    () => Float32Array.from(waveGeometry.attributes.position.array),
    [waveGeometry],
  )
  const pointGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(createPointPositions(POINT_COUNT), 3))
    return geometry
  }, [])

  useEffect(
    () => () => {
      waveGeometry.dispose()
      pointGeometry.dispose()
    },
    [waveGeometry, pointGeometry],
  )

  // Reduced motion: a single gentle static ripple.
  useEffect(() => {
    if (animate) return
    displace(waveGeometry.attributes.position as THREE.BufferAttribute, basePositions, 0)
    invalidate()
  }, [animate, waveGeometry, basePositions, invalidate])

  useFrame((_, delta) => {
    if (!animate || !waveRef.current || !waveGroupRef.current || !pointsRef.current) return

    // Ease toward the real scroll position so wheel steps feel like a glide.
    const k = Math.min(1, delta * 3)
    eased.current += (scroll.current - eased.current) * k
    const p = eased.current

    const t = (performance.now() / 1000) * SPEED + p * 4
    displace(waveRef.current.geometry.attributes.position as THREE.BufferAttribute, basePositions, t)

    // The wave flattens and turns as the reader moves through the story.
    waveGroupRef.current.rotation.x = -1.05 + p * 0.45
    waveGroupRef.current.rotation.z = p * 0.35

    // Points rise past the camera and rotate slowly, like dust in light.
    pointsRef.current.position.y = p * 8 - 4
    pointsRef.current.rotation.y = p * 0.9 + t * 0.05

    camera.position.y = -p * 1.5
    camera.lookAt(0, -p * 1.5, 0)
  })

  return (
    <>
      <group ref={waveGroupRef} position={[0, -2.6, 0]} rotation={[-1.05, 0, 0]}>
        <mesh ref={waveRef} geometry={waveGeometry}>
          <meshBasicMaterial color={ACCENT} wireframe transparent opacity={waveOpacity} />
        </mesh>
      </group>
      <points ref={pointsRef} geometry={pointGeometry}>
        <pointsMaterial
          color={ACCENT}
          size={0.05}
          sizeAttenuation
          transparent
          opacity={pointOpacity}
          depthWrite={false}
        />
      </points>
    </>
  )
}

export default function CaseStudyBackdrop({
  waveOpacity = 0.07,
  pointOpacity = 0.35,
}: {
  waveOpacity?: number
  pointOpacity?: number
}) {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        frameloop={reducedMotion ? 'demand' : 'always'}
        style={{ background: 'transparent' }}
      >
        <Scene animate={!reducedMotion} waveOpacity={waveOpacity} pointOpacity={pointOpacity} />
      </Canvas>
    </div>
  )
}
