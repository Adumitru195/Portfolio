// Regenerates a walkthrough poster (1600 × 1000 WebP) from a frame of the
// published video, or of a fresh recording with --from-output.
//
//   node scripts/walkthroughs/poster.mjs <project> [--at <seconds>] [--from-output]
//
// Defaults match the published posters: Porchlight and Wovenward use the first
// frame; Typography Systems uses 6.2 s (the Book 1 diagonal spread).

import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { ffmpeg } from './lib/ffmpeg.mjs'
import { OUTPUT, mediaDir } from './lib/paths.mjs'

const DEFAULT_AT = { porchlight: 0, wovenward: 0, 'typography-systems': 6.2 }

const [project] = process.argv.slice(2).filter((a) => !a.startsWith('--') && !/^\d/.test(a))
if (!project) {
  console.error('Usage: node scripts/walkthroughs/poster.mjs <project> [--at <seconds>] [--from-output]')
  process.exit(1)
}
const atIndex = process.argv.indexOf('--at')
const at = atIndex > -1 ? Number(process.argv[atIndex + 1]) : (DEFAULT_AT[project] ?? 0)
const source = process.argv.includes('--from-output')
  ? join(OUTPUT, project, 'walkthrough.mp4')
  : join(mediaDir(project), 'walkthrough.mp4')
if (!existsSync(source)) {
  console.error(`No video at ${source}`)
  process.exit(1)
}
const target = join(mediaDir(project), 'walkthrough-poster.webp')
ffmpeg([
  '-ss', String(at), '-i', source, '-frames:v', '1',
  '-vf', 'scale=1600:1000:flags=lanczos',
  '-c:v', 'libwebp', '-quality', '84', '-compression_level', '6',
  target,
])
console.log(`${project}: poster from ${at} s → ${target}`)
