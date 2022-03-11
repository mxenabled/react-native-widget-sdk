import { dispatchPulseLocationChangeEvent, PulsePostMessageCallbackProps } from "@mxenabled/widget-post-message-definitions"

import { Type, SsoUrlProps, WidgetConfigurationProps } from "../sso"
import { WidgetStylingProps } from "./standard_props"

import { useWidgetRenderer } from "./renderer"

export type PulseWidgetProps =
  & SsoUrlProps
  & WidgetStylingProps
  & WidgetConfigurationProps
  & PulsePostMessageCallbackProps

export function PulseWidget(props: PulseWidgetProps) {
  return useWidgetRenderer(
    { ...props, widgetType: Type.PulseWidget },
    dispatchPulseLocationChangeEvent,
  )
}

export function MiniPulseCarouselWidget(props: PulseWidgetProps) {
  return useWidgetRenderer(
    { ...props, widgetType: Type.MiniPulseCarouselWidget },
    dispatchPulseLocationChangeEvent,
  )
}
