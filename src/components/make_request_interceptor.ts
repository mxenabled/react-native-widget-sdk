import { WebViewNavigation } from "react-native-webview"
import { Linking } from "react-native"

import { Interceptor, Action } from "../post_messages/interceptor"
import { LoadUrlCallbackProps } from "./widget_standard_props"
import { exhaustive } from "../utils/exhaustive"

export default function makeRequestInterceptor<WidgetCallbackProps>(
  widgetUrl: string,
  callbacks: LoadUrlCallbackProps & WidgetCallbackProps,
  handler: (callbacks: WidgetCallbackProps, request: WebViewNavigation) => void,
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

function loadUrl(callbacks: LoadUrlCallbackProps, url: string) {
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
