/**
 * The visitor's own "Reduce motion" choice from the footer toggle, kept in
 * localStorage so it lasts between visits. It adds to the system
 * `prefers-reduced-motion` setting and never overrides it.
 *
 * While on, `<html data-reduce-motion>` is set so CSS animations and
 * transitions can stop too (see index.css).
 */

const STORAGE_KEY = 'portfolio-reduce-motion'
const listeners = new Set<() => void>()

function read(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'on'
  } catch {
    return false
  }
}

let reduce = read()

function applyToDocument() {
  if (reduce) document.documentElement.dataset.reduceMotion = ''
  else delete document.documentElement.dataset.reduceMotion
}
applyToDocument()

export function getUserReduceMotion() {
  return reduce
}

export function setUserReduceMotion(value: boolean) {
  reduce = value
  try {
    if (value) localStorage.setItem(STORAGE_KEY, 'on')
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage can be unavailable (private mode); the choice then lasts for
    // this page session only.
  }
  applyToDocument()
  listeners.forEach((listener) => listener())
}

export function subscribeUserReduceMotion(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
