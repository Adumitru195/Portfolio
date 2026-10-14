/**
 * Shared state between the homepage folder cards (HTML) and the decorative 3D
 * paper layer. Cards report where each preview sits inside the grid, whether
 * the folder is hovered, and the pointer position; the scene reads it each
 * frame and asks for more frames only while something is still moving.
 * Nothing here triggers React renders.
 */

export interface FolderSlot {
  /** Position and size of the preview, in CSS px relative to the grid. */
  x: number
  y: number
  w: number
  h: number
}

export interface FolderEntry {
  slot: FolderSlot | null
  hover: boolean
  /** Pointer position over the folder, -1..1 on each axis. */
  px: number
  py: number
}

const entries = new Map<string, FolderEntry>()
const listeners = new Set<() => void>()

function entry(id: string): FolderEntry {
  let current = entries.get(id)
  if (!current) {
    current = { slot: null, hover: false, px: 0, py: 0 }
    entries.set(id, current)
  }
  return current
}

function notify() {
  listeners.forEach((listener) => listener())
}

export const folderPaper = {
  get: entry,
  setSlot(id: string, slot: FolderSlot) {
    const current = entry(id)
    const previous = current.slot
    if (previous && previous.x === slot.x && previous.y === slot.y && previous.w === slot.w && previous.h === slot.h) return
    current.slot = slot
    notify()
  },
  setHover(id: string, hover: boolean) {
    const current = entry(id)
    current.hover = hover
    if (!hover) {
      current.px = 0
      current.py = 0
    }
    notify()
  },
  setPointer(id: string, px: number, py: number) {
    const current = entry(id)
    current.px = px
    current.py = py
    notify()
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}

/** Offset of an element inside a positioned ancestor, ignoring CSS transforms. */
export function offsetWithin(element: HTMLElement, ancestor: HTMLElement): FolderSlot {
  let x = 0
  let y = 0
  let node: HTMLElement | null = element
  while (node && node !== ancestor) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return { x, y, w: element.offsetWidth, h: element.offsetHeight }
}
