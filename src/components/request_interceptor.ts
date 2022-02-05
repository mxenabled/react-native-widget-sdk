import { WebViewNavigation } from "react-native-webview"

import { Interceptor, Action } from "../post_messages/interceptor"
import { loadUrl, LoadUrlCallbacks } from "./load_url"
import { exhaustive } from "../utils/exhaustive"

export function makeRequestInterceptor<WidgetCallbacks>(
  widgetSsoUrl: string,
  callbacks: LoadUrlCallbacks & WidgetCallbacks,
  handler: (callbacks: WidgetCallbacks, request: WebViewNavigation) => void,
) {
  const interceptor = new Interceptor(widgetSsoUrl)

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
