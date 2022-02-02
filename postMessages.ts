import { ShouldStartLoadRequest } from "react-native-webview"
import { parse as parseUrl, Url } from "url"

const mxScheme = "mx:"
const appScheme = "appscheme:"

export enum PostMessageInterceptAction {
  LoadInApp,
  LoadInBrowser,
  Intercept,
}

export class PostMessageInterceptor {
  constructor(protected widgetSsoUrl: string) {}

  action(request: ShouldStartLoadRequest): PostMessageInterceptAction {
    if (request.url === this.widgetSsoUrl) {
      return PostMessageInterceptAction.LoadInApp
    }

    const url = parseUrl(request.url)
    if (url.protocol === mxScheme || url.protocol === appScheme) {
      return PostMessageInterceptAction.Intercept
    }

    return PostMessageInterceptAction.LoadInBrowser
  }
}

export class PostMessageParser {
  protected url: Url

  constructor(protected url: string) {
    this.url = parseUrl(url)
  }

  isValid() {
    try {
      return this.namespace() && this.action() && this.payload()
    } catch (error) {
      return false
    }
  }

  namespace() {
    return this.url.host
  }

  action() {
    return (this.url.pathname || "").substring(1)
  }

  payload() {
    return JSON.parse(this.url.query.metadata || "{}")
  }
}
