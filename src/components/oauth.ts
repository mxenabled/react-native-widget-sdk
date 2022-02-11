import { ConnectOauthRequestedPayload } from "../post_messages"
import { LoadUrlCallbackProps } from "./standard_props"

import { loadUrlInBrowser } from "./load_url_in_browser"

export function makeDefaultConnectOnOauthRequested(props: LoadUrlCallbackProps) {
  return function ({ url }: ConnectOauthRequestedPayload) {
    loadUrlInBrowser(props, url)
  }
}
