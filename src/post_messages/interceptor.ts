import { WebViewNavigation } from "react-native-webview"
import { parse as parseUrl } from "url"

const mxScheme = "mx:"
const appScheme = "appscheme:"

export enum Action {
  LoadInApp,
  LoadInBrowser,
  Intercept,
}

export class Interceptor {
  constructor(protected widgetSsoUrl: string) {}

  action(request: WebViewNavigation): Action {
    if (request.url === this.widgetSsoUrl) {
      return Action.LoadInApp
    }

    const url = parseUrl(request.url)
    if (url.protocol === mxScheme || url.protocol === appScheme) {
      return Action.Intercept
    }

    return Action.LoadInBrowser
  }
}

