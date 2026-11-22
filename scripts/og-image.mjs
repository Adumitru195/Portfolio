// Captures the social preview image (public/og-image.png, 1200 x 630) from
// the real homepage hero, with motion reduced so the composition is still.
//
// Run with the production build served locally, and Playwright installed
// without adding it to package.json:
//   npm run build && npm run preview          (in one terminal)
//   npm i --no-save playwright@1.48.2 && npx playwright install chromium
//   node scripts/og-image.mjs [base-url]       (default: the preview server)
//
// Social networks don't accept SVG previews, so this replaces og-image.svg.

import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const base = process.argv[2] ?? 'http://localhost:4173/Portfolio/'

let chromium
try {
  ;({ chromium } = await import('playwright'))
} catch {
  console.error('Playwright is not installed. Run: npm i --no-save playwright@1.48.2')
  process.exit(1)
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await page.emulateMedia({ reducedMotion: 'reduce' })
await page.goto(`${base}#/`, { waitUntil: 'networkidle' })
// The navigation and scroll bar belong to the page, not the preview.
await page.addStyleTag({ content: 'header.fixed, .fixed { display: none !important; }' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(1500)
const hero = await page.$('section[aria-labelledby=hero-heading]')
const box = await hero.boundingBox()
// Centre the 630px-tall crop on the hero's content.
const content = await page.$('section[aria-labelledby=hero-heading] .content-wide')
const c = await content.boundingBox()
const y = Math.max(box.y, Math.round(c.y + c.height / 2 - 315))
// Page-relative crop, so it can extend past the 630px viewport.
await page.screenshot({ path: resolve(root, 'public/og-image.png'), fullPage: true, clip: { x: 0, y, width: 1200, height: 630 } })
await browser.close()
console.log('public/og-image.png written')
