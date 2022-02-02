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
import { Type } from "../post_messages/type"

import { exhaustive } from "../utils/exhaustive"

import {
  Payload,
  ConnectLoadedPayload,
} from "../post_messages/payload"

import { makeConnectWidgetRequest } from "../loader/sso"
import { Environment } from "../loader/environment"

type ConnectWidgetProps = {
  clientId: string
  apiKey: string
  userGuid: string
  environment: Environment
  onSsoError: (error: Error) => void
  onMessage: (type: Type, payload: Payload) => void
  onLoaded: (payload: ConnectLoadedPayload) => void
}

export default function ConnectWidget({
  clientId,
  apiKey,
  userGuid,
  environment,
  onSsoError = (error) => {},
  onMessage = (type, payload) => {},
  onLoaded = (payload) => {},
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
    const action = interceptor.action(request)
    switch (action) {
      case Action.LoadInApp:
        return true

      case Action.Intercept:
        requestIntercept(request.url)
        return false

      case Action.LoadInBrowser:
        requestLoadInBrowser(request.url)
        return false

      default:
        exhaustive(action)
    }
  }

  const requestIntercept = (url: string) => {
    const message = new Parser(url)
    if (!message.isValid()) {
      console.log(`unable to parse this url: ${url}`)
      return
    }

    dispatchMessage(message.type(), message.payload())
  }

  const requestLoadInBrowser = (url: string) => {
    try {
      Linking.openURL(url)
    } catch (error) {
      console.log(`unable to load ${url} in browser app`)
    }
  }

  const dispatchMessage = (type: Type, payload: Payload) => {
    onMessage(type, payload)

    switch (payload.type) {
      case Type.ConnectLoaded:
        onLoaded(payload)
        break

      case Type.Load:
      case Type.ConnectSelectedInstitution:
      case Type.ConnectStepChange:
        break

      default:
        exhaustive(payload)
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
