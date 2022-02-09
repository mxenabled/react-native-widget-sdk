import React from "react"
import { SafeAreaView } from "react-native"
import { WebView } from "react-native-webview"

import { WidgetLoadingProps, LoadUrlCallbackProps } from "./widget_standard_props"
import { isLoadingWithUrl, isLoadingWithPlatformApiSso, isLoadingWithBadProps } from "./widget_loading_strategy"

import { handleConnectRequest, ConnectCallbackProps } from "../post_messages"
import { Type, ConnectOptionProps, ConnectWidgetOptions, connectOptionsFromProps } from "../widget/configuration"

import loadUrlInBrowser from "./load_url_in_browser"
import makeModeSpecificComponent from "./make_mode_specific_component"
import makeRequestInterceptor from "./make_request_interceptor"
import usePlatformApiSso from "./use_platform_api_sso"
import { useFullscreenStyles } from "./use_screen_dimensions"

export type ConnectWidgetProps
  = WidgetLoadingProps
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
  } else if (isLoadingWithPlatformApiSso(props)) {
    widgetUrl = usePlatformApiSso<ConnectWidgetOptions>({
      widgetType: Type.ConnectWidget,
      options: connectOptionsFromProps(props),
      ...props
    })
  } else {
    isLoadingWithBadProps()
  }

  const viewStyles = useFullscreenStyles()

  if (!widgetUrl) {
    return <SafeAreaView style={viewStyles} />
  }

  return (
    <SafeAreaView testID="connect-widget-view" style={viewStyles}>
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
