// Whether this browser can create a WebGL context. Checked once and cached.
// The probe context is released straight away so it doesn't count against
// the browser's context limit.
let cached: boolean | null = null

export function supportsWebGL(): boolean {
  if (cached !== null) return cached
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    cached = !!gl
  } catch {
    cached = false
  }
  return cached
}
