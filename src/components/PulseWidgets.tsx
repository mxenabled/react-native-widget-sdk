import { dispatchPulseLocationChangeEvent, PulsePostMessageCallbackProps } from "@mxenabled/widget-post-message-definitions"

import { Type, SsoUrlProps, WidgetConfigurationProps } from "../sso"
import { useWidgetRenderer, StylingProps } from "./renderer"

export type PulseWidgetProps =
  & SsoUrlProps
  & StylingProps
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
