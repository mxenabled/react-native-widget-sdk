import { WidgetLoadingProps, WidgetStylingProps, WidgetLoadUrlCallbackProps } from "./standard_props"
import { handlePulseRequest as handleRequest, PulseCallbackProps } from "../post_messages"
import { Type, WidgetOptionProps, widgetOptionsFromProps as optsFromProps } from "../widget/configuration"

import { useWidgetRenderer } from "./renderer"

export type PulseWidgetProps =
  & WidgetLoadingProps
  & WidgetStylingProps
  & WidgetLoadUrlCallbackProps
  & WidgetOptionProps
  & PulseCallbackProps

export function PulseWidget(props: PulseWidgetProps) {
  return useWidgetRenderer(
    Type.PulseWidget,
    props,
    optsFromProps,
    handleRequest,
  )
}
