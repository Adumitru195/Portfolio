// Walkthrough recorder: sharp CDP screencast frames, a visible synthetic
// pointer with eased paths, and an H.264 encode that keeps the real timing of
// every frame (ffmpeg's concat demuxer with per-frame durations).
//
// Headless Chromium draws no cursor, so a small arrow is injected into the
// page and follows mouse events; a soft ring marks each press. It is a
// recording aid only and never touches the prototype's own code.

import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from 'playwright'
import { ffmpeg } from './ffmpeg.mjs'

const CURSOR_SCRIPT = `
(() => {
  if (window.__walkthroughCursor) return;
  window.__walkthroughCursor = true;
  const svgNS = 'http://www.w3.org/2000/svg';
  const install = () => {
    const cursor = document.createElement('div');
    cursor.setAttribute('aria-hidden', 'true');
    cursor.style.cssText = 'position:fixed;left:0;top:0;width:24px;height:24px;z-index:2147483647;pointer-events:none;transform:translate(-100px,-100px);will-change:transform';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('viewBox', '0 0 24 24');
    const arrow = document.createElementNS(svgNS, 'path');
    arrow.setAttribute('d', 'M4 2.5 L4 19 L8.4 15 L11.3 21.6 L14.2 20.3 L11.4 13.9 L17.6 13.6 Z');
    arrow.setAttribute('fill', '#111');
    arrow.setAttribute('stroke', '#fff');
    arrow.setAttribute('stroke-width', '1.6');
    arrow.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(arrow);
    cursor.appendChild(svg);
    const ring = document.createElement('div');
    ring.setAttribute('aria-hidden', 'true');
    ring.style.cssText = 'position:fixed;left:0;top:0;width:36px;height:36px;margin:-18px 0 0 -18px;border-radius:50%;border:2px solid rgba(17,17,17,0.55);background:rgba(255,255,255,0.18);z-index:2147483646;pointer-events:none;opacity:0;transform:translate(-100px,-100px) scale(0.6)';
    document.documentElement.appendChild(ring);
    document.documentElement.appendChild(cursor);
    let x = -100, y = -100;
    document.addEventListener('mousemove', (e) => {
      x = e.clientX; y = e.clientY;
      cursor.style.transform = 'translate(' + (x - 4) + 'px,' + (y - 2) + 'px)';
    }, true);
    document.addEventListener('mousedown', () => {
      ring.style.transition = 'none';
      ring.style.opacity = '1';
      ring.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(0.6)';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        ring.style.transition = 'opacity 420ms ease, transform 420ms ease';
        ring.style.opacity = '0';
        ring.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(1.15)';
      }));
    }, true);
  };
  if (document.documentElement) install();
  else document.addEventListener('DOMContentLoaded', install);
})();
`

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

/**
 * Opens a fresh, throwaway browser context (no saved profile, so nothing a
 * demo writes to storage outlives the run) and returns pointer helpers.
 */
