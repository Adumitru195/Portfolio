import { Component } from 'react'
import type { ReactNode } from 'react'

interface WebGLBoundaryProps {
  fallback: ReactNode
  children: ReactNode
}

interface WebGLBoundaryState {
  failed: boolean
}

/**
 * Contains failures from decorative WebGL layers: a renderer that can't be
 * created, a chunk that fails to load, or an error thrown while rendering.
 * The fallback renders instead, so the rest of the page is never affected.
 */
export default class WebGLBoundary extends Component<WebGLBoundaryProps, WebGLBoundaryState> {
  state: WebGLBoundaryState = { failed: false }

  static getDerivedStateFromError(): WebGLBoundaryState {
    return { failed: true }
  }

  componentDidCatch() {
    // Decorative layer only: the fallback already covers the failure.
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
