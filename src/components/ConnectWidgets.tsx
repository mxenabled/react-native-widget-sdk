import { dispatchConnectLocationChangeEvent, ConnectPostMessageCallbackProps } from "@mxenabled/widget-post-message-definitions"

import { Type, SsoUrlProps, ConnectWidgetConfigurationProps } from "../sso"
import { LoadUrlInBrowserProps } from "./load_url_in_browser"
import { makeDefaultConnectOnOAuthRequested } from "./oauth"
import { makeWidgetComponentWithDefaults } from "./make_component"
import { useOAuthDeeplink } from "./oauth"
import { useWidgetRendererWithRef, StylingProps } from "./renderer"

export type ConnectWidgetProps =
  & SsoUrlProps
  & StylingProps
  & LoadUrlInBrowserProps
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
