// Generates the AIC Museum Experience covers used on the homepage:
//   public/projects/aic-museum-experience/aic-folder-cover.jpg  (1600 x 900, Work folder)
//   public/projects/aic-museum-experience/aic-cover.jpg         (1920 x 1080, project card)
//
// Each cover is a self-contained HTML composition: the project title in
// Newsreader beside Georges Seurat's A Sunday on La Grande Jatte — 1884, a
// public-domain painting from the Art Institute of Chicago's open-access
// collection (CC0; downloaded by scripts/aic-case-study-assets.py). The
// original team screens are not used: they contain imagery whose source or
// permission is not recorded (see UX Projects/AIC Museum Experience/docs).
//
// Run from the project root, with Playwright installed without adding it to
// package.json:
//   npm i --no-save playwright@1.48.2 && npx playwright install chromium
//   python scripts/aic-case-study-assets.py
//   node scripts/aic-covers.mjs

import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const out = join(root, 'public/projects/aic-museum-experience')

let chromium
try {
  ;({ chromium } = await import('playwright'))
} catch {
  console.error('Playwright is not installed. See the instructions at the top of this file.')
  process.exit(1)
}

const dataUri = (path, type) => `data:${type};base64,${readFileSync(join(root, path)).toString('base64')}`
const newsreader = dataUri('node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2', 'font/woff2')
const newsreaderItalic = dataUri('node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-italic.woff2', 'font/woff2')
const painting = dataUri('public/projects/aic-museum-experience/artworks/seurat-grande-jatte-lg.webp', 'image/webp')

function cover(width, height) {
  const s = width / 1600
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    @font-face { font-family: 'Newsreader'; src: url(${newsreader}) format('woff2'); font-weight: 200 800; }
    @font-face { font-family: 'Newsreader'; font-style: italic; src: url(${newsreaderItalic}) format('woff2'); font-weight: 200 800; }
    * { box-sizing: border-box; margin: 0; }
    html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
    body { position: relative; background: #F6F2EB; color: #27231F; font-family: 'Newsreader', Georgia, serif; -webkit-font-smoothing: antialiased; }
    .panel { position: absolute; top: 0; right: 0; bottom: 0; width: ${860 * s}px; background: #E9E0D4; }
    .arch { position: absolute; right: ${110 * s}px; top: ${70 * s}px; width: ${640 * s}px; height: ${760 * s}px; border: 1px solid #C7B9A6; border-bottom: none; border-radius: ${320 * s}px ${320 * s}px 0 0; }
    .frame { position: absolute; right: ${90 * s}px; top: ${250 * s}px; width: ${680 * s}px; border: ${7 * s}px solid #2B2420; background: #2B2420; box-shadow: 0 ${30 * s}px ${50 * s}px -${26 * s}px rgba(74,34,48,0.6); }
    .frame img { display: block; width: 100%; height: auto; }
    .title { position: absolute; left: ${112 * s}px; top: 50%; transform: translateY(-56%); font-weight: 400; font-size: ${118 * s}px; line-height: 0.95; letter-spacing: -0.03em; }
    .title span { display: block; }
    .title em { color: #842C3B; }
    .rule { position: absolute; left: ${112 * s}px; bottom: ${150 * s}px; width: ${120 * s}px; height: ${3 * s}px; background: #842C3B; }
  </style></head><body>
    <div class="panel"></div><div class="arch"></div>
    <div class="frame"><img src="${painting}" alt=""></div>
    <h1 class="title"><span>AIC</span><span>Museum</span><span><em>Experience</em></span></h1>
    <div class="rule"></div>
  </body></html>`
}

const browser = await chromium.launch()
for (const [file, width, height] of [['aic-folder-cover.jpg', 1600, 900], ['aic-cover.jpg', 1920, 1080]]) {
  const page = await browser.newPage({ viewport: { width, height } })
  await page.setContent(cover(width, height), { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: join(out, file), type: 'jpeg', quality: 88 })
  await page.close()
  console.log(`${file}: ${width} x ${height}`)
}
await browser.close()
