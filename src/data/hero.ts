/**
 * Homepage hero: copy and the real project assets behind its composition.
 *
 * The composition tells one honest story: Porchlight's home page as a
 * wireframe and as the finished build (the same page, from its case study),
 * a few of Porchlight's own design tokens and components, and a screen from
 * the released Backwater Journal iOS app. Nothing in it is invented.
 *
 * The two screenshots are resized copies made by scripts/hero-assets.py.
 */

export const heroCopy = {
  badge: 'Available for freelance & collaboration',
  headline: ['From first idea', 'to finished', 'experience.'],
  location: 'Chicago, Illinois',
  locationNote: 'Working remotely',
  primaryCta: 'View my work',
  secondaryCta: 'Start a project',
}

const base = import.meta.env.BASE_URL

export const heroWorkspaceAssets = {
  wireframe: {
    src: `${base}projects/porchlight/wf-home.webp`,
    width: 577,
    height: 481,
    caption: 'Wireframe',
    project: 'Porchlight',
  },
  browser: {
    src: `${base}hero/porchlight-final-1120.webp`,
    width: 1120,
    height: 700,
    caption: 'Porchlight · Final design',
  },
  phone: {
    src: `${base}hero/backwater-explore-420.webp`,
    width: 420,
    height: 870,
  },
  /** Backwater Journal's app label, beside the phone. */
  phoneChip: { title: 'Backwater Journal', meta: 'iOS app', dot: '#20382F' },
  /**
   * Porchlight's design tokens and components, as defined in its design
   * system (mirrored by the `porch-*` colours in tailwind.config.js).
   */
  components: {
    title: 'Components',
    project: 'Porchlight',
    swatches: [
      { name: 'Green', hex: '#24563F' },
      { name: 'Brass', hex: '#B8893A' },
      { name: 'Sunken', hex: '#F4EFE7' },
      { name: 'Charcoal', hex: '#1D1B18' },
    ],
    button: { label: 'Search', fill: '#24563F', text: '#FBF8F3' },
    input: { placeholder: 'Neighborhood or ZIP', border: '#E3DBCF', text: '#8F8475' },
    pill: { label: 'Pending', fill: '#FBF0D6', border: '#E9CF93', text: '#7A5200' },
  },
}
