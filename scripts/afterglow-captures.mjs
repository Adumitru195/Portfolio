// Captures authentic Afterglow Cinema prototype screens for the case study.
//
// Every image comes from the working prototype (UX Projects/Afterglow Cinema),
// not from a mock-up. Cinemas, schedules, availability and prices are the
// prototype's fictional sample data. The films and their artwork are fictional
// and original to the prototype (see that project's docs/ASSET-SOURCES.md).
//
// Run the prototype, then this script, with Playwright available without adding
// it to package.json:
//   cd "../Afterglow Cinema" && npx vite --port 5180          (in one terminal)
//   npm i --no-save playwright@1.48.2
//   node scripts/afterglow-captures.mjs [prototype-url]
//
// Writes PNG captures (2x) to scripts/.afterglow-captures/. Then run
// scripts/afterglow-case-study-assets.py, which converts them to WebP in
// public/projects/afterglow-cinema/case-study/ and deletes this folder.
//
// Captures use tomorrow's date so no showing is marked "Started", and reduced
// motion so no entrance or reveal is caught mid-animation. Set CAPTURE_NOW
// (e.g. 2026-11-23T10:00:00) to fix the browser clock, so the sample schedule,
// which depends on the date, matches an earlier capture exactly.

import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const base = process.argv[2] ?? 'http://localhost:5180'
const out = resolve(import.meta.dirname, '.afterglow-captures')
mkdirSync(out, { recursive: true })

let chromium
try {
  ;({ chromium } = await import('playwright'))
} catch {
  console.error('Playwright is not installed. See the instructions at the top of this file.')
  process.exit(1)
}

const now = process.env.CAPTURE_NOW ? new Date(process.env.CAPTURE_NOW) : new Date()
const d = new Date(now)
d.setDate(d.getDate() + 1)
const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined }).catch(() => chromium.launch({ channel: 'msedge' }))
const settle = (page, ms = 700) => page.waitForTimeout(ms)

// Lazy images load only once they're near the viewport: scroll through first.
async function loadAll(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 400) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 60))
    }
    window.scrollTo(0, 0)
    // Only images that are displayed: a hidden lazy image (the phone film page
    // hides its poster) never loads. Give up after 5 s either way.
    const pending = [...document.images].filter((i) => !i.complete && i.offsetParent !== null)
    await Promise.race([
      Promise.all(pending.map((i) => new Promise((r) => { i.onload = i.onerror = r }))),
      new Promise((r) => setTimeout(r, 5000)),
    ])
  })
  await settle(page, 400)
}

async function go(page, path) {
  await page.goto(base + path, { waitUntil: 'networkidle' })
  await loadAll(page)
}

const firstOpenTime = '.time-option:not(.is-disabled):not(.is-limited) input'

// Desktop: 1440 x 900 CSS px at 2x.
const desk = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' })
if (process.env.CAPTURE_NOW) await desk.clock.setFixedTime(now)
let p = await desk.newPage()

await go(p, `/?date=${date}`)
await p.screenshot({ path: `${out}/d-home.png` })
await p.locator('section.listings').screenshot({ path: `${out}/d-program.png` })

for (const [query, name] of [['kite', 'd-search-hint']]) {
  await go(p, `/?date=${date}`)
  await p.getByRole('searchbox').fill(query)
  await settle(p)
  await p.locator('section.listings').screenshot({ path: `${out}/${name}.png` })
}

await go(p, `/films/interstellar?date=${date}`)
await p.locator('section.booking').screenshot({ path: `${out}/d-showtimes.png` })
await p.locator(firstOpenTime).first().check({ force: true })
await settle(p)
await p.locator('section.booking').screenshot({ path: `${out}/d-selected.png` })

await go(p, `/films/everything-everywhere-all-at-once?cinema=lakeside&date=${date}`)
await p.locator('section.booking').screenshot({ path: `${out}/d-not-at-cinema.png` })
await desk.close()

// Phone: 390 x 844 CSS px at 2x.
const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' })
if (process.env.CAPTURE_NOW) await phone.clock.setFixedTime(now)
p = await phone.newPage()

await go(p, `/?date=${date}`)
await p.screenshot({ path: `${out}/m-home.png` })

await go(p, `/?date=${date}`)
await p.getByRole('searchbox').fill('sand')
await settle(p)
await p.locator('.listings__head').evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 16))
await settle(p)
await p.screenshot({ path: `${out}/m-search.png` })

await go(p, `/films/interstellar?date=${date}`)
await p.screenshot({ path: `${out}/m-film.png` })
await p.locator(firstOpenTime).first().check({ force: true })
await settle(p)
await p.locator('.time-groups').evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 220))
await settle(p)
await p.screenshot({ path: `${out}/m-selected.png` })
await p.locator('#summary').evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 16))
await settle(p)
await p.screenshot({ path: `${out}/m-summary.png` })

await go(p, `/films/everything-everywhere-all-at-once?cinema=lakeside&date=${date}`)
await p.getByText(/Not screening at/).first().evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 260))
await settle(p)
await p.screenshot({ path: `${out}/m-not-at-cinema.png` })
await phone.close()

await browser.close()
console.log('Captured to', out, 'for', date)
