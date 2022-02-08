import { WebViewNavigation } from "react-native-webview"
import { Linking } from "react-native"

import { Interceptor, Action } from "../post_messages/interceptor"
import { LoadUrlCallbacks } from "./widget_standard_props"
import { exhaustive } from "../utils/exhaustive"

export function makeRequestInterceptor<WidgetCallbacks>(
  widgetUrl: string,
  callbacks: LoadUrlCallbacks & WidgetCallbacks,
  handler: (callbacks: WidgetCallbacks, request: WebViewNavigation) => void,
) {
  const interceptor = new Interceptor(widgetUrl)

  return function (request: WebViewNavigation) {
    const action = interceptor.action(request)
    switch (action) {
      case Action.LoadInApp:
        return true

      case Action.Intercept:
        handler(callbacks, request)
        return false

      case Action.LoadInBrowser:
        loadUrl(callbacks, request.url)
        return false

      default:
        exhaustive(action)
    }
  }
}

function defaultOnLoadUrl(url: string) {
  Linking.openURL(url)
}

function defaultOnLoadUrlError(url: string, error: Error) {
  console.log(`Error loading ${url}: ${error}`)
}

function loadUrl(callbacks: LoadUrlCallbacks, url: string) {
  const onLoadUrl = callbacks.onLoadUrl || defaultOnLoadUrl
  const onLoadUrlError = callbacks.onLoadUrlError || defaultOnLoadUrlError

  try {
    onLoadUrl(url)
  } catch (error) {
    if (error instanceof Error) {
      onLoadUrlError(url, error)
    } else if (typeof error === "string") {
      onLoadUrlError(url, new Error(error))
    } else {
      onLoadUrlError(url, new Error(
        ((error || {}) as {valueOf(): string}).valueOf()
      ))
    }
  }
}
