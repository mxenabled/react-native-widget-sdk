import { useEffect, useState } from "react"
import { parse as parseUrl, UrlWithParsedQuery } from "url"

import { ConnectOAuthRequestedPayload } from "@mxenabled/widget-post-message-definitions"

import { WebViewRef } from "./webview"
import { onUrlChange } from "../platform/deeplink"
import { loadUrlInBrowser, LoadUrlInBrowserProps } from "./load_url_in_browser"

export function makeDefaultConnectOnOAuthRequested(props: LoadUrlInBrowserProps) {
  return function ({ url }: ConnectOAuthRequestedPayload) {
    loadUrlInBrowser(url, props)
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

type OAuthSuccessRedirectEvent = {
  type: "success"
  success: boolean
  memberGuid: string
}

type OAuthErrorRedirectEvent = {
  type: "error"
  success: boolean
}

export type OAuthRedirectEvent = OAuthSuccessRedirectEvent | OAuthErrorRedirectEvent

export type OAuthProps = {
  sendOAuthPostMessage?: (webViewRef: WebViewRef, msg: string) => void
}

export function useOAuthDeeplink(
  webViewRef: WebViewRef,
  props: OAuthProps,
): OAuthRedirectEvent | null {
  const [ev, setEvent] = useState<OAuthRedirectEvent | null>(null)

  useEffect(() => {
    return onUrlChange(({ url: rawUrl }) => {
      const url = parseUrl(rawUrl, true)

      /**
       * When the ui_message_webview_url_scheme setting is used, our backend
       * will generate a URL which looks like this:
       *
       *   <scheme>://<event>?<query>
       *
       * For URLs like these, we need to check the host.
       *
       * However, when a client is using Expo in dev/qa mode and doesn't have
       * access to their app's scheme, they rely on the client_redirect_url
       * setting which must use the host to specify Expo's application
       * location. In this case, the redirect URL has to have the specified
       * event as part of the path:
       *
       *   exp://<ip>/--/<event>?<query>
       *
       * For URLs like these, we need to check the path.
       */
      const isOAuthEventUrl =
        url.host === OAuthCompleteHost || url.pathname?.includes(OAuthCompleteHost)
      if (!isOAuthEventUrl) {
        return
      }

      const event = buildOAuthRedirectEvent(url)
      setEvent(event)
      postOAuthMessage(event, webViewRef, props)
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

function postOAuthMessage(ev: OAuthRedirectEvent, webViewRef: WebViewRef, props: OAuthProps) {
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

  const message = JSON.stringify({ mx: true, type, metadata })

  if (props.sendOAuthPostMessage) {
    props.sendOAuthPostMessage(webViewRef, message)
  } else {
    webViewRef.current.postMessage(message)
  }
}
