import React, { useRef } from "react"
import { SafeAreaView } from "react-native"
import { WebView } from "react-native-webview"

import { WidgetLoadingProps, WidgetStylingProps, LoadUrlCallbackProps } from "./standard_props"

import { handleConnectRequest, ConnectCallbackProps } from "../post_messages"
import { Type, ConnectOptionProps, connectOptionsFromProps } from "../widget/configuration"

import { makeDefaultConnectOnOAuthRequested } from "./oauth"
import { makeComponentWithDefaults } from "./make_component"
import { makeRequestInterceptor } from "./request_interceptor"
import { useWidgetUrl } from "./loading_strategy"
import { useFullscreenStyles } from "./screen_dimensions"
import { useOAuthDeeplink } from "./oauth"

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
  const uiMessageWebviewUrlScheme = props.uiMessageWebviewUrlScheme || "mx"
  props = {
    onOAuthRequested: makeDefaultConnectOnOAuthRequested(props),
    uiMessageWebviewUrlScheme,
    ...props,
  }

  const widgetUrl = useWidgetUrl(Type.ConnectWidget, props, connectOptionsFromProps)
  const fullscreenStyles = useFullscreenStyles()
  const style = props.style || fullscreenStyles

  const webViewRef = useRef<WebView>(null)
  useOAuthDeeplink(webViewRef)

  if (!widgetUrl) {
    return <SafeAreaView style={style} />
  }

  const handler = makeRequestInterceptor(widgetUrl, uiMessageWebviewUrlScheme, props, handleConnectRequest)
  return (
    <SafeAreaView testID="connect-widget-view" style={style}>
      <WebView
        testID="connect-widget-webview"
        ref={webViewRef}
        scrollEnabled={true}
        source={{ uri: widgetUrl }}
        originWhitelist={["*"]}
        cacheMode="LOAD_NO_CACHE"
        javaScriptEnabled={true}
        domStorageEnabled={true}
        incognito={true}
        onShouldStartLoadWithRequest={handler}
      />
    </SafeAreaView>
  )
}
