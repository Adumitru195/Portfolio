// Records the Afterglow Cinema journey video and captures the homepage card.
//
// Both come from the working prototype (UX Projects/Afterglow Cinema), whose
// films and artwork are fictional and original to it. The browser clock is
// fixed (CAPTURE_NOW, default 2026-11-23T10:00:00) so the sample schedule
// matches the case-study captures from scripts/afterglow-captures.mjs.
//
// Run the prototype, then this script, with Playwright available without adding
// it to package.json:
//   cd "../Afterglow Cinema" && npx vite --port 5180          (in one terminal)
//   npm i --no-save playwright@1.48.2
//   node scripts/walkthroughs/record-afterglow.mjs [prototype-url]
//
// Writes to scripts/walkthroughs/.output/afterglow/: journey.webm (raw
// recording, 1280 x 800) and card.png (1600 x 900). The video is then trimmed
// and encoded with ffmpeg (see scripts/walkthroughs/README.md).

import { mkdirSync, readdirSync, renameSync } from 'node:fs'
import { join, resolve } from 'node:path'

const base = process.argv[2] ?? 'http://localhost:5180'
const out = resolve(import.meta.dirname, '.output', 'afterglow')
mkdirSync(out, { recursive: true })

let chromium
try {
  ;({ chromium } = await import('playwright'))
} catch {
  console.error('Playwright is not installed. See the instructions at the top of this file.')
  process.exit(1)
}

const now = new Date(process.env.CAPTURE_NOW ?? '2026-11-23T10:00:00')
const d = new Date(now)
d.setDate(d.getDate() + 1)
const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const pause = (ms) => new Promise((r) => setTimeout(r, ms))
const browser = await chromium.launch({ channel: 'msedge' })

// Homepage card: the hero with its 3D poster showcase settled.
{
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } })
  await ctx.clock.setFixedTime(now)
  const p = await ctx.newPage()
  await p.goto(`${base}/?date=${date}`, { waitUntil: 'networkidle' })
  await p.waitForSelector('[data-showcase-mode="3d"]', { timeout: 10000 }).catch(() => {})
  await pause(4000)
  await p.screenshot({ path: join(out, 'card.png') })
  await ctx.close()
}

// Journey recording.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, recordVideo: { dir: out, size: { width: 1280, height: 800 } } })
  await ctx.clock.setFixedTime(now)
  const p = await ctx.newPage()
  const glide = async (x, y) => p.mouse.move(x, y, { steps: 25 })
  await p.goto(`${base}/?date=${date}`, { waitUntil: 'networkidle' })
  await pause(4500)
  for (let i = 0; i < 10; i++) { await p.mouse.wheel(0, 70); await pause(60) }
  await pause(700)
  const cards = p.locator('.film-card__poster')
  for (let i = 0; i < 4; i++) {
    const box = await cards.nth(i).boundingBox()
    if (box) { await glide(box.x + box.width / 2, box.y + box.height / 2); await pause(450) }
  }
  await p.locator('.film-card__link').first().click()
  await p.locator('.time-option').first().waitFor()
  await pause(900)
  await p.locator('#showtimes').scrollIntoViewIfNeeded()
  await pause(700)
  const pick = async (text) => {
    const option = p.locator('.time-option:not(.is-disabled)', { hasText: text }).first()
    const box = await option.boundingBox()
    if (box) await glide(box.x + box.width / 2, box.y + box.height / 2)
    await option.click()
    await pause(1300)
  }
  await pick('11:40 AM')
  await pick('2:30 PM')
  const press = async (locator, wait) => {
    const box = await locator.boundingBox()
    if (box) await glide(box.x + box.width / 2, box.y + box.height / 2)
    await locator.click()
    await pause(wait)
  }
  // Labels wrap visually hidden radios, so the visible label is clicked.
  await press(p.locator('.format-filter .segmented__option', { hasText: 'IMAX' }), 1100)
  await press(p.locator('.booking .date-chip').nth(2), 1100)
  await press(p.locator('.time-option:not(.is-disabled)').first(), 2600)
  const video = p.video()
  await ctx.close()
  const raw = await video.path()
  renameSync(raw, join(out, 'journey.webm'))
}

await browser.close()
console.log(`Recorded to ${out} for ${date}:`, readdirSync(out).join(', '))
