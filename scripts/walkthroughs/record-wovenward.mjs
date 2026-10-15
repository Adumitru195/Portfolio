// Records the Wovenward shopping journey: filter by an available size, open a
// product, inspect its size guide, choose that size, add it to the bag and
// review the bag. The bag lives in browser storage; this run uses a throwaway
// browser context, so nothing persists afterwards.
//
// Start the Wovenward prototype first (see README), then from the project root:
//   node scripts/walkthroughs/record-wovenward.mjs [--publish]

import { join } from 'node:path'
import { createRecorder } from './lib/recorder.mjs'
import { OUTPUT, URLS } from './lib/paths.mjs'
import { report } from './lib/publish.mjs'

const outDir = join(OUTPUT, 'wovenward')
const r = await createRecorder({ viewport: { width: 1280, height: 800 }, outDir })
const { page } = r

try {
  await page.goto(`${URLS.wovenward}/shop`, { waitUntil: 'networkidle' })
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
  await page.reload({ waitUntil: 'networkidle' })
  await r.start()
  await r.pause(1300)

  // Filter by an available size: L leaves out pieces where L is sold out (12 → 10).
  await r.click(page.getByRole('checkbox', { name: 'L', exact: true }), { after: 1500 })

  // Open a product.
  const product = page.locator('main article').filter({ hasText: 'Mock-Neck Jumper' }).getByRole('link').first()
  await r.scrollTo(product, { block: 0.25 })
  await r.click(product, { after: 1400 })
  await page.getByRole('heading', { level: 1, name: 'Mock-Neck Jumper' }).waitFor()

  // Inspect its size guide.
  await r.click(page.getByRole('button', { name: 'Size guide' }), { after: 1200 })
  const dialog = page.getByRole('dialog')
  await dialog.waitFor()
  await r.moveTo(dialog, { offset: { x: 0.55, y: 0.6 } })
  await r.pause(1200)
  await r.scrollBy(260, { duration: 1000 })
  await r.pause(1400)
  await r.click(dialog.getByRole('button', { name: 'Close' }), { after: 800 })

  // Choose the size and add it to the bag.
  await r.click(page.getByRole('group', { name: 'Size' }).getByText('L', { exact: true }), { after: 900 })
  await r.click(page.getByRole('button', { name: 'Add to bag' }), { after: 1600 })

  // Review the selected item in the bag. The pointer rests in empty space below
  // the line item so its color, size and price stay readable.
  await r.click(page.getByRole('link', { name: 'View bag' }), { after: 1000 })
  await page.waitForURL(/\/bag/)
  await r.moveTo({ x: 560, y: 560 }, { duration: 800 })
  await r.pause(3000)
  report('wovenward', await r.stop())
} catch (err) {
  await page.screenshot({ path: join(outDir, 'failure.png') }).catch(() => {})
  await r.abort()
  throw err
}
