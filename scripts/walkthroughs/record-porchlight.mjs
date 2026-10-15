// Records the Porchlight rental journey: search, three filters, one home, then
// a demo tour request that ends on "Tour request received." with its
// "Pending confirmation" status. Nothing is booked; the prototype keeps
// requests in browser storage, and this run uses a throwaway browser context.
//
// Start the Porchlight prototype first (see README), then from the project root:
//   node scripts/walkthroughs/record-porchlight.mjs [--publish]

import { join } from 'node:path'
import { createRecorder } from './lib/recorder.mjs'
import { OUTPUT, URLS } from './lib/paths.mjs'
import { report } from './lib/publish.mjs'

const outDir = join(OUTPUT, 'porchlight')
const r = await createRecorder({ viewport: { width: 1280, height: 800 }, outDir })
const { page } = r

try {
  await page.goto(`${URLS.porchlight}/`, { waitUntil: 'networkidle' })
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'networkidle' })
  await r.start()
  await r.pause(1100)

  // Search for a rental.
  await r.type(page.getByRole('combobox', { name: 'Where would you like to live?' }), 'Charlotte')
  await r.pause(300)
  await r.click(page.getByRole('button', { name: 'Search', exact: true }), { after: 1100 })

  // Apply filters: 11 homes narrow to 3.
  await r.pick(page.getByRole('combobox', { name: 'Max monthly rent' }), { label: '$2,500/mo' })
  await r.pick(page.getByRole('combobox', { name: 'Bedrooms' }), { label: '2+ bedrooms' })
  await r.pick(page.getByRole('combobox', { name: 'Pets' }), { label: 'Dogs allowed' }, { after: 1300 })

  // Open a property.
  await r.click(page.getByRole('link', { name: 'Craftsman bungalow with a covered porch' }).first(), { after: 1300 })
  await r.scrollBy(380, { duration: 1100 })
  await r.pause(600)

  // Request a tour with demo details (example.com is a reserved domain).
  await r.click(page.getByRole('link', { name: 'Request a tour' }), { after: 1000 })
  await r.click(page.getByText('In-person tour', { exact: true }), { after: 400 })
  await r.click(page.getByRole('radio', { name: /Friday, October 16/ }), { after: 800 })
  await r.click(page.getByRole('group', { name: /^Time/ }).getByRole('radio').nth(2), { after: 800 })
  await r.click(page.getByRole('button', { name: 'Continue' }), { after: 1200 })
  await r.type(page.getByLabel('Full name'), 'Alex Demo')
  await r.type(page.getByLabel('Email'), 'alex@example.com')
  await r.click(page.getByRole('button', { name: 'Review request' }), { after: 1200 })

  // Review, then submit the request.
  const submit = page.getByRole('button', { name: 'Submit tour request' })
  await r.scrollTo(submit, { block: 0.6 })
  await r.pause(1000)
  await r.click(submit, { after: 400 })

  // End on the pending-confirmation summary, with the pointer clear of it.
  await page.getByRole('heading', { name: 'Tour request received.' }).waitFor()
  await r.pause(700)
  await r.moveTo({ x: 1180, y: 700 }, { duration: 700 })
  await r.pause(2000)
  report('porchlight', await r.stop())
} catch (err) {
  await page.screenshot({ path: join(outDir, 'failure.png') }).catch(() => {})
  await r.abort()
  throw err
}
