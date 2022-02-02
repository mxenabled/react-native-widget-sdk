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

enum PostMessageType {
  ConnectLoaded = "mx/connect/loaded",
  ConnectStepChange = "mx/connect/stepChange",
}

const postMessageType: Dictionary<string, PostMessageType> = {
  [PostMessageType.ConnectLoaded]: PostMessageType.ConnectLoaded,
  [PostMessageType.ConnectStepChange]: PostMessageType.ConnectStepChange,
}

type UserSessionPayload = {
  user_guid: string
  session_guid: string
}

type ConnectLoadedPayload = UserSessionPayload & {
  type: "mx/connect/loaded"
}

type ConnectStepChangePayload = UserSessionPayload & {
  type: "mx/connect/stepChange"
  previous: string
  current: string
}

type Payload
  = ConnectLoadedPayload
  | ConnectStepChangePayload

export class PostMessageParser {
  protected url: Url

  constructor(protected url: string) {
    this.url = parseUrl(url, true)
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
    const raw = `mx/${this.namespace()}/${this.action()}`
    const value = postMessageType[raw]
    if (value) {
      return value
    }

    throw new Error(`unknown post message type: ${raw}`)
  }

  payload(): Payload {
    const raw = JSON.parse(this.url.query.metadata || "{}")

    switch (this.type()) {
      case PostMessageType.ConnectLoadedPayload:
        return {
          type: "mx/connect/loaded",
          user_guid: raw.user_guid,
          session_guid: raw.session_guid,
        }
      case PostMessageType.ConnectStepChange:
        return {
          type: "mx/connect/stepChange",
          user_guid: raw.user_guid,
          session_guid: raw.session_guid,
          previous: raw.previous,
          current: raw.current,
        }
    }
  }
}
