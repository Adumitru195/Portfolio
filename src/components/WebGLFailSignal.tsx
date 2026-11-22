import { useEffect } from 'react'

/**
 * Rendered by a WebGLBoundary when a decorative scene throws or its chunk
 * fails to load: tells the owner to fall back to its static composition.
 */
export default function WebGLFailSignal({ onFail }: { onFail: () => void }) {
  useEffect(() => onFail(), [onFail])
  return null
}
