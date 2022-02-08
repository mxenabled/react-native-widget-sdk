import React from "react"
import { SafeAreaView } from "react-native"
import { WebView } from "react-native-webview"

import { WidgetLoadingProps, LoadUrlCallbacks } from "./widget_standard_props"
import { isLoadingWithUrl, isLoadingWithPlatformApiSso, isLoadingWithBadProps } from "./widget_loading_strategy"

import { handleConnectRequest, ConnectCallbacks } from "../post_messages"
import { Type, ConnectWidgetMode } from "../widget/widgets"

import { makeModeSpecificComponent } from "./make_mode_specific_component"
import { makeRequestInterceptor } from "./make_request_interceptor"
import { usePlatformApiSso } from "./use_platform_api_sso"
import { useFullscreenStyles } from "./use_screen_dimensions"

export type ConnectWidgetProps
  = WidgetLoadingProps
  & LoadUrlCallbacks
  & ConnectCallbacks
  & { mode?: ConnectWidgetMode }

export const ConnectAggregationWidget = makeModeSpecificComponent<ConnectWidgetProps, ConnectWidgetMode>("aggregation", ConnectWidget)
export const ConnectVerificationWidget = makeModeSpecificComponent<ConnectWidgetProps, ConnectWidgetMode>("verification", ConnectWidget)

export default function ConnectWidget(props: ConnectWidgetProps) {
  let widgetUrl: string | null

  if (isLoadingWithUrl(props)) {
    widgetUrl = props.url
  } else if (isLoadingWithPlatformApiSso(props)) {
    widgetUrl = usePlatformApiSso({
      widgetType: Type.ConnectWidget,
      options: { mode: props.mode },
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
    <SafeAreaView style={viewStyles}>
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
