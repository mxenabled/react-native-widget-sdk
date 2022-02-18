import { WidgetLoadingProps, WidgetStylingProps, WidgetLoadUrlCallbackProps } from "./standard_props"
import { handleConnectRequest as handleRequest, ConnectCallbackProps } from "../post_messages"
import { Type, ConnectWidgetOptionProps, connectWidgetOptionsFromProps as optsFromProps } from "../widget/configuration"

import { makeDefaultConnectOnOAuthRequested } from "./oauth"
import { makeComponentWithDefaults } from "./make_component"
import { useOAuthDeeplink } from "./oauth"
import { useWidgetRendererWithRef } from "./renderer"

export type ConnectWidgetProps =
  & WidgetLoadingProps
  & WidgetStylingProps
  & WidgetLoadUrlCallbackProps
  & ConnectCallbackProps
  & ConnectWidgetOptionProps

export const ConnectAggregationWidget = makeComponentWithDefaults(ConnectWidget, {
  mode: "aggregation",
})

export const ConnectVerificationWidget = makeComponentWithDefaults(ConnectWidget, {
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
    handleRequest,
  )

  useOAuthDeeplink(ref)

  return elem
}
