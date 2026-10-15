// Finds an ffmpeg build with libx264 and libwebp: FFMPEG_PATH, then `ffmpeg`
// on PATH, then the binary bundled with the Python package imageio-ffmpeg.

import { execFileSync, spawnSync } from 'node:child_process'

let cached

export function ffmpegPath() {
  if (cached) return cached
  const candidates = []
  if (process.env.FFMPEG_PATH) candidates.push(process.env.FFMPEG_PATH)
  candidates.push('ffmpeg')
  for (const bin of candidates) {
    if (spawnSync(bin, ['-version'], { stdio: 'ignore' }).status === 0) return (cached = bin)
  }
  for (const python of ['python', 'python3', 'py']) {
    try {
      const bin = execFileSync(python, ['-I', '-c', 'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim()
      if (bin) return (cached = bin)
    } catch {
      // Try the next interpreter name.
    }
  }
  throw new Error('ffmpeg not found. Set FFMPEG_PATH, put ffmpeg on PATH, or run `pip install imageio-ffmpeg`.')
}

export function ffmpeg(args) {
  execFileSync(ffmpegPath(), ['-y', '-hide_banner', '-loglevel', 'error', ...args], { stdio: 'inherit' })
}
