import React, { FunctionComponent } from "react"

export function makeComponentWithDefaults<Props>(Component: FunctionComponent<Props>, defaultProps?: Partial<Props>): FunctionComponent<Props> {
  return function Widget(props: Props) {
    return <Component {...defaultProps} {...props} />
  }
}
