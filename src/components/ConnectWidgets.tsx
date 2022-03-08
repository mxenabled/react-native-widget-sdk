import { dispatchConnectLocationChangeEvent, ConnectPostMessageCallbackProps } from "@mxenabled/widget-post-message-definitions"

import { WidgetLoadingProps, WidgetStylingProps, WidgetLoadUrlCallbackProps } from "./standard_props"
import { Type, ConnectWidgetOptionProps, connectWidgetOptionsFromProps as optsFromProps } from "../widget/configuration"

import { makeDefaultConnectOnOAuthRequested } from "./oauth"
import { makeWidgetComponentWithDefaults } from "./make_component"
import { useOAuthDeeplink } from "./oauth"
import { useWidgetRendererWithRef } from "./renderer"

export type ConnectWidgetProps =
  & WidgetLoadingProps
  & WidgetStylingProps
  & WidgetLoadUrlCallbackProps
  & ConnectPostMessageCallbackProps
  & ConnectWidgetOptionProps

export const ConnectAggregationWidget = makeWidgetComponentWithDefaults(ConnectWidget, {
  mode: "aggregation",
})

export const ConnectVerificationWidget = makeWidgetComponentWithDefaults(ConnectWidget, {
  mode: "verification",
  includeTransactions: false,
})

export function ConnectWidget(props: ConnectWidgetProps) {
  props = {
    onOAuthRequested: makeDefaultConnectOnOAuthRequested(props),
    ...props,
  }

  const [ref, elem] = useWidgetRendererWithRef(
    Type.ConnectWidget,
    props,
    optsFromProps,
    dispatchConnectLocationChangeEvent,
  )

  useOAuthDeeplink(ref)

  return elem
}
