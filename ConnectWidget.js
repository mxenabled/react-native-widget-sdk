import React, { useEffect, useState } from "react"

/**
 * TODO: SafeAreaView is only available on iOS 11 or later, so make sure
 * there's a safe fallback for other environments.
 * https://reactnative.dev/docs/safeareaview
 */
import { SafeAreaView, Dimensions, Linking } from "react-native"
import { WebView } from "react-native-webview"

import { makeConnectWidgetRequest } from "./widgetUrls"
import { PostMessageInterceptor, PostMessageInterceptAction, PostMessageParser } from "./postMessages"

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

  const interceptor = new PostMessageInterceptor(widgetSsoUrl)
  const onShouldStartLoadWithRequest = (request) => {
    switch (interceptor.action(request)) {
      case PostMessageInterceptAction.LoadInApp:
        return true

      case PostMessageInterceptAction.Intercept:
        const message = new PostMessageParser(request.url)
        if (message.isValid()) {
          console.log(message.namespace())
          console.log(message.action())
          console.log(message.payload())
          console.log(message.type())
        } else {
          console.log("INVALID")
          console.log(request.url)
          console.log("INVALID")
        }

        return false

      case PostMessageInterceptAction.LoadInBrowser:
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
