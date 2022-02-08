import { Component, ErrorInfo } from "react"

type Props = {
  onError?: (error: Error) => void
}

type State = {
  errored: boolean
}

export default class TestingErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { errored: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { errored: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error)
  }

  render() {
    if (this.state.errored) {
      return null
    }

    return this.props.children
  }
}

