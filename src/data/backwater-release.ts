/**
 * Backwater Journal's verified release facts: the single source for the case
 * study (src/data/backwater.ts) and the homepage feature (src/data/work.ts).
 *
 * Verified against the App Store version history on the date below. When a
 * new version ships, update `latest` and `verifiedOn` here; prose that
 * describes what a specific version changed stays in the case study.
 */
export const backwaterRelease = {
  appStoreUrl: 'https://apps.apple.com/us/app/backwater-journal/id6761636518',
  released: 'July 14, 2026',
  latest: { version: '1.1.0', date: 'September 27, 2026' },
  price: 'Free on the App Store',
  verifiedOn: 'October 14, 2026',
} as const
