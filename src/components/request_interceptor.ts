import { WebViewNavigation } from "react-native-webview"
import { parse as parseUrl } from "url"

import { loadUrlInBrowser } from "./loadUrlInBrowser"

export enum Action {
  LoadInApp,
  LoadInBrowser,
  Intercept,
}

type Callbacks = {
  onIntercept: (url: string) => void
}

class Interceptor {
  constructor(protected widgetUrl: string) {}

  action(request: WebViewNavigation): Action {
    if (request.url === this.widgetUrl) {
      return Action.LoadInApp
    }

    const { protocol } = parseUrl(request.url)

    if (protocol === "mx:") {
      return Action.Intercept
    }

    return Action.LoadInBrowser
  }
}

export function makeRequestInterceptor(widgetUrl: string, callbacks: Callbacks) {
  const interceptor = new Interceptor(widgetUrl)

  return function (request: WebViewNavigation) {
    const action = interceptor.action(request)
    switch (action) {
      case Action.LoadInApp:
        return true

      case Action.Intercept:
        callbacks.onIntercept(request.url)
        return false

      case Action.LoadInBrowser:
        loadUrlInBrowser(request.url)
        return false
    }
  }
}
