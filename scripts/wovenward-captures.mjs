// Captures authentic Wovenward prototype screens for the case study.
//
// Every image comes from the working storefront (UX Projects/Wovenward), not
// from a mock-up. Products, prices, measurements and stock are the prototype's
// sample data; photography sources are in that project's docs/ASSET-SOURCES.md.
//
// Run the storefront, then this script, with Playwright available without
// adding it to package.json:
//   cd "../Wovenward" && npx vite --port 5190          (in one terminal)
//   npm i --no-save playwright@1.48.2
//   node scripts/wovenward-captures.mjs [storefront-url]
//
// Writes PNG captures (2x) to scripts/.wovenward-captures/. Then run
// scripts/wovenward-case-study-assets.py, which converts them to WebP in
// public/projects/wovenward/case-study/ and deletes this folder.
//
// Captures use reduced motion so no entrance or reveal is caught mid-animation,
// and a fresh browser context, so the bag starts empty.

import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const base = process.argv[2] ?? 'http://localhost:5190'
const out = resolve(import.meta.dirname, '.wovenward-captures')
mkdirSync(out, { recursive: true })

let chromium
try {
  ;({ chromium } = await import('playwright'))
} catch {
  console.error('Playwright is not installed. See the instructions at the top of this file.')
  process.exit(1)
}

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined }).catch(() => chromium.launch({ channel: 'msedge' }))
const settle = (page, ms = 600) => page.waitForTimeout(ms)
const JUMPER = '/products/mock-neck-jumper'
const JACKET = '/products/funnel-neck-utility-jacket'

async function go(page, path) {
  await page.goto(base + path, { waitUntil: 'networkidle' })
  // Load lazy images, then return to the top.
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 400) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 40))
    }
    window.scrollTo(0, 0)
    const pending = [...document.images].filter((i) => !i.complete && i.offsetParent !== null)
    await Promise.race([Promise.all(pending.map((i) => new Promise((r) => { i.onload = i.onerror = r }))), new Promise((r) => setTimeout(r, 5000))])
  })
  await settle(page, 300)
}

// Adds a product in its first available size, raising the quantity to the stock limit when asked.
async function addFirstSize(page, path, toLimit = false) {
  await go(page, path)
  await page.locator('input[name="size"]:not(:disabled)').first().check({ force: true })
  if (toLimit) {
    const plus = page.getByRole('button', { name: /^Increase quantity/ })
    for (let i = 0; i < 10 && (await plus.isEnabled()); i++) await plus.click()
  }
  await page.getByRole('button', { name: 'Add to bag' }).click()
  await settle(page)
}

// Desktop: 1440 x 900 CSS px at 2x.
const desk = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' })
let p = await desk.newPage()

await go(p, '/')
await p.screenshot({ path: `${out}/d-home.png` })

await go(p, '/shop?size=L')
await p.screenshot({ path: `${out}/d-shop-size.png` })

await go(p, '/shop?q=zzz&size=XS')
await p.screenshot({ path: `${out}/d-shop-empty.png` })

await go(p, JUMPER)
await p.screenshot({ path: `${out}/d-product.png` })
await p.getByRole('button', { name: /size guide/i }).first().click()
await settle(p)
await p.locator('dialog[open]').screenshot({ path: `${out}/d-size-guide-cm.png` })
await p.locator('dialog[open]').getByText('Inches (in)').click()
await settle(p)
await p.locator('dialog[open]').screenshot({ path: `${out}/d-size-guide-in.png` })
await p.keyboard.press('Escape')
await settle(p)

await p.locator('input[name="size"][value="L"]').check({ force: true })
await p.getByRole('button', { name: 'Add to bag' }).click()
await settle(p)
await p.screenshot({ path: `${out}/d-added.png` })
await p.getByRole('button', { name: 'Continue shopping' }).click()

await addFirstSize(p, JACKET, true)
await go(p, '/bag')
await p.screenshot({ path: `${out}/d-bag.png` })
await desk.close()

// Phone: 390 x 844 CSS px at 2x.
const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' })
p = await phone.newPage()

await go(p, '/shop?size=L')
await p.screenshot({ path: `${out}/m-shop-size.png` })

await go(p, JUMPER)
await p.screenshot({ path: `${out}/m-product.png` })
// Add to bag with no size, from the fixed bottom bar: the page scrolls to the
// sizes and focuses the first available one.
await p.getByRole('button', { name: 'Add to bag' }).tap()
await settle(p, 900)
await p.screenshot({ path: `${out}/m-size-required.png` })

await p.locator('input[name="size"][value="L"]').check({ force: true })
await p.getByRole('button', { name: 'Add to bag' }).tap()
await settle(p)
await p.screenshot({ path: `${out}/m-added.png` })
await p.getByRole('button', { name: 'Continue shopping' }).tap()

await addFirstSize(p, JACKET, true)
await go(p, '/bag')
await p.screenshot({ path: `${out}/m-bag.png` })
await phone.close()

await browser.close()
console.log('Captured to', out)
