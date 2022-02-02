import React, { useEffect, useState } from "react"
import { StyleProp, ViewStyle } from "react-native"
import { WebViewNavigation } from "react-native-webview"

/**
 * TODO: SafeAreaView is only available on iOS 11 or later, so make sure
 * there's a safe fallback for other environments.
 * https://reactnative.dev/docs/safeareaview
 */
import { SafeAreaView, Dimensions, Linking } from "react-native"
import { WebView } from "react-native-webview"

import { Interceptor, Action } from "../post_messages/interceptor"
import { Parser } from "../post_messages/parser"

import { makeConnectWidgetRequest } from "../loader/sso"
import { Environment } from "../loader/environment"

type ConnectWidgetProps = {
  clientId: string
  apiKey: string
  userGuid: string
  environment: Environment
  onSsoError: (error: Error) => void
}

export default function ConnectWidget({
  clientId,
  apiKey,
  userGuid,
  environment,
  onSsoError = (error) => {},
}: ConnectWidgetProps) {
  const [widgetSsoUrl, setWidgetSsoUrl] = useState<string | null>(null)

  useEffect(() => {
    makeConnectWidgetRequest({ userGuid, clientId, apiKey, environment })
      .then((response) => setWidgetSsoUrl(response.widget_url.url))
      .catch((error) => onSsoError(error))
  }, [])

  const viewStyle: StyleProp<ViewStyle> = {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    overflow: "hidden",
  }

  if (!widgetSsoUrl) {
    return <SafeAreaView style={viewStyle} />
  }

  const interceptor = new Interceptor(widgetSsoUrl)
  const onShouldStartLoadWithRequest = (request: WebViewNavigation) => {
    switch (interceptor.action(request)) {
      case Action.LoadInApp:
        return true

      case Action.Intercept:
        const message = new Parser(request.url)
        if (message.isValid()) {

          console.log(`Post message data:
            namespace: ${message.namespace()}
            action: ${message.action()}
            type: ${message.type()}
            payload: ${JSON.stringify(message.payload())}`)
        } else {
          console.log(`unable to parse this url: ${request.url}`)
        }

        return false

      case Action.LoadInBrowser:
      default:
        Linking.openURL(request.url)
        return false
    }
  }

  return (
    <SafeAreaView style={viewStyle}>
      <WebView
        scrollEnabled={true}
        source={{ uri: widgetSsoUrl }}
        originWhitelist={['*']}
        cacheMode="LOAD_NO_CACHE"
        javaScriptEnabled={true}
        domStorageEnabled={true}
        incognito={true}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
      />
    </SafeAreaView>
  )
}
