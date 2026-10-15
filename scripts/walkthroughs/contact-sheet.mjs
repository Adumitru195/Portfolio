// Tiles one frame per second of a video into a single image for review:
// pacing, pointer placement and how long the ending stays on screen.
//
//   node scripts/walkthroughs/contact-sheet.mjs <video.mp4> [seconds-between-frames]
//
// Writes <OUTPUT>/review/<video name>.png (OUTPUT defaults to scripts/walkthroughs/.output).

import { mkdirSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { ffmpeg } from './lib/ffmpeg.mjs'
import { OUTPUT } from './lib/paths.mjs'

const [video, every = '1'] = process.argv.slice(2)
if (!video) {
  console.error('Usage: node scripts/walkthroughs/contact-sheet.mjs <video.mp4> [seconds-between-frames]')
  process.exit(1)
}
const dir = join(OUTPUT, 'review')
mkdirSync(dir, { recursive: true })
const target = join(dir, `${basename(dirname(video))}-${basename(video, '.mp4')}.png`)
ffmpeg(['-i', video, '-vf', `fps=1/${every},scale=560:-2,tile=4x12:padding=6:color=white`, '-frames:v', '1', '-update', '1', target])
console.log(`Contact sheet (${every} s per tile, read left to right): ${target}`)
