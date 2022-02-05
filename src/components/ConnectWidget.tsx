import React from "react"
import { SafeAreaView, StyleProp, ViewStyle } from "react-native"
import { WebView } from "react-native-webview"

import { LoadUrlCallbacks } from "./load_url"
import { handleConnectRequest, ConnectCallbacks } from "../post_messages"
import { Type, ConnectWidgetMode } from "../widget/widgets"
import { buildSsoRequestParams } from "../loader/sso"

import { makeModeSpecificComponent } from "./mode_specific_component"
import { makeRequestInterceptor } from "./request_interceptor"

import { useSso, SsoProps } from "./sso"
import { useScreenDimensions } from "./screen_dimensions"

export const ConnectAggregationWidget = makeModeSpecificComponent<ConnectWidgetProps, ConnectWidgetMode>("aggregation", ConnectWidget)
export const ConnectVerificationWidget = makeModeSpecificComponent<ConnectWidgetProps, ConnectWidgetMode>("verification", ConnectWidget)

export type ConnectWidgetProps
  = SsoProps
  & ConnectCallbacks
  & LoadUrlCallbacks
  & { mode?: ConnectWidgetMode }

export default function ConnectWidget({
  clientId,
  apiKey,
  userGuid,
  environment,
  mode,
  onSsoError,
  ...callbacks
}: ConnectWidgetProps) {
  const ssoParams = buildSsoRequestParams(apiKey, clientId, userGuid,
    environment, Type.ConnectWidget, { mode })

  const widgetSsoUrl = useSso(ssoParams, onSsoError)
  const [screenWidth, screenHeight] = useScreenDimensions()

  const viewStyle: StyleProp<ViewStyle> = {
    width: screenWidth,
    height: screenHeight,
    overflow: "hidden",
  }

  if (!widgetSsoUrl) {
    return <SafeAreaView style={viewStyle} />
  }

  const onShouldStartLoadWithRequest = makeRequestInterceptor(widgetSsoUrl, callbacks, handleConnectRequest)

  return (
    <SafeAreaView style={viewStyle}>
      <WebView
        scrollEnabled={true}
        source={{ uri: widgetSsoUrl }}
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
