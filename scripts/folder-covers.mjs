// Generates the homepage folder-card covers for Backwater Journal and AIC from
// the real product screenshots already in public/projects. Each cover is a
// self-contained HTML composition (fonts and screenshots embedded as data
// URIs) rendered at 1600 x 900 by headless Chrome, then saved as JPEG.
//
// Run from the project root:  node scripts/folder-covers.mjs
// Requires Google Chrome (macOS path below) and macOS `sips` for the JPEG step.
// The original case-study covers and source screenshots are not modified.

import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const WIDTH = 1600
const HEIGHT = 900

const dataUri = (path, type) => `data:${type};base64,${readFileSync(join(root, path)).toString('base64')}`
const newsreader = dataUri('node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2', 'font/woff2')

const base = `
  @font-face { font-family: 'Newsreader'; src: url(${newsreader}) format('woff2'); font-weight: 200 800; }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; }
  body { position: relative; font-family: 'Newsreader', Georgia, serif; -webkit-font-smoothing: antialiased; }
  .title { position: absolute; left: 112px; top: 50%; transform: translateY(-58%); font-weight: 400; font-size: 132px; line-height: 0.95; letter-spacing: -0.03em; }
  .title span { display: block; }
  .phone { position: absolute; display: block; }
`

// Backwater: the current Dock and Explore product-tour screens (transparent,
// phone frames included) on cream, with an evergreen panel behind them.
const backwater = {
  output: 'public/projects/backwater-journal/backwater-folder-cover.jpg',
  html: `<!doctype html><html><head><meta charset="utf-8"><style>${base}
    body { background: #F4F1EA; color: #20382F; }
    .panel { position: absolute; top: 0; right: 0; bottom: 0; width: 820px; background: #20382F; }
    .rule { position: absolute; left: 112px; bottom: 156px; width: 120px; height: 3px; background: #D9A441; }
    .dock { right: 400px; top: 150px; height: 860px; filter: drop-shadow(0 30px 40px rgba(10, 22, 16, 0.45)); }
    .explore { right: 70px; top: 60px; height: 860px; filter: drop-shadow(0 30px 40px rgba(10, 22, 16, 0.45)); }
  </style></head><body>
    <div class="panel"></div>
    <h1 class="title"><span>Backwater</span><span>Journal</span></h1>
    <div class="rule"></div>
    <img class="phone dock" src="${dataUri('public/projects/backwater-journal/dock.webp', 'image/webp')}" alt="">
    <img class="phone explore" src="${dataUri('public/projects/backwater-journal/explore.webp', 'image/webp')}" alt="">
  </body></html>`,
}

// AIC: the original light and dark home screens (bare exports, so they get a
// plain device frame) on warm paper, with a stone panel and a thin arch.
const aicFrame = (src, cls) =>
  `<div class="device ${cls}"><img src="${dataUri(src, 'image/jpeg')}" alt=""></div>`
const aic = {
  output: 'public/projects/aic-museum-experience/aic-folder-cover.jpg',
  html: `<!doctype html><html><head><meta charset="utf-8"><style>${base}
    body { background: #F6F2EB; color: #27231F; }
    .panel { position: absolute; top: 0; right: 0; bottom: 0; width: 820px; background: #E9E0D4; }
    .arch { position: absolute; right: 90px; top: 70px; width: 640px; height: 900px; border: 2px solid #C9B9A6; border-bottom: 0; border-radius: 320px 320px 0 0; }
    .title { color: #27231F; }
    .title .accent { color: #842C3B; }
    .device { position: absolute; width: 334px; padding: 12px; border-radius: 54px; background: #1F1B18; box-shadow: 0 30px 50px -20px rgba(81, 38, 50, 0.45); }
    .device img { display: block; width: 100%; border-radius: 42px; }
    .light { right: 430px; top: 170px; }
    .dark { right: 92px; top: 74px; }
  </style></head><body>
    <div class="panel"></div>
    <div class="arch"></div>
    <h1 class="title"><span class="accent">AIC</span><span>Museum</span><span>Experience</span></h1>
    ${aicFrame('public/projects/aic-museum-experience/app-06.jpg', 'light')}
    ${aicFrame('public/projects/aic-museum-experience/app-18.jpg', 'dark')}
  </body></html>`,
}

const work = mkdtempSync(join(tmpdir(), 'folder-covers-'))
try {
  for (const cover of [backwater, aic]) {
    const page = join(work, 'cover.html')
    const png = join(work, 'cover.png')
    writeFileSync(page, cover.html)
    execFileSync(chrome, [
      '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
      `--window-size=${WIDTH},${HEIGHT}`, '--virtual-time-budget=4000', `--screenshot=${png}`, `file://${page}`,
    ], { stdio: 'ignore' })
    execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '84', png, '--out', join(root, cover.output)], { stdio: 'ignore' })
    console.log(`wrote ${cover.output}`)
  }
} finally {
  rmSync(work, { recursive: true, force: true })
}
