import React, { useEffect, useState } from "react"

/**
 * TODO: SafeAreaView is only available on iOS 11 or later, so make sure
 * there's a safe fallback for other environments.
 * https://reactnative.dev/docs/safeareaview
 */
import { SafeAreaView, Dimensions, Linking } from "react-native"
import { WebView } from "react-native-webview"

import { makeConnectWidgetRequest } from "./widgetUrls"
import { Interceptor, Action } from "./src/post_messages/interceptor"
import { Parser } from "./src/post_messages/parser"

/**
 * interface ConnectWidgetProps {
 *   clientId: String
 *   apiKey: String
 *   userGuid: String
 *   environment: Environment
 *   onLoadComplete?: () => void
 *   onLoadError?: (Error) => void
 * }
 */
export default function ConnectWidget({
  clientId,
  apiKey,
  userGuid,
  environment,
  onLoadComplete = () => {},
  onLoadError = (error) => {},
}) {
  const [widgetSsoUrl, setWidgetSsoUrl] = useState(null)

  useEffect(() => {
    makeConnectWidgetRequest(userGuid, clientId, apiKey, environment)
      .then((response) => setWidgetSsoUrl(response.widget_url.url))
      .then(() => onLoadComplete())
      .catch((error) => onLoadError(error))
  }, [])

  if (!widgetSsoUrl) {
    return <SafeAreaView style={viewStyle} />
  }

  const viewStyle = {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    overflow: "hidden",
  }

  const interceptor = new Interceptor(widgetSsoUrl)
  const onShouldStartLoadWithRequest = (request) => {
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
