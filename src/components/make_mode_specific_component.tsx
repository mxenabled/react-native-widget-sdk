import { FunctionComponent } from "react"

export default function makeModeSpecificComponent<Props extends { mode?: unknown }>(mode: Props["mode"], Component: FunctionComponent<Props>, defaultProps?: Partial<Props>): FunctionComponent<Props> {
  function Widget(props: Props) {
    return <Component {...defaultProps} {...props} mode={mode} />
  }

  Widget.name = `${Component.name}(${mode})`

  return Widget
}
