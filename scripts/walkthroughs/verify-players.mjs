// Checks every case-study video player in Chromium and WebKit against the
// running portfolio dev server (PORTFOLIO_URL, default http://localhost:5200/Portfolio/).
//
//   node scripts/walkthroughs/verify-players.mjs [chromium|webkit]
//
// Covers: no autoplay and no media download before play, labeled play / pause /
// replay, seeking and the time readout, fullscreen entry and exit (position
// kept, object-fit: contain), keyboard focus, mobile overflow, the load-error
// and no-fullscreen fallbacks, and a temporary portrait video (generated into
// the output folder, injected in the browser only, never published).
// Screenshots and results-<engine>.json go to <OUTPUT>/verify.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { join } from 'node:path'
import { chromium, webkit } from 'playwright'
import { ffmpeg } from './lib/ffmpeg.mjs'
import { OUTPUT, URLS } from './lib/paths.mjs'

const BASE = `${URLS.portfolio.replace(/\/?$/, '/')}#/project/`
const PAGES = [
  { id: 'afterglow-cinema', label: 'motion demo' },
  { id: 'porchlight', label: 'rental journey walkthrough' },
  { id: 'wovenward', label: 'shopping walkthrough' },
  { id: 'typography-systems', label: 'publication walkthrough' },
]
const OUT = join(OUTPUT, 'verify')
mkdirSync(OUT, { recursive: true })

const results = []
const log = (engine, id, check, ok, detail = '') => {
  results.push({ engine, id, check, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'} [${engine}] ${id}: ${check}${detail ? ` (${detail})` : ''}`)
}
const firstLine = (e) => String(e?.message ?? e).split('\n')[0]

/** A 4 s, 720 × 1280 test pattern with a frame border, so cropping would show. */
function portraitTestVideo() {
  const file = join(OUTPUT, 'portrait-test', 'portrait-test.mp4')
  if (!existsSync(file)) {
    mkdirSync(join(OUTPUT, 'portrait-test'), { recursive: true })
    ffmpeg([
      '-f', 'lavfi', '-i', 'testsrc2=size=720x1280:rate=30:duration=4',
      '-vf', 'drawbox=x=0:y=0:w=iw:h=ih:color=red:t=24',
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', file,
    ])
  }
  return readFileSync(file)
}

/**
 * Serves the portrait clip from a throwaway local server with byte-range
 * support. Playwright's WebKit won't play blob: or data: media, and the clip
 * must never be copied into public/.
 */
function serveClip(bytes) {
  const server = createServer((req, res) => {
    const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range ?? '')
    const start = range && range[1] ? Number(range[1]) : 0
    const end = range && range[2] ? Number(range[2]) : bytes.length - 1
    res.writeHead(range ? 206 : 200, {
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
      ...(range ? { 'Content-Range': `bytes ${start}-${end}/${bytes.length}` } : {}),
    })
    res.end(bytes.subarray(start, end + 1))
  })
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)))
}

async function openPage(browser, id, viewport, opts = {}) {
  const context = await browser.newContext({ viewport, ...(opts.context ?? {}) })
  if (opts.init) await context.addInitScript(opts.init)
  const page = await context.newPage()
  page.setDefaultTimeout(12000)
  const media = []
  page.on('request', (r) => {
    if (/\.(mp4|webm)(\?|$)/.test(r.url())) media.push(r.url())
  })
  await page.goto(BASE + id, { waitUntil: 'networkidle' })
  return { context, page, media }
}

async function scrollToVideo(page) {
  const video = page.locator('figure video').first()
  await video.scrollIntoViewIfNeeded()
  await page.waitForTimeout(700)
  return video
}

const fullscreenState = (page) =>
  page.evaluate(() => {
    const el = document.fullscreenElement || document.webkitFullscreenElement
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { tag: el.tagName, w: r.width, h: r.height, fit: getComputedStyle(el).objectFit, vw: innerWidth, vh: innerHeight }
  })

const exitFullscreen = (page) =>
  page.evaluate(() => (document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen()))

