import { copyFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { mediaDir } from './paths.mjs'

/** True when the command line asks for the result to replace the published file. */
export const wantsPublish = () => process.argv.includes('--publish')

/** Copies a reviewed recording to public/projects/<project>/walkthrough.mp4. */
export function publish(project, mp4) {
  const dir = mediaDir(project)
  mkdirSync(dir, { recursive: true })
  const target = join(dir, 'walkthrough.mp4')
  copyFileSync(mp4, target)
  return target
}

export function report(project, result) {
  console.log(`${project}: ${result.seconds.toFixed(1)} s, ${result.frames} frames`)
  console.log(`  recording: ${result.mp4}`)
  if (wantsPublish()) console.log(`  published: ${publish(project, result.mp4)}`)
  else console.log('  Review it (see contact-sheet.mjs), then rerun with --publish to replace the published file.')
}
