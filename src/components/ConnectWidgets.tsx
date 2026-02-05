import {
  dispatchConnectLocationChangeEvent,
  ConnectPostMessageCallbackProps,
  ConnectOAuthRequestedPayload,
} from "@mxenabled/widget-post-message-definitions"

import { Type, SsoUrlProps, ConnectWidgetConfigurationProps } from "../sso"
import * as WebBrowser from "expo-web-browser"
import { StylingProps, useWidgetRenderer } from "./renderer"

export type ConnectWidgetProps = SsoUrlProps &
  StylingProps &
  ConnectPostMessageCallbackProps<string> &
  ConnectWidgetConfigurationProps &
  JSX.IntrinsicAttributes

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

  const elem = useWidgetRenderer(
    { ...modifiedProps, widgetType: Type.ConnectWidget },
    dispatchConnectLocationChangeEvent,
  )

  return elem
}
