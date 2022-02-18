import { WidgetLoadingProps, WidgetStylingProps, LoadUrlCallbackProps } from "./standard_props"
import { handleConnectRequest as handleRequest, ConnectCallbackProps } from "../post_messages"
import { Type, ConnectOptionProps, connectOptionsFromProps as optsFromProps } from "../widget/configuration"

import { makeDefaultConnectOnOAuthRequested } from "./oauth"
import { makeComponentWithDefaults } from "./make_component"
import { useOAuthDeeplink } from "./oauth"
import { useWidgetRenderer } from "./renderer"

export type ConnectWidgetProps =
  & WidgetLoadingProps
  & WidgetStylingProps
  & LoadUrlCallbackProps
  & ConnectCallbackProps
  & ConnectOptionProps

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

  const [ref, elem] = useWidgetRenderer(
    Type.ConnectWidget,
    props,
    optsFromProps,
    handleRequest,
  )

  useOAuthDeeplink(ref)

  return elem
}
