import React, { FC } from "react"
import { dispatchWidgetLocationChangeEvent, WidgetPostMessageCallbackProps } from "@mxenabled/widget-post-message-definitions"

import { WidgetLoadingProps, WidgetStylingProps, WidgetLoadUrlCallbackProps } from "./standard_props"
import { Type, WidgetOptionProps, widgetOptionsFromProps as optsFromProps } from "../widget/configuration"

import { useWidgetRenderer } from "./renderer"

type Props =
  & WidgetLoadingProps
  & WidgetStylingProps
  & WidgetLoadUrlCallbackProps
  & WidgetOptionProps
  & WidgetPostMessageCallbackProps

export function makeBaseWidgetComponent(widgetType: Type): FC<Props> {
  return function Widget(props: Props) {
    return useWidgetRenderer(widgetType, props, optsFromProps, dispatchWidgetLocationChangeEvent)
  }
}

export function makeWidgetComponentWithDefaults<Props>(Component: FC<Props>, defaultProps?: Partial<Props>): FC<Props> {
  return function Widget(props: Props) {
    return <Component {...defaultProps} {...props} />
  }
}
