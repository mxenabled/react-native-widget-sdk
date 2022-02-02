import { WebViewNavigation } from "react-native-webview"
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

  action(request: WebViewNavigation): PostMessageInterceptAction {
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

enum PostMessageType {
  Load = "mx/load",
  ConnectLoaded = "mx/connect/loaded",
  ConnectStepChange = "mx/connect/stepChange",
}

const postMessageType: Record<string, PostMessageType> = {
  [PostMessageType.Load]: PostMessageType.Load,
  [PostMessageType.ConnectLoaded]: PostMessageType.ConnectLoaded,
  [PostMessageType.ConnectStepChange]: PostMessageType.ConnectStepChange,
}

type UserSessionPayload = {
  user_guid: string
  session_guid: string
}

type LoadPayload = {
  type: PostMessageType.Load
}

type ConnectLoadedPayload = UserSessionPayload & {
  type: PostMessageType.ConnectLoaded
}

type ConnectStepChangePayload = UserSessionPayload & {
  type: PostMessageType.ConnectStepChange
  previous: string
  current: string
}

type Payload
  = LoadPayload
  | ConnectLoadedPayload
  | ConnectStepChangePayload

export class PostMessageParser {
  protected url: Url

  constructor(protected rawUrl: string) {
    this.url = parseUrl(rawUrl, true)
  }

  isValid() {
    try {
      return this.type() && this.payload()
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

  type(): PostMessageType {
    const raw = this.action() ? `mx/${this.namespace()}/${this.action()}` : `mx/${this.namespace()}`
    const value = postMessageType[raw]
    if (value) {
      return value
    }

    throw new Error(`unknown post message type: ${raw}`)
  }

  payload(): Payload {
    let rawMetadata
    if (typeof this.url.query !== "object") {
      throw new Error("A")
    }

    rawMetadata = this.url.query?.["metadata"]
    if (rawMetadata && typeof rawMetadata !== "string") {
      throw new Error("B")
    }

    const metadata = JSON.parse(rawMetadata || "{}")

    switch (this.type()) {
      case PostMessageType.Load:
        return {
          type: PostMessageType.Load,
        }
      case PostMessageType.ConnectLoaded:
        return {
          type: PostMessageType.ConnectLoaded,
          user_guid: metadata.user_guid,
          session_guid: metadata.session_guid,
        }
      case PostMessageType.ConnectStepChange:
        return {
          type: PostMessageType.ConnectStepChange,
          user_guid: metadata.user_guid,
          session_guid: metadata.session_guid,
          previous: metadata.previous,
          current: metadata.current,
        }
    }

    throw new Error("C")
  }
}
