import { dispatchPulseLocationChangeEvent, PulsePostMessageCallbackProps } from "@mxenabled/widget-post-message-definitions"

import { WidgetLoadingProps, WidgetStylingProps, WidgetLoadUrlCallbackProps } from "./standard_props"
import { Type, WidgetOptionProps, widgetOptionsFromProps } from "../widget/configuration"

import { useWidgetRenderer } from "./renderer"

export type PulseWidgetProps =
  & WidgetLoadingProps
  & WidgetStylingProps
  & WidgetLoadUrlCallbackProps
  & WidgetOptionProps
  & PulsePostMessageCallbackProps

export function PulseWidget(props: PulseWidgetProps) {
  return useWidgetRenderer(
    Type.PulseWidget,
    props,
    widgetOptionsFromProps,
    dispatchPulseLocationChangeEvent,
  )
}

export function MiniPulseCarouselWidget(props: PulseWidgetProps) {
  return useWidgetRenderer(
    Type.MiniPulseCarouselWidget,
    props,
    widgetOptionsFromProps,
    dispatchPulseLocationChangeEvent,
  )
}
