import React from "react"
import { SafeAreaView } from "react-native"
import { WebView } from "react-native-webview"

import { LoadUrlCallbacks } from "./load_url"
import { handleConnectRequest, ConnectCallbacks } from "../post_messages"
import { Type, ConnectWidgetMode } from "../widget/widgets"
import { buildRequestParams } from "../loader/platform_api_sso_request"

import { makeModeSpecificComponent } from "./mode_specific_component"
import { makeRequestInterceptor } from "./request_interceptor"

import { usePlatformApiSso, PlatformApiSsoProps } from "./platform_api_sso"
import { useFullscreenStyles } from "./screen_dimensions"

export type ConnectWidgetProps
  = PlatformApiSsoProps
  & ConnectCallbacks
  & LoadUrlCallbacks
  & { mode?: ConnectWidgetMode }

export const ConnectAggregationWidget = makeModeSpecificComponent<ConnectWidgetProps, ConnectWidgetMode>("aggregation", ConnectWidget)
export const ConnectVerificationWidget = makeModeSpecificComponent<ConnectWidgetProps, ConnectWidgetMode>("verification", ConnectWidget)

export default function ConnectWidget({
  clientId,
  apiKey,
  userGuid,
  environment,
  mode,
  onSsoError,
  ...callbacks
}: ConnectWidgetProps) {
  const ssoParams = buildRequestParams(apiKey, clientId, userGuid,
    environment, Type.ConnectWidget, { mode })
  const widgetUrl = usePlatformApiSso(ssoParams, onSsoError)
  const viewStyles = useFullscreenStyles()

  if (!widgetUrl) {
    return <SafeAreaView style={viewStyles} />
  }

  const onShouldStartLoadWithRequest = makeRequestInterceptor(widgetUrl, callbacks, handleConnectRequest)

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
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
      />
    </SafeAreaView>
  )
}
