import { WebViewNavigation } from "react-native-webview"

import { loadUrlInBrowser } from "./load_url_in_browser"
import { Interceptor, Action } from "../post_messages/interceptor"
import { WidgetLoadUrlCallbackProps } from "./standard_props"
import { exhaustive } from "../utils/exhaustive"

export function makeRequestInterceptor<WidgetCallbackProps>(
  widgetUrl: string,
  uiMessageWebviewUrlScheme: string,
  callbacks: WidgetLoadUrlCallbackProps & WidgetCallbackProps,
  handler: (callbacks: WidgetCallbackProps, request: WebViewNavigation) => void,
) {
  const interceptor = new Interceptor(widgetUrl, uiMessageWebviewUrlScheme)

  return function (request: WebViewNavigation) {
    const action = interceptor.action(request)
    switch (action) {
      case Action.LoadInApp:
        return true

      case Action.Intercept:
        handler(callbacks, request)
        return false

      case Action.LoadInBrowser:
        loadUrlInBrowser(callbacks, request.url)
        return false

      default:
        exhaustive(action)
    }
  }
}
