import { WebViewNavigation } from "react-native-webview"
import { parse as parseUrl } from "url"

const mxScheme = "mx:"

export enum Action {
  LoadInApp,
  LoadInBrowser,
  Intercept,
}

export class Interceptor {
  constructor(protected widgetUrl: string) {}

  action(request: WebViewNavigation): Action {
    if (request.url === this.widgetUrl) {
      return Action.LoadInApp
    }

    const url = parseUrl(request.url)
    if (url.protocol === mxScheme) {
      return Action.Intercept
    }

    return Action.LoadInBrowser
  }
}

