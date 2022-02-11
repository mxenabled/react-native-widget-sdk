import React from "react"
import { SafeAreaView } from "react-native"
import { WebView } from "react-native-webview"

import { WidgetLoadingProps, WidgetStylingProps, LoadUrlCallbackProps } from "./standard_props"
import { isLoadingWithUrl, isLoadingWithClientProxy, isLoadingWithPlatformApiSso, isLoadingWithBadProps } from "./loading_strategy"

import { handleConnectRequest, ConnectCallbackProps } from "../post_messages"
import { Type, ConnectOptionProps, ConnectWidgetOptions, connectOptionsFromProps } from "../widget/configuration"

import { makeDefaultConnectOnOauthRequested } from "./oauth"
import { makeComponent } from "./make_component"
import { makeRequestInterceptor } from "./request_interceptor"
import { useClientProxy } from "./loading_strategy"
import { usePlatformApiSso } from "./loading_strategy"
import { useFullscreenStyles } from "./screen_dimensions"

export type ConnectWidgetProps
  = WidgetLoadingProps
  & WidgetStylingProps
  & LoadUrlCallbackProps
  & ConnectCallbackProps
  & ConnectOptionProps

export const ConnectAggregationWidget = makeComponent(ConnectWidget, {
  mode: "aggregation",
})

export const ConnectVerificationWidget = makeComponent(ConnectWidget, {
  mode: "verification",
  includeTransactions: false,
})

export default function ConnectWidget(props: ConnectWidgetProps) {
  const uiMessageWebviewUrlScheme = props.uiMessageWebviewUrlScheme || "mx"
  props = {
    onOauthRequested: makeDefaultConnectOnOauthRequested(props),
    ...props,
  }

  let widgetUrl: string | null
  if (isLoadingWithUrl(props)) {
    widgetUrl = props.url
  } else if (isLoadingWithClientProxy(props)) {
    widgetUrl = useClientProxy(props.proxy, props.onProxyError)
  } else if (isLoadingWithPlatformApiSso(props)) {
    widgetUrl = usePlatformApiSso<ConnectWidgetOptions>({
      widgetType: Type.ConnectWidget,
      uiMessageWebviewUrlScheme,
      options: connectOptionsFromProps(props),
      ...props
    })
  } else {
    isLoadingWithBadProps()
  }

  const fullscreenStyles = useFullscreenStyles()
  const style = props.style || fullscreenStyles

  if (!widgetUrl) {
    return <SafeAreaView style={style} />
  }

  const handler = makeRequestInterceptor(widgetUrl, uiMessageWebviewUrlScheme, props, handleConnectRequest)
  return (
    <SafeAreaView testID="connect-widget-view" style={style}>
      <WebView
        testID="connect-widget-webview"
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
