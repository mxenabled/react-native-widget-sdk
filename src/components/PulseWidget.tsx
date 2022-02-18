import { WidgetLoadingProps, WidgetStylingProps, WidgetLoadUrlCallbackProps } from "./standard_props"
import { handlePulseRequest as handleRequest, PulseCallbackProps } from "../post_messages"
import { Type, WidgetOptionProps, widgetOptionsFromProps as optsFromProps } from "../widget/configuration"

import { useWidgetRenderer } from "./renderer"

export type PulseWidgetProps =
  & WidgetLoadingProps
  & WidgetStylingProps
  & WidgetLoadUrlCallbackProps
  & PulseCallbackProps
  & WidgetOptionProps

export function PulseWidget(props: PulseWidgetProps) {
  const [_, elem] = useWidgetRenderer(
    Type.PulseWidget,
    props,
    optsFromProps,
    handleRequest,
  )

  return elem
}
