import { useId } from 'react'
import type { WireElement, WireIcon, WireScreen } from '@/types/aic'

// Draws a retrospective low-fidelity reconstruction of an original team
// screen (data in src/data/aic-wireframes.ts). Greys only: the drawing records
// layout, controls, hierarchy and text, not the original colour or imagery.

const INK = '#2F2A25'
const MUTED = '#6E655B'
const STROKE = '#A39A8E'
const SOLID = '#4A433C'
const TINT = '#DCD4C8'
const PAPER = '#FBF9F5'
const SANS = '"Instrument Sans Variable", system-ui, sans-serif'
const SERIF = '"Newsreader Variable", Georgia, serif'

function Icon({ name, x, y, size = 40, strong = false }: { name: WireIcon; x: number; y: number; size?: number; strong?: boolean }) {
  const s = size
  const stroke = strong ? INK : MUTED
  const common = { fill: 'none', stroke, strokeWidth: Math.max(3, s * 0.08), strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (name) {
    case 'chevron-left':
      return <polyline {...common} points={`${x + s * 0.22},${y - s * 0.45} ${x - s * 0.22},${y} ${x + s * 0.22},${y + s * 0.45}`} />
    case 'chevron-right':
      return <polyline {...common} points={`${x - s * 0.22},${y - s * 0.45} ${x + s * 0.22},${y} ${x - s * 0.22},${y + s * 0.45}`} />
    case 'search':
      return (
        <g {...common}>
          <circle cx={x - s * 0.08} cy={y - s * 0.08} r={s * 0.3} />
          <line x1={x + s * 0.14} y1={y + s * 0.14} x2={x + s * 0.42} y2={y + s * 0.42} />
        </g>
      )
    case 'filter':
      return (
        <g {...common}>
          <line x1={x - s * 0.5} y1={y - s * 0.3} x2={x + s * 0.5} y2={y - s * 0.3} />
          <line x1={x - s * 0.35} y1={y} x2={x + s * 0.35} y2={y} />
          <line x1={x - s * 0.2} y1={y + s * 0.3} x2={x + s * 0.2} y2={y + s * 0.3} />
        </g>
      )
    case 'home':
      return <path {...common} fill={strong ? SOLID : 'none'} d={`M${x - s * 0.45},${y - s * 0.02} L${x},${y - s * 0.45} L${x + s * 0.45},${y - s * 0.02} M${x - s * 0.32},${y - s * 0.12} V${y + s * 0.42} H${x + s * 0.32} V${y - s * 0.12}`} />
    case 'bell':
      return (
        <g {...common}>
          <path d={`M${x - s * 0.34},${y + s * 0.22} C${x - s * 0.3},${y - s * 0.5} ${x + s * 0.3},${y - s * 0.5} ${x + s * 0.34},${y + s * 0.22} Z`} />
          <line x1={x - s * 0.42} y1={y + s * 0.24} x2={x + s * 0.42} y2={y + s * 0.24} />
          <line x1={x - s * 0.1} y1={y + s * 0.4} x2={x + s * 0.1} y2={y + s * 0.4} />
        </g>
      )
    case 'trend':
      return (
        <g {...common}>
          <polyline points={`${x - s * 0.48},${y + s * 0.32} ${x - s * 0.12},${y - s * 0.04} ${x + s * 0.06},${y + s * 0.14} ${x + s * 0.46},${y - s * 0.3}`} />
          <polyline points={`${x + s * 0.18},${y - s * 0.32} ${x + s * 0.46},${y - s * 0.3} ${x + s * 0.44},${y - s * 0.02}`} />
        </g>
      )
    case 'gear':
      return (
        <g {...common}>
          <circle cx={x} cy={y} r={s * 0.36} strokeDasharray={`${s * 0.16} ${s * 0.08}`} />
          <circle cx={x} cy={y} r={s * 0.14} />
        </g>
      )
    case 'share':
      return (
        <g {...common}>
          <path d={`M${x - s * 0.15},${y - s * 0.3} H${x - s * 0.42} V${y + s * 0.42} H${x + s * 0.3} V${y + s * 0.12}`} />
          <polyline points={`${x - s * 0.05},${y + s * 0.05} ${x + s * 0.42},${y - s * 0.42}`} />
          <polyline points={`${x + s * 0.1},${y - s * 0.42} ${x + s * 0.42},${y - s * 0.42} ${x + s * 0.42},${y - s * 0.1}`} />
        </g>
      )
    case 'qr':
      return (
        <g fill={stroke}>
          {[[-0.45, -0.45], [0.1, -0.45], [-0.45, 0.1]].map(([dx, dy]) => (
            <rect key={`${dx}${dy}`} x={x + s * dx} y={y + s * dy} width={s * 0.35} height={s * 0.35} />
          ))}
          <rect x={x + s * 0.15} y={y + s * 0.15} width={s * 0.25} height={s * 0.25} />
        </g>
      )
  }
}

function Element({ el, hatch }: { el: WireElement; hatch: string }) {
  switch (el.t) {
    case 'text':
      return (
        <text
          x={el.x}
          y={el.y}
          fontSize={el.size}
          textAnchor={el.anchor ?? 'start'}
          fontWeight={el.weight ?? 400}
          fontFamily={el.serif ? SERIF : SANS}
          fill={el.tone === 'muted' ? MUTED : INK}
        >
          {el.s}
        </text>
      )
    case 'box': {
      const fill = el.fill === 'solid' ? SOLID : el.fill === 'tint' ? TINT : 'none'
      return (
        <g>
          <rect x={el.x} y={el.y} width={el.w} height={el.h} rx={el.r ?? 0} fill={fill} stroke={el.fill === 'none' || !el.fill ? STROKE : 'none'} strokeWidth={3} />
          {el.label && (
            <text x={el.x + el.w / 2} y={el.y + el.h / 2 + (el.size ?? 34) * 0.35} fontSize={el.size ?? 34} textAnchor="middle" fontFamily={SANS} fill={el.fill === 'solid' ? PAPER : INK}>
              {el.label}
            </text>
          )}
        </g>
      )
    }
    case 'omit':
      return (
        <g>
          <rect x={el.x} y={el.y} width={el.w} height={el.h} rx={el.r ?? 0} fill={`url(#${hatch})`} stroke={STROKE} strokeWidth={2} />
          {el.label && (
            <text x={el.x + el.w / 2} y={el.y + el.h / 2 + 10} fontSize={Math.min(30, el.w / 7)} textAnchor="middle" fontFamily={SANS} fill={MUTED}>
              {el.label}
            </text>
          )}
        </g>
      )
    case 'dot':
      return (
        <circle
          cx={el.cx}
          cy={el.cy}
          r={el.r}
          fill={el.fill === 'solid' ? SOLID : el.fill === 'tint' ? TINT : `url(#${hatch})`}
          stroke={el.fill === 'omit' ? STROKE : 'none'}
          strokeWidth={2}
        />
      )
    case 'line':
      return <line x1={el.x1} y1={el.y1} x2={el.x2} y2={el.y2} stroke={STROKE} strokeWidth={2} />
    case 'icon':
      return <Icon name={el.name} x={el.x} y={el.y} size={el.size} strong={el.strong} />
  }
}

/** A reconstruction in a plain rounded screen frame. Exposed to assistive technology as one image. */
export default function Wireframe({ screen, className = '' }: { screen: WireScreen; className?: string }) {
  const id = useId().replace(/:/g, '')
  const hatch = `hatch-${id}`
  const faint = `faint-${id}`
  return (
    <svg
      role="img"
      aria-label={screen.description}
      viewBox={`0 0 ${screen.width} ${screen.height}`}
      className={`block h-auto w-full rounded-[28px] border-[6px] border-[#D9D1C5] bg-[#FBF9F5] ${className}`}
    >
      <defs>
        <pattern id={hatch} width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="18" height="18" fill="#EFE9E0" />
          <line x1="0" y1="0" x2="0" y2="18" stroke="#C9BFB2" strokeWidth="5" />
        </pattern>
        <pattern id={faint} width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="40" stroke="#EAE3D9" strokeWidth="4" />
        </pattern>
      </defs>
      <rect width={screen.width} height={screen.height} fill={PAPER} />
      {screen.photoBackground && <rect width={screen.width} height={screen.height} fill={`url(#${faint})`} />}
      {screen.elements.map((el, i) => (
        <Element key={i} el={el} hatch={hatch} />
      ))}
    </svg>
  )
}
