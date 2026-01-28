import {
  dispatchConnectLocationChangeEvent,
  ConnectPostMessageCallbackProps,
  ConnectOAuthRequestedPayload,
} from "@mxenabled/widget-post-message-definitions"

import { Type, SsoUrlProps, ConnectWidgetConfigurationProps } from "../sso"
import * as WebBrowser from "expo-web-browser"
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
  const onOAuthRequested = (payload: ConnectOAuthRequestedPayload) => {
    const { url } = payload
    WebBrowser.openAuthSessionAsync(url)

    props.onOAuthRequested?.(payload)
  }

  props = {
    onOAuthRequested,
    ...props,
  }

  const modifiedProps = {
    ...props,
    onOAuthRequested,
  }

  const [ref, elem] = useWidgetRendererWithRef(
    { ...modifiedProps, widgetType: Type.ConnectWidget },
    dispatchConnectLocationChangeEvent,
  )

  useOAuthDeeplink(ref, modifiedProps)

  return elem
}
