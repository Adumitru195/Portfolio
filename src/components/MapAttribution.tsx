// Credit for Mapbox map imagery shown in Backwater Journal screenshots.
//
// Mapbox's attribution guide asks for static map images to be credited "in a
// textual description near the image", linking Mapbox and OpenStreetMap
// (https://docs.mapbox.com/help/getting-started/attribution/). In the app the
// map's own attribution sits under the bottom sheet, so screenshots don't
// show it; this line restores it beside each image.

const MAPBOX = 'https://www.mapbox.com/about/maps/'
const OSM = 'https://www.openstreetmap.org/copyright'

interface MapAttributionProps {
  /** What the credit refers to, e.g. "Map in the Explore screens". */
  subject?: string
  className?: string
  /** Classes for the links, e.g. a focus ring that suits the background. */
  linkClassName?: string
}

export default function MapAttribution({ subject = 'Map', className = '', linkClassName = '' }: MapAttributionProps) {
  const link = `underline decoration-1 underline-offset-2 hover:no-underline ${linkClassName}`
  return (
    <p className={`m-0 text-xs leading-snug ${className}`}>
      {subject}:{' '}
      <a href={MAPBOX} target="_blank" rel="noopener noreferrer" className={link}>
        © Mapbox<span className="sr-only"> (opens in a new tab)</span>
      </a>{' '}
      <a href={OSM} target="_blank" rel="noopener noreferrer" className={link}>
        © OpenStreetMap<span className="sr-only"> (opens in a new tab)</span>
      </a>
    </p>
  )
}
