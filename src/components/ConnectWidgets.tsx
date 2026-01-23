import {
  dispatchConnectLocationChangeEvent,
  ConnectPostMessageCallbackProps,
} from "@mxenabled/widget-post-message-definitions"

import { Type, SsoUrlProps, ConnectWidgetConfigurationProps } from "../sso"
import { makeDefaultConnectOnOAuthRequested } from "./oauth"
import { makeWidgetComponentWithDefaults } from "./make_component"
import { useOAuthDeeplink, OAuthProps } from "./oauth"
import { useWidgetRendererWithRef, StylingProps } from "./renderer"

export type ConnectWidgetProps = SsoUrlProps &
  StylingProps &
  OAuthProps &
  ConnectPostMessageCallbackProps<string> &
  ConnectWidgetConfigurationProps &
  JSX.IntrinsicAttributes

export const ConnectVerificationWidget = makeWidgetComponentWithDefaults(ConnectWidget, {
  mode: "verification",
  includeTransactions: false,
})

export function ConnectWidget(props: ConnectWidgetProps) {
  props = {
    onOAuthRequested: makeDefaultConnectOnOAuthRequested(),
    ...props,
  }

  const [ref, elem] = useWidgetRendererWithRef(
    { ...props, widgetType: Type.ConnectWidget },
    dispatchConnectLocationChangeEvent,
  )

  useOAuthDeeplink(ref, props)

  return elem
}
