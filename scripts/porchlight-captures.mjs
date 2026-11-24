// Captures authentic Porchlight prototype screens for the case study.
//
// Every image comes from the working prototype (UX Projects/Porchlight), not
// from a mock-up. Listings, prices and availability are the prototype's
// fictional sample data; the tour request uses a demo name and an example.com
// address and stays in the browser (the prototype has no backend).
//
// Run the prototype, then this script, with Playwright installed without
// adding it to package.json:
//   cd "../Porchlight" && npx vite --port 5181          (in one terminal)
//   npm i --no-save playwright@1.48.2 && npx playwright install chromium
//   node scripts/porchlight-captures.mjs [prototype-url]
//
// Writes PNG captures (2x) to scripts/.porchlight-captures/. Run
// scripts/porchlight-case-study-assets.py next: it converts them to WebP in
// public/projects/porchlight/ and then deletes this temporary folder.

import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const base = process.argv[2] ?? 'http://localhost:5181'
const out = resolve(import.meta.dirname, '.porchlight-captures')
mkdirSync(out, { recursive: true })

let chromium
try {
  ;({ chromium } = await import('playwright'))
} catch {
  console.error('Playwright is not installed. See the instructions at the top of this file.')
  process.exit(1)
}

// Prefer installed Microsoft Edge when Playwright's Chromium isn't downloaded.
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined }).catch(() => chromium.launch({ channel: 'msedge' }))
const settle = (page) => page.waitForTimeout(700)
const LISTING = '/homes/plaza-midwood-bungalow'

// Phone captures: 390 x 844 CSS px at 2x.
const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' })
const p = await phone.newPage()

await p.goto(base + '/homes?maxRent=2500&beds=2&pets=dogs', { waitUntil: 'networkidle' })
await settle(p)
await p.screenshot({ path: `${out}/mobile-search.png` })

await p.goto(base + LISTING, { waitUntil: 'networkidle' })
await settle(p)
await p.screenshot({ path: `${out}/mobile-listing.png` })

// The move-in costs section on its own, with the sticky action bar hidden so it
// doesn't cover the list in an element capture.
await p.addStyleTag({ content: '.mobile-action-bar, [class*="action-bar"]{visibility:hidden!important}' })
const fees = p.locator('section[aria-labelledby="fees-heading"], #fees-heading >> xpath=ancestor::section[1]').first()
await fees.scrollIntoViewIfNeeded()
await settle(p)
await fees.screenshot({ path: `${out}/mobile-costs.png` })

// Tour request: step 1, then review, then the confirmation.
await p.goto(base + LISTING + '/tour', { waitUntil: 'networkidle' })
await settle(p)
await p.evaluate(() => window.scrollTo(0, 0))
await settle(p)
await p.screenshot({ path: `${out}/mobile-tour-step1.png` })
await p.locator('.choice-card').first().click()
await p.locator('.date-chip').nth(2).click()
await p.locator('.time-chip').nth(1).click()
await p.getByRole('button', { name: 'Continue' }).click()
await settle(p)
await p.getByLabel('Full name').fill('Demo Renter')
await p.getByLabel('Email').fill('demo.renter@example.com')
await p.getByRole('button', { name: 'Review request' }).click()
await settle(p)
await p.evaluate(() => window.scrollTo(0, 0))
await settle(p)
await p.screenshot({ path: `${out}/mobile-tour-review.png` })
// The demo disclosure shown before submitting, as its own image.
const notice = p.getByText('Before you submit').locator('xpath=ancestor::*[contains(@class,"notice") or contains(@class,"callout") or self::aside][1]')
const target = (await notice.count()) ? notice.first() : p.getByText('Before you submit').locator('xpath=../..')
await target.scrollIntoViewIfNeeded()
await settle(p)
await target.screenshot({ path: `${out}/mobile-tour-disclosure.png` })
await p.getByRole('button', { name: 'Submit tour request' }).click()
await p.waitForURL(/\/tours\//)
await settle(p)
await p.evaluate(() => window.scrollTo(0, 0))
await settle(p)
await p.screenshot({ path: `${out}/mobile-confirmation.png` })
await phone.close()


await browser.close()
console.log('Captured to', out)
