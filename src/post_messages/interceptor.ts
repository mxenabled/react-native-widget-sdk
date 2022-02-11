import { WebViewNavigation } from "react-native-webview"
import { parse as parseUrl } from "url"

export enum Action {
  LoadInApp,
  LoadInBrowser,
  Intercept,
}

export class Interceptor {
  constructor(protected widgetUrl: string, protected uiMessageWebviewUrlScheme: string) {}

  action(request: WebViewNavigation): Action {
    if (request.url === this.widgetUrl) {
      return Action.LoadInApp
    }

    const { protocol } = parseUrl(request.url)

    /* The `uiMessageWebviewUrlScheme` value will be something like "appscheme"
     * but the `url.protocol` will be "appscheme:", so we slice off the last
     * character so that we can compare them.
     */
    const scheme = (protocol || "").slice(0, -1)
    if (scheme === this.uiMessageWebviewUrlScheme) {
      return Action.Intercept
    }

    return Action.LoadInBrowser
  }
}