async function desktop(engine, browser, { id, label }) {
  const { context, page, media } = await openPage(browser, id, { width: 1440, height: 900 })
  const video = await scrollToVideo(page)
  await page.waitForTimeout(800)
  log(engine, id, 'no media requested before play', media.length === 0, media.join(', '))
  const attrs = await video.evaluate((v) => ({
    autoplay: v.autoplay,
    preload: v.getAttribute('preload'),
    playsInline: v.playsInline,
    controls: v.controls,
    paused: v.paused,
    poster: !!v.poster,
    ratio: v.getBoundingClientRect().width / v.getBoundingClientRect().height,
  }))
  log(engine, id, 'no autoplay, preload none, playsInline, poster; native controls wait for first play',
    !attrs.autoplay && attrs.preload === 'none' && attrs.playsInline && !attrs.controls && attrs.paused && attrs.poster,
    JSON.stringify(attrs))
  log(engine, id, 'player keeps 16:10 before load', Math.abs(attrs.ratio - 1.6) < 0.02, attrs.ratio.toFixed(3))
  await page.locator('figure:has(video)').first().screenshot({ path: join(OUT, `${engine}-${id}-desktop.png`) })

  // Keyboard: focus the labeled play button and press Enter.
  const playBtn = page.getByRole('button', { name: `Play ${label}` })
  await playBtn.focus()
  const ring = await playBtn.evaluate((b) => getComputedStyle(b).boxShadow)
  log(engine, id, 'play button shows a focus ring', ring !== 'none', ring.slice(0, 60))
  await page.keyboard.press('Enter')
  await page
    .waitForFunction(() => {
      const v = document.querySelector('figure video')
      return v && !v.paused && v.currentTime > 0.8
    }, null, { timeout: 15000 })
    .then(() => log(engine, id, 'Enter on Play starts playback', true))
    .catch((e) => log(engine, id, 'Enter on Play starts playback', false, firstLine(e)))
  log(engine, id, 'native controls shown once playing', await video.evaluate((v) => v.controls))
  await page.getByRole('button', { name: `Pause ${label}` }).click()
  log(engine, id, 'Pause button pauses', await video.evaluate((v) => v.paused))

  // Seek as the native scrubber does and check the readout follows.
  await video.evaluate((v) => new Promise((resolve) => {
    v.addEventListener('seeked', resolve, { once: true })
    v.currentTime = 10
    setTimeout(resolve, 3000)
  }))
  await page.waitForTimeout(300)
  const readout = await page.locator('figure p.tabular-nums').first().innerText()
  log(engine, id, 'seeking updates elapsed / duration', /0:10[\s\S]*0:\d\d/.test(readout), readout.replace(/\s+/g, ' '))

  // Fullscreen from the labeled button, then exit; the position must be kept.
  const before = await video.evaluate((v) => v.currentTime)
  const fsBtn = page.getByRole('button', { name: /^View fullscreen/ })
  if (!(await fsBtn.isVisible())) {
    log(engine, id, 'no fullscreen API here, so Open video is offered instead', await page.getByRole('link', { name: /^Open video/ }).isVisible())
  } else {
    await fsBtn.click()
    await page.waitForTimeout(800)
    const fs = await fullscreenState(page)
    log(engine, id, 'fullscreen opens on the video element', fs?.tag === 'VIDEO', JSON.stringify(fs))
    if (fs) {
      log(engine, id, 'fullscreen fills the screen with object-fit: contain (no cropping)',
        fs.fit === 'contain' && Math.abs(fs.w - fs.vw) < 2 && Math.abs(fs.h - fs.vh) < 2, fs.fit)
      await page.screenshot({ path: join(OUT, `${engine}-${id}-fullscreen.png`) })
      await exitFullscreen(page)
      await page.waitForTimeout(600)
    }
    const after = await video.evaluate((v) => v.currentTime)
    log(engine, id, 'exiting fullscreen keeps the playback position', Math.abs(after - before) < 0.05, `${before.toFixed(2)} → ${after.toFixed(2)}`)
  }

  // Replay: jump near the end, let it finish, then replay from the start.
  const duration = await video.evaluate((v) => v.duration)
  await page.getByRole('button', { name: `Play ${label}` }).click()
  await page.waitForTimeout(500)
  await video.evaluate((v) => {
    v.currentTime = v.duration - 0.6
  })
  await page.waitForFunction(() => document.querySelector('figure video').ended, null, { timeout: 10000 }).catch(() => {})
  // WebKit fires `ended` a moment after the last frame, so wait for the label.
  const replay = page.getByRole('button', { name: `Replay ${label}` })
  const hasReplay = await replay.waitFor({ timeout: 6000 }).then(() => true).catch(() => false)
  log(engine, id, 'ended state offers Replay', hasReplay, `duration ${duration.toFixed(1)} s`)
  if (hasReplay) {
    await replay.click()
    await page.waitForTimeout(700)
    const t = await video.evaluate((v) => ({ t: v.currentTime, paused: v.paused }))
    log(engine, id, 'Replay restarts from the beginning', !t.paused && t.t < 2, JSON.stringify(t))
    await video.evaluate((v) => v.pause())
  }
  await context.close()
}

