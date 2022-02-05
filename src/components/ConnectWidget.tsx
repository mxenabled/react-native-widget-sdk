import React, { useEffect, useState } from "react"
import { SafeAreaView, StyleProp, ViewStyle } from "react-native"
import { WebView, WebViewNavigation } from "react-native-webview"

import { Interceptor, Action } from "../post_messages/interceptor"
import { handleConnectRequest, ConnectCallback } from "../post_messages"

import { Environment, lookupEnvironment } from "../loader/environment"
import { ConnectWidgetMode } from "../widget/widgets"
import { makeConnectWidgetRequest } from "../loader/sso"

import { getScreenWidth, getScreenHeight, onDimensionChange } from "../platform/screen"
import { makeModeSpecificComponent } from "./make_mode_specific_component"
import { loadUrl, LoadUrlCallbacks } from "./load_url"
import { exhaustive } from "../utils/exhaustive"

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
  const [screenWidth, setScreenWidth] = useState(getScreenWidth())
  const [screenHeight, setScreenHeight] = useState(getScreenHeight())

  useEffect(() => {
    makeConnectWidgetRequest<ConnectWidgetMode>({ userGuid, clientId, apiKey, environment: validatedEnv, options: { mode } })
      .then((response) => setWidgetSsoUrl(response.widget_url.url))
      .catch((error) => onSsoError(error))
  }, [])

  useEffect(() => {
    return onDimensionChange((orientation) => {
      setScreenWidth(getScreenWidth())
      setScreenHeight(getScreenHeight())
    })
  })

  const viewStyle: StyleProp<ViewStyle> = {
    width: screenWidth,
    height: screenHeight,
    overflow: "hidden",
  }

  if (!widgetSsoUrl) {
    return <SafeAreaView style={viewStyle} />
  }

  const interceptor = new Interceptor(widgetSsoUrl)
  const onShouldStartLoadWithRequest = (request: WebViewNavigation) => {
    const action = interceptor.action(request)
    switch (action) {
      case Action.LoadInApp:
        return true

      case Action.Intercept:
        handleConnectRequest(callbacks, request)
        return false

      case Action.LoadInBrowser:
        loadUrl(callbacks, request.url)
        return false

      default:
        exhaustive(action)
    }
  }

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
