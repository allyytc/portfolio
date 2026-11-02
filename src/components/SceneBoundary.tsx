import { Component } from 'react'
import type { ReactNode } from 'react'

export default class SceneBoundary extends Component<{ children: ReactNode; onUnavailable?: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onUnavailable?.() }
  render() {
    if (this.state.failed) return <div className="scene-fallback" role="status"><strong>The studio couldn’t load.</strong><p>Browse every section in Studio Menu, or use Projects, Resume and Contact in the header.</p><button onClick={() => {
      void import('../studio/modelLoader').then(({ clearStudioModel }) => {
        clearStudioModel()
        this.setState({ failed: false })
      })
    }}>Try the studio again</button></div>
    return this.props.children
  }
}
