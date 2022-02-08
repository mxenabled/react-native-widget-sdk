import React from "react"
import { SafeAreaView } from "react-native"
import { WebView } from "react-native-webview"

import { LoadUrlCallbacks } from "./load_url"
import { WidgetLoadingProps } from "./loading"
import { isLoadingWithUrl, isLoadingWithPlatformApiSso, isLoadingWithBadProps } from "./loading"

import { handleConnectRequest, ConnectCallbacks } from "../post_messages"
import { Type, ConnectWidgetMode } from "../widget/widgets"

import { makeModeSpecificComponent } from "./mode_specific_component"
import { makeRequestInterceptor } from "./request_interceptor"
import { usePlatformApiSso } from "./platform_api_sso"
import { useFullscreenStyles } from "./screen_dimensions"

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
