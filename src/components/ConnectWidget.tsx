import React, { useEffect, useState } from "react"
import { SafeAreaView, StyleProp, ViewStyle } from "react-native"
import { WebView } from "react-native-webview"

import { LoadUrlCallbacks } from "./load_url"
import { handleConnectRequest, ConnectCallback } from "../post_messages"
import { ConnectWidgetMode } from "../widget/widgets"
import { Environment, lookupEnvironment } from "../loader/environment"

import { makeConnectWidgetRequest } from "../loader/sso"
import { makeModeSpecificComponent } from "./mode_specific_component"
import { makeRequestInterceptor } from "./request_interceptor"

import { useScreenDimensions } from "./screen_dimensions"

export const ConnectAggregationWidget = makeModeSpecificComponent<ConnectWidgetProps, ConnectWidgetMode>("aggregation", ConnectWidget)
export const ConnectVerificationWidget = makeModeSpecificComponent<ConnectWidgetProps, ConnectWidgetMode>("verification", ConnectWidget)

const defaultOnSsoError = (error: Error) =>
  console.log(`Error making SSO request: ${error}`)

export type ConnectWidgetProps = ConnectCallback & LoadUrlCallbacks & {
  clientId: string
  apiKey: string
  userGuid: string
  environment: Environment | string
  mode?: ConnectWidgetMode
  onSsoError?: (error: Error) => void
}

export default function ConnectWidget({
  clientId,
  apiKey,
  userGuid,
  environment,
  mode,
  onSsoError = defaultOnSsoError,
  ...callbacks
}: ConnectWidgetProps) {
  const validatedEnv = lookupEnvironment(environment)

  const [widgetSsoUrl, setWidgetSsoUrl] = useState<string | null>(null)
  const [screenWidth, screenHeight] = useScreenDimensions()

  useEffect(() => {
    makeConnectWidgetRequest<ConnectWidgetMode>({ userGuid, clientId, apiKey, environment: validatedEnv, options: { mode } })
      .then((response) => setWidgetSsoUrl(response.widget_url.url))
      .catch((error) => onSsoError(error))
  }, [])

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