async function mobile(engine, browser, { id }) {
  const { context, page } = await openPage(browser, id, { width: 390, height: 844 }, {
    context: { isMobile: engine === 'chromium', hasTouch: true },
  })
  await scrollToVideo(page)
  const m = await page.evaluate(() => {
    const v = document.querySelector('figure video').getBoundingClientRect()
    return { overflow: document.documentElement.scrollWidth - innerWidth, left: v.left, right: innerWidth - v.right, w: v.width, h: v.height }
  })
  log(engine, id, 'mobile: no horizontal scroll, player inside the 16 px gutter', m.overflow <= 0 && m.left >= 15 && m.right >= 15, JSON.stringify(m))
  await page.locator('figure:has(video)').first().screenshot({ path: join(OUT, `${engine}-${id}-mobile.png`) })
  await context.close()
}

async function loadError(engine, browser, { id, label }) {
  // Request interception doesn't reach WebKit's media loader, so point every
  // source at a missing file instead.
  const { context, page } = await openPage(browser, id, { width: 1280, height: 800 })
  await scrollToVideo(page)
  await page.evaluate(() => {
    const v = document.querySelector('figure video')
    v.querySelectorAll('source').forEach((s, i) => {
      s.src = `/Portfolio/projects/missing-${i}.mp4`
    })
    v.load()
  })
  const play = page.getByRole('button', { name: `Play ${label}` })
  await page.waitForTimeout(1500)
  if (await play.isEnabled()) await play.click({ timeout: 3000 }).catch(() => {})
  // Errors normally arrive at once; a stalled load falls back after 12 s.
  const notice = page.locator('figure:has(video) figcaption [role="alert"], figure:has(video) figcaption [role="status"]')
  const ok = await notice.first().waitFor({ timeout: 16000 }).then(() => true).catch(() => false)
  const open = page.getByRole('link', { name: /^Open video/ })
  log(engine, id, 'failed load disables Play', !(await play.isEnabled()))
  log(engine, id, 'failed load shows a message and an Open video link', ok && (await open.isVisible()),
    ok ? `${(await notice.first().innerText()).slice(0, 48)}… → ${await open.getAttribute('href')}` : 'no notice')
  await page.locator('figure:has(video)').first().screenshot({ path: join(OUT, `${engine}-${id}-error.png`) })
  await context.close()
}

async function noFullscreen(engine, browser, { id }) {
  const init = () => {
    Object.defineProperty(Document.prototype, 'fullscreenEnabled', { get: () => false })
    Object.defineProperty(Document.prototype, 'webkitFullscreenEnabled', { get: () => false })
    delete HTMLMediaElement.prototype.webkitEnterFullscreen
    delete HTMLVideoElement.prototype.webkitEnterFullscreen
  }
  const { context, page } = await openPage(browser, id, { width: 1280, height: 800 }, { init })
  await scrollToVideo(page)
  const button = await page.getByRole('button', { name: /^View fullscreen/ }).count()
  const link = await page.getByRole('link', { name: /^Open video/ }).count()
  log(engine, id, 'without fullscreen support, Open video replaces the button', button === 0 && link === 1, `button ${button}, link ${link}`)
  await context.close()
}

