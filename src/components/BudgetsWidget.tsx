import { WidgetLoadingProps, WidgetStylingProps, WidgetLoadUrlCallbackProps } from "./standard_props"
import { handleBaseRequest as handleRequest, BaseCallbackProps } from "../post_messages"
import { Type, WidgetOptionProps, widgetOptionsFromProps as optsFromProps } from "../widget/configuration"

import { useWidgetRenderer } from "./renderer"

export type BudgetsWidgetProps =
  & WidgetLoadingProps
  & WidgetStylingProps
  & WidgetLoadUrlCallbackProps
  & WidgetOptionProps
  & BaseCallbackProps

export function BudgetsWidget(props: BudgetsWidgetProps) {
  return useWidgetRenderer(
    Type.BudgetsWidget,
    props,
    optsFromProps,
    handleRequest,
  )
}
