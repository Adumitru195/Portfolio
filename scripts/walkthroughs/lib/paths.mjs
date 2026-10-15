// Shared locations for the walkthrough tools. Everything defaults to paths
// inside this repository; each can be overridden with an environment variable.

import { resolve } from 'node:path'

export const ROOT = resolve(import.meta.dirname, '..', '..', '..')

/** Scratch output (frames, reviews, check reports). Ignored by git. */
export const OUTPUT = resolve(process.env.WALKTHROUGH_OUTPUT ?? resolve(ROOT, 'scripts', 'walkthroughs', '.output'))

/** Where a project's published walkthrough and poster live. */
export const mediaDir = (project) => resolve(ROOT, 'public', 'projects', project)

/** Local prototype servers. Ports avoid 5173, which the Porchlight repo uses by default. */
export const URLS = {
  porchlight: process.env.PORCHLIGHT_URL ?? 'http://localhost:5181',
  wovenward: process.env.WOVENWARD_URL ?? 'http://localhost:5190',
  portfolio: process.env.PORTFOLIO_URL ?? 'http://localhost:5200/Portfolio/',
}