/** Swaps a temporary portrait clip into one player (in the page only) and checks its proportions. */
async function portrait(engine, browser, clipUrl) {
  const id = 'porchlight'
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const tag = `portrait ${viewport.width}px`
    const { context, page } = await openPage(browser, id, viewport)
    const video = await scrollToVideo(page)
    await page.evaluate((url) => {
      const v = document.querySelector('figure video')
      v.removeAttribute('poster')
      // A portrait entry would carry portrait poster dimensions.
      v.setAttribute('width', '720')
      v.setAttribute('height', '1280')
      // Point the existing source at the clip; removing <source> elements makes
      // WebKit report a source error, which the player rightly treats as a failure.
      v.querySelectorAll('source').forEach((s) => {
        s.src = url
      })
      v.load()
    }, clipUrl)
    await page.getByRole('button', { name: /^Play / }).click()
    await page.waitForFunction(() => document.querySelector('figure video').readyState >= 2, null, { timeout: 10000 })
    await video.evaluate((v) => v.pause())
    const shape = await video.evaluate((v) => {
      const r = v.getBoundingClientRect()
      const scale = Math.min(r.width / v.videoWidth, r.height / v.videoHeight)
      return {
        intrinsic: `${v.videoWidth}x${v.videoHeight}`,
        // Playwright's WebKit reports videoWidth/Height at display size, so compare shape, not pixels.
        ratio: +(v.videoWidth / v.videoHeight).toFixed(3),
        box: `${Math.round(r.width)}x${Math.round(r.height)}`,
        shown: `${Math.round(v.videoWidth * scale)}x${Math.round(v.videoHeight * scale)}`,
        fit: getComputedStyle(v).objectFit,
        tallerThanWide: r.height > r.width || v.videoHeight * scale > v.videoWidth * scale,
        fitsViewport: r.bottom - r.top <= innerHeight,
      }
    })
    log(engine, 'portrait-test', `${tag}: stays portrait, uncropped (contain), fits the screen`,
      Math.abs(shape.ratio - 720 / 1280) < 0.01 && shape.fit === 'contain' && shape.tallerThanWide && shape.fitsViewport, JSON.stringify(shape))
    await page.locator('figure:has(video)').first().screenshot({ path: join(OUT, `${engine}-portrait-${viewport.width}.png`) })
    const fsBtn = page.getByRole('button', { name: /^View fullscreen/ })
    if (viewport.width > 1000 && (await fsBtn.isVisible())) {
      await fsBtn.click()
      await page.waitForTimeout(800)
      const fs = await fullscreenState(page)
      log(engine, 'portrait-test', 'portrait fullscreen: full screen box, object-fit contain (pillarboxed, not cropped)',
        fs?.tag === 'VIDEO' && fs.fit === 'contain' && Math.abs(fs.h - fs.vh) < 2, JSON.stringify(fs))
      await page.screenshot({ path: join(OUT, `${engine}-portrait-fullscreen.png`) })
      await exitFullscreen(page)
    }
    await context.close()
  }
}

async function run(engine, browserType) {
  const browser = await browserType.launch()
  for (const entry of PAGES) {
    for (const check of [desktop, mobile, loadError, noFullscreen]) {
      try {
        await check(engine, browser, entry)
      } catch (e) {
        log(engine, entry.id, `${check.name} threw`, false, firstLine(e))
      }
    }
  }
  const server = await serveClip(portraitTestVideo())
  try {
    await portrait(engine, browser, `http://127.0.0.1:${server.address().port}/portrait-test.mp4`)
  } catch (e) {
    log(engine, 'portrait-test', 'portrait check threw', false, firstLine(e))
  } finally {
    server.close()
  }
  await browser.close()
}

const only = process.argv[2]
if (!only || only === 'chromium') await run('chromium', chromium)
if (!only || only === 'webkit') await run('webkit', webkit)
const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
writeFileSync(join(OUT, `results-${only ?? 'all'}.json`), JSON.stringify(results, null, 2))
process.exitCode = failed.length ? 1 : 0
