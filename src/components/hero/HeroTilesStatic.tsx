import { heroTileIconUrl } from '@/data/hero-tiles'
import type { TilePose } from '@/lib/heroTilesLayout'

/**
 * Still composition of the hero tiles in plain HTML. Shown straight away
 * while the 3D scene loads, and on its own for reduced motion, touch
 * devices, narrow screens or when WebGL is unavailable. Decorative only:
 * the caller hides the whole layer from assistive technology.
 */
export default function HeroTilesStatic({ tiles, visible }: { tiles: TilePose[]; visible: boolean }) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-700 ease-out ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {tiles.map((tile) =>
        tile.opacity <= 0.01 ? null : (
          <div
            key={tile.key}
            className="absolute rounded-[24%] bg-tile-face border border-tile-edge shadow-[inset_0_-3px_0_rgba(60,55,90,0.05),0_2px_4px_-1px_rgba(46,43,95,0.08),0_14px_28px_-10px_rgba(46,43,95,0.22)]"
            style={{
              left: tile.x - tile.size / 2,
              top: tile.y - tile.size / 2,
              width: tile.size,
              height: tile.size,
              opacity: tile.opacity,
              transform: `rotate(${tile.rotZ}rad)`,
            }}
          >
            <img
              src={heroTileIconUrl(tile.icon)}
              alt=""
              draggable={false}
              className="absolute inset-[24%] w-[52%] h-[52%] select-none saturate-[.9]"
            />
          </div>
        ),
      )}
    </div>
  )
}
