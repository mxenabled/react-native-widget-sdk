import { Component, ErrorInfo, PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  onError?: (error: Error) => void
}>

type State = {
  errored: boolean
}

export default class TestingErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { errored: false }
  }

  static getDerivedStateFromError(_error: Error) {
    return { errored: true }
  }

  componentDidCatch(error: Error, _info: ErrorInfo) {
    this.props.onError?.(error)
  }

  render() {
    if (this.state.errored) {
      return null
    }

    return this.props.children
  }
}
