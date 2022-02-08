import { FunctionComponent } from "react"

export function makeModeSpecificComponent<Props, Mode>(mode: Mode, Component: FunctionComponent<Props>): FunctionComponent<Props> {
  function Widget(props: Props) {
    return <Component {...props} mode={mode} />
  }

  Widget.name = `${Component.name}(${mode})`

  return Widget
}
