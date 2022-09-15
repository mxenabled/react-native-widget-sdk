import React, { FC } from "react"

import {
  dispatchWidgetLocationChangeEvent,
  WidgetPostMessageCallbackProps,
} from "@mxenabled/widget-post-message-definitions"

import { Type, SsoUrlProps, WidgetConfigurationProps } from "../sso"
import { useWidgetRenderer, StylingProps } from "./renderer"
import { SdkTelemetryProps } from "./telemetry"

export type Props = SsoUrlProps &
  StylingProps &
  SdkTelemetryProps &
  WidgetConfigurationProps &
  WidgetPostMessageCallbackProps<string>

export function makeBaseWidgetComponent(widgetType: Type): FC<Props> {
  return function Widget(props: Props) {
    return useWidgetRenderer({ ...props, widgetType }, dispatchWidgetLocationChangeEvent)
  }
}

export function makeWidgetComponentWithDefaults<Props>(
  Component: FC<Props>,
  defaultProps?: Partial<Props>,
): FC<Props> {
  return function Widget(props: Props) {
    return <Component {...defaultProps} {...props} />
  }
}
