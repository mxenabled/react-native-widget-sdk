import { MutableRefObject, useEffect, useState } from "react"
import { WebView } from "react-native-webview"
import { parse as parseUrl, UrlWithParsedQuery } from "url"

import { onUrlChange } from "../platform/deeplink"

import { ConnectOAuthRequestedPayload } from "../post_messages"
import { LoadUrlCallbackProps } from "./standard_props"

import { loadUrlInBrowser } from "./load_url_in_browser"

export function makeDefaultConnectOnOAuthRequested(props: LoadUrlCallbackProps) {
  return function ({ url }: ConnectOAuthRequestedPayload) {
    loadUrlInBrowser(props, url)
  }
}

/* Used when handling and parsing an OAuth deeplink. This is what the OAuth
 * flow uses to communicate state and status back to the app.
 */
const OAuthCompleteHost = "oauth_complete"
const OAuthStatusSuccess = "success"

/* Used when sending a postMessage to the widget. This is what the app uses to
 * communicate the result of an OAuth request after it is redirected back to
 * the app.
 */
const OAuthTypeSuccess = "oauthComplete/success"
const OAuthTypeError = "oauthComplete/error"

type WebViewRef = MutableRefObject<WebView | null>

type OAuthSuccessRedirectEvent = {
  type: "success"
  success: boolean
  memberGuid: string
}

type OAuthErrorRedirectEvent = {
  type: "error"
  success: boolean
}

export type OAuthRedirectEvent =
  | OAuthSuccessRedirectEvent
  | OAuthErrorRedirectEvent

export function useOAuthDeeplink(webViewRef: WebViewRef): OAuthRedirectEvent | null {
  const [ev, setEvent] = useState<OAuthRedirectEvent | null>(null)

  useEffect(() => {
    return onUrlChange(({ url: rawUrl }) => {
      const url = parseUrl(rawUrl, true)
      if (url.host !== OAuthCompleteHost) {
        return
      }

      const event = buildOAuthRedirectEvent(url)
      setEvent(event)
      postOAuthMessage(event, webViewRef)
    })
  }, [])

  return ev
}

function buildOAuthRedirectEvent(url: UrlWithParsedQuery): OAuthRedirectEvent {
  const success = url.query["status"] === OAuthStatusSuccess
  const memberGuid = url.query["amp;member_guid"] || url.query["member_guid"]
  if (success && typeof memberGuid === "string") {
    return { type: "success", success, memberGuid }
  }

  return { type: "error", success: false }
}

function postOAuthMessage(ev: OAuthRedirectEvent, webViewRef: WebViewRef) {
  if (!webViewRef.current) {
    return
  }

  let type: string
  let metadata: Record<string, unknown>
  if (ev.type === "success") {
    type = OAuthTypeSuccess
    metadata = { member_guid: ev.memberGuid }
  } else {
    type = OAuthTypeError
    metadata = {}
  }

  webViewRef.current.postMessage(JSON.stringify({ mx: true, type, metadata }))
}
