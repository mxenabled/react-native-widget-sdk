import React, { FC } from "react"

import { WidgetLoadingProps, WidgetStylingProps, WidgetLoadUrlCallbackProps } from "./standard_props"
import { handleWidgetRequest as handleRequest, BaseCallbackProps } from "../post_messages"
import { Type, WidgetOptionProps, widgetOptionsFromProps as optsFromProps } from "../widget/configuration"

import { useWidgetRenderer } from "./renderer"

type Props =
  & WidgetLoadingProps
  & WidgetStylingProps
  & WidgetLoadUrlCallbackProps
  & WidgetOptionProps
  & BaseCallbackProps

export function makeBaseWidgetComponent(widgetType: Type): FC<Props> {
  return function Widget(props: Props) {
    return useWidgetRenderer(widgetType, props, optsFromProps, handleRequest)
  }
}

export function makeWidgetComponentWithDefaults<Props>(Component: FC<Props>, defaultProps?: Partial<Props>): FC<Props> {
  return function Widget(props: Props) {
    return <Component {...defaultProps} {...props} />
  }
}
