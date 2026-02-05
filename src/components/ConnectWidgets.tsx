import React from "react"
import {
  dispatchConnectLocationChangeEvent,
  ConnectPostMessageCallbackProps,
  ConnectOAuthRequestedPayload,
} from "@mxenabled/widget-post-message-definitions"
import * as WebBrowser from "expo-web-browser"
import { WebView, WebViewProps } from "react-native-webview"
import { sdkVersion } from "../version"
import { makeRequestInterceptor } from "./request_interceptor"

interface ExtraProps {
  url: string
  webViewProps?: WebViewProps
}

export type ConnectWidgetProps = ConnectPostMessageCallbackProps<string> & ExtraProps

export function ConnectWidget(props: ConnectWidgetProps) {
  const { url: webviewUrl, webViewProps, ...callbacks } = props

  const onOAuthRequested = (payload: ConnectOAuthRequestedPayload) => {
    const { url } = payload
    WebBrowser.openAuthSessionAsync(url)

    props.onOAuthRequested?.(payload)
  }

  const modifiedCallbacks = {
    ...callbacks,
    onOAuthRequested,
  }

  const handler = makeRequestInterceptor(webviewUrl, {
    onIntercept: (url) => {
      dispatchConnectLocationChangeEvent(url, modifiedCallbacks)
    },
  })

  const setReactNativeSDKVersionOnWindow = `
      window.MXReactNativeSDKVersion = "${sdkVersion}";
    `

  return (
    <WebView
      cacheMode="LOAD_NO_CACHE"
      domStorageEnabled={true}
      incognito={true}
      injectedJavaScriptBeforeContentLoaded={setReactNativeSDKVersionOnWindow}
      javaScriptEnabled={true}
      onOpenWindow={(event) => {
        WebBrowser.openBrowserAsync(event.nativeEvent.targetUrl)
      }}
      onShouldStartLoadWithRequest={handler}
      originWhitelist={["*"]}
      scrollEnabled={true}
      source={{ uri: webviewUrl }}
      testID="widget_webview"
      {...webViewProps}
      style={webViewProps?.style || { height: "100%", width: "100%" }}
    />
  )
}