export async function createRecorder({ viewport, scale = 1.5, timezoneId = 'America/New_York', outDir }) {
  rmSync(outDir, { recursive: true, force: true })
  mkdirSync(outDir, { recursive: true })
  // Screencast frames ignore deviceScaleFactor unless the scale is also forced
  // at launch; the full Chromium build (not the headless shell) honors it.
  const browser = await chromium.launch({ channel: 'chromium', args: [`--force-device-scale-factor=${scale}`] })
  const context = await browser.newContext({ viewport, deviceScaleFactor: scale, timezoneId, locale: 'en-US' })
  await context.addInitScript(CURSOR_SCRIPT)
  const page = await context.newPage()
  let pos = { x: viewport.width * 0.62, y: viewport.height * 0.55 }
  const frames = []
  let session = null
  let recording = false

  const api = {
    page,
    async start() {
      session = await context.newCDPSession(page)
      session.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
        if (recording) frames.push({ t: metadata.timestamp, data })
        try {
          await session.send('Page.screencastFrameAck', { sessionId })
        } catch {
          // The session closes with the browser at the end of a run.
        }
      })
      recording = true
      await session.send('Page.startScreencast', {
        format: 'jpeg',
        quality: 94,
        maxWidth: Math.round(viewport.width * scale),
        maxHeight: Math.round(viewport.height * scale),
        everyNthFrame: 1,
      })
      await page.mouse.move(pos.x, pos.y)
      // A one-pixel nudge guarantees a first frame even on a static page.
      await page.mouse.move(pos.x + 1, pos.y)
      pos.x += 1
    },
    /** Moves the pointer on a gentle arc to a locator (or {x, y}). */
    async moveTo(target, { duration, offset = { x: 0.5, y: 0.5 } } = {}) {
      let to
      if (typeof target.x === 'number') to = target
      else {
        await target.scrollIntoViewIfNeeded()
        const box = await target.boundingBox()
        if (!box) throw new Error('No bounding box for target')
        to = { x: box.x + box.width * offset.x, y: box.y + box.height * offset.y }
      }
      const dist = Math.hypot(to.x - pos.x, to.y - pos.y)
      const ms = duration ?? Math.min(900, Math.max(320, dist * 0.8))
      const steps = Math.max(10, Math.round(ms / 22))
      const from = { ...pos }
      const bend = Math.min(60, dist * 0.08)
      const nx = -(to.y - from.y) / (dist || 1)
      const ny = (to.x - from.x) / (dist || 1)
      for (let i = 1; i <= steps; i++) {
        const t = ease(i / steps)
        const arc = Math.sin(Math.PI * t) * bend
        await page.mouse.move(from.x + (to.x - from.x) * t + nx * arc, from.y + (to.y - from.y) * t + ny * arc)
        await sleep(Math.max(0, ms / steps - 6))
      }
      pos = to
    },
    async click(target, opts = {}) {
      await api.moveTo(target, opts)
      await sleep(opts.hover ?? 180)
      await page.mouse.down()
      await sleep(90)
      await page.mouse.up()
      await sleep(opts.after ?? 500)
    },
    // Native <select> popups are drawn outside the page and never reach the
    // screencast, so show the press ring and set the option directly.
    async pick(select, option, opts = {}) {
      await api.moveTo(select, opts)
      await sleep(280)
      await page.evaluate(() => document.dispatchEvent(new MouseEvent('mousedown')))
      await sleep(160)
      await select.selectOption(option)
      await sleep(opts.after ?? 900)
    },
    async type(target, text, { delay = 45 } = {}) {
      await api.click(target, { after: 250 })
      for (const ch of text) {
        await page.keyboard.type(ch)
        await sleep(delay + Math.random() * 25)
      }
    },
    async scrollBy(dy, { duration = 1200 } = {}) {
      const steps = Math.max(10, Math.round(duration / 22))
      let done = 0
      for (let i = 1; i <= steps; i++) {
        const target = Math.round(dy * ease(i / steps))
        await page.mouse.wheel(0, target - done)
        done = target
        await sleep(duration / steps)
      }
      await sleep(250)
    },
    async scrollTo(locator, { block = 0.3, duration } = {}) {
      const box = await locator.boundingBox()
      const dy = box.y - viewport.height * block
      await api.scrollBy(dy, { duration: duration ?? Math.min(1800, Math.max(700, Math.abs(dy) * 1.1)) })
    },
    pause: sleep,
    /** Stops capture and encodes `<outDir>/walkthrough.mp4`. */
    async stop() {
      await sleep(200)
      recording = false
      await session.send('Page.stopScreencast')
      const end = Date.now() / 1000
      await browser.close()
      return encode(frames, end, outDir)
    },
    async abort() {
      await browser.close()
    },
  }
  return api
}

function encode(frames, endTime, outDir) {
  if (frames.length < 2) throw new Error('Too few frames captured')
  const dir = join(outDir, 'frames')
  mkdirSync(dir, { recursive: true })
  const name = (i) => join(dir, `f${String(i).padStart(5, '0')}.jpg`).replace(/\\/g, '/')
  const lines = []
  frames.forEach((frame, i) => {
    writeFileSync(name(i), Buffer.from(frame.data, 'base64'))
    const next = i + 1 < frames.length ? frames[i + 1].t : endTime
    lines.push(`file '${name(i)}'`, `duration ${Math.max(0.001, next - frame.t).toFixed(4)}`)
  })
  // The concat demuxer only honors the last duration when the file repeats;
  // -t then trims the repeat so the final hold isn't doubled.
  lines.push(`file '${name(frames.length - 1)}'`)
  const list = join(outDir, 'frames.txt')
  writeFileSync(list, lines.join('\n'))
  const seconds = endTime - frames[0].t
  const mp4 = join(outDir, 'walkthrough.mp4')
  ffmpeg([
    '-f', 'concat', '-safe', '0', '-i', list,
    '-t', seconds.toFixed(3),
    // JPEG frames are full range; convert to TV range so every player shows the same colors.
    '-vf', 'fps=30,scale=trunc(iw/2)*2:trunc(ih/2)*2:in_range=pc:out_range=tv,format=yuv420p',
    '-color_range', 'tv',
    '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '21',
    '-movflags', '+faststart', '-an',
    mp4,
  ])
  return { mp4, frames: frames.length, seconds }
}
