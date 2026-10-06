import type { Portrait as PortraitData } from '@/data/about'

interface PortraitProps {
  portrait: PortraitData
  /** The `sizes` attribute: how wide the image renders at each breakpoint. */
  sizes: string
  className?: string
  priority?: boolean
}

/**
 * A responsive portrait. Intrinsic width and height reserve its box before
 * the image arrives, so it never shifts the layout.
 */
export default function Portrait({ portrait, sizes, className = '', priority = false }: PortraitProps) {
  const largest = portrait.sources[portrait.sources.length - 1]
  return (
    <img
      src={largest.src}
      srcSet={portrait.sources.map((s) => `${s.src} ${s.width}w`).join(', ')}
      sizes={sizes}
      width={portrait.width}
      height={portrait.height}
      alt={portrait.alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={`block h-auto object-cover ${className}`}
    />
  )
}
