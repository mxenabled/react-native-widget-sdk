import React from "react"
import { SafeAreaView } from "react-native"
import { WebView } from "react-native-webview"

import { WidgetLoadingProps, WidgetStylingProps, LoadUrlCallbackProps } from "./widget_standard_props"
import { isLoadingWithUrl, isLoadingWithClientProxy, isLoadingWithPlatformApiSso, isLoadingWithBadProps } from "./widget_loading_strategy"

import { handleConnectRequest, ConnectCallbackProps } from "../post_messages"
import { Type, ConnectOptionProps, ConnectWidgetOptions, connectOptionsFromProps } from "../widget/configuration"

import loadUrlInBrowser from "./load_url_in_browser"
import makeModeSpecificComponent from "./make_mode_specific_component"
import makeRequestInterceptor from "./make_request_interceptor"
import useClientProxy from "./use_client_proxy"
import usePlatformApiSso from "./use_platform_api_sso"
import { useFullscreenStyles } from "./use_screen_dimensions"

export type ConnectWidgetProps
  = WidgetLoadingProps
  & WidgetStylingProps
  & LoadUrlCallbackProps
  & ConnectCallbackProps
  & ConnectOptionProps

export const ConnectAggregationWidget = makeModeSpecificComponent("aggregation", ConnectWidget)
export const ConnectVerificationWidget = makeModeSpecificComponent("verification", ConnectWidget, {
  includeTransactions: false,
})

export default function ConnectWidget(props: ConnectWidgetProps) {
  props = {
    onOauthRequested: ({ url }) => loadUrlInBrowser(props, url),
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
        onShouldStartLoadWithRequest={makeRequestInterceptor(widgetUrl, props, handleConnectRequest)}
      />
    </SafeAreaView>
  )
}
