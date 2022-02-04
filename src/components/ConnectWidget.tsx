import React, { useEffect, useState } from "react"
import { StyleProp, ViewStyle } from "react-native"
import { WebViewNavigation } from "react-native-webview"

/**
 * TODO: SafeAreaView is only available on iOS 11 or later, so make sure
 * there's a safe fallback for other environments.
 * https://reactnative.dev/docs/safeareaview
 */
import { SafeAreaView, Linking } from "react-native"
import { WebView } from "react-native-webview"

import { Interceptor, Action } from "../post_messages/interceptor"
import { handleConnectRequest, ConnectCallback } from "../post_messages"

import { makeConnectWidgetRequest } from "../loader/sso"
import { Environment, lookupEnvironment } from "../loader/environment"

import { getScreenWidth, getScreenHeight, onDimensionChange } from "../platform/screen"
import { exhaustive } from "../utils/exhaustive"

type ConnectWidgetProps = ConnectCallback & {
  clientId: string
  apiKey: string
  userGuid: string
  environment: Environment | string
  onSsoError?: (error: Error) => void
}

export default function ConnectWidget({
  clientId,
  apiKey,
  userGuid,
  environment,
  onSsoError = (error) => {},
  ...callbacks
}: ConnectWidgetProps) {
  const validatedEnv = lookupEnvironment(environment)

  const [widgetSsoUrl, setWidgetSsoUrl] = useState<string | null>(null)
  const [screenWidth, setScreenWidth] = useState(getScreenWidth())
  const [screenHeight, setScreenHeight] = useState(getScreenHeight())

  useEffect(() => {
    makeConnectWidgetRequest({ userGuid, clientId, apiKey, environment: validatedEnv })
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
        handleConnectRequest(callbacks, request.url)
        return false

      case Action.LoadInBrowser:
        requestLoadInBrowser(request.url)
        return false

      default:
        exhaustive(action)
    }
  }

  const requestLoadInBrowser = (url: string) => {
    try {
      Linking.openURL(url)
    } catch (error) {
      console.log(`unable to load ${url} in browser app`)
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
