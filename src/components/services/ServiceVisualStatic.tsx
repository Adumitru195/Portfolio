import { useId } from 'react'
import type { ServiceId } from '@/data/services'
import {
  FRAME_H,
  FRAME_W,
  KNOB_WHITE,
  PART_ROTATION,
  PERSPECTIVE,
  REST_TILT,
  SHADOW,
  VISUALS,
} from '@/lib/serviceVisuals'

// SVG units are hundredths of a frame unit, with y flipped to run down.
const S = 100

// The scene's resting pose as a CSS transform (CSS rotateX runs the
// opposite way to Three.js, rotateY the same way).
const TILT = `perspective(${PERSPECTIVE * 100}cqw) rotateX(${-REST_TILT.x}rad) rotateY(${REST_TILT.y}rad)`

/**
 * Still version of a service visual, drawn from the same parts as the 3D
 * scene. Shown immediately, while the scene loads, and on its own for small
 * screens, reduced motion or when WebGL is unavailable. Decorative only: the
 * caller hides it from assistive technology.
 */
export default function ServiceVisualStatic({ id, hidden }: { id: ServiceId; hidden: boolean }) {
  const parts = [...VISUALS[id]].sort((a, b) => a.z - b.z)
  // An SVG filter on the panels only: a CSS filter on the tilted SVG would
  // rasterize it before the 3D transform and blur the whole drawing.
  const shadowId = `service-shadow-${useId().replace(/:/g, '')}`
  return (
    <svg
      viewBox={`${(-FRAME_W / 2) * S} ${(-FRAME_H / 2) * S} ${FRAME_W * S} ${FRAME_H * S}`}
      className={`absolute inset-0 h-full w-full overflow-visible transition-opacity duration-700 ease-out ${hidden ? 'opacity-0' : 'opacity-100'}`}
      style={{ transform: TILT }}
      focusable="false"
    >
      <defs>
        <filter id={shadowId} x="-20%" y="-20%" width="140%" height="150%">
          {/* A CSS blur radius is twice the Gaussian's standard deviation. */}
          <feDropShadow dx={0} dy={SHADOW.y * S} stdDeviation={(SHADOW.blur / 2) * S} floodColor={SHADOW.color} />
        </filter>
      </defs>
      {parts.map((part) => {
        const cx = part.x * S
        const cy = -part.y * S
        if (part.kind === 'knob') {
          return (
            <circle
              key={part.id}
              cx={cx}
              cy={cy}
              r={part.r * S}
              fill={part.color}
              stroke={part.color === KNOB_WHITE ? '#E7E3DA' : 'none'}
              strokeWidth={0.6}
            />
          )
        }
        const rotation = PART_ROTATION[part.id]
        return (
          <rect
            key={part.id}
            x={cx - (part.w / 2) * S}
            y={cy - (part.h / 2) * S}
            width={part.w * S}
            height={part.h * S}
            rx={part.r * S}
            fill={part.color}
            filter={part.shadow ? `url(#${shadowId})` : undefined}
            transform={rotation ? `rotate(${(-rotation * 180) / Math.PI} ${cx} ${cy})` : undefined}
          />
        )
      })}
    </svg>
  )
}
