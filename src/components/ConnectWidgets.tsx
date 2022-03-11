import { dispatchConnectLocationChangeEvent, ConnectPostMessageCallbackProps } from "@mxenabled/widget-post-message-definitions"

import { Type, SsoUrlProps, ConnectWidgetConfigurationProps } from "../sso"
import { WidgetStylingProps, WidgetLoadUrlCallbackProps } from "./standard_props"

import { makeDefaultConnectOnOAuthRequested } from "./oauth"
import { makeWidgetComponentWithDefaults } from "./make_component"
import { useOAuthDeeplink } from "./oauth"
import { useWidgetRendererWithRef } from "./renderer"

export type ConnectWidgetProps =
  & SsoUrlProps
  & WidgetStylingProps
  & WidgetLoadUrlCallbackProps
  & ConnectPostMessageCallbackProps
  & ConnectWidgetConfigurationProps

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
    { ...props, widgetType: Type.ConnectWidget },
    dispatchConnectLocationChangeEvent,
  )

  useOAuthDeeplink(ref)

  return elem
}
