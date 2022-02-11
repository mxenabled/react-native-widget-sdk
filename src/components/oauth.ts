import { useEffect, useState } from "react"
import { parse as parseUrl, Url } from "url"

import { onUrlChange } from "../platform/deeplink"

import { ConnectOauthRequestedPayload } from "../post_messages"
import { LoadUrlCallbackProps } from "./standard_props"

import { loadUrlInBrowser } from "./load_url_in_browser"

export function makeDefaultConnectOnOauthRequested(props: LoadUrlCallbackProps) {
  return function ({ url }: ConnectOauthRequestedPayload) {
    loadUrlInBrowser(props, url)
  }
}

export function useOauthDeeplink() {
  const [url, setUrl] = useState<Url | null>(null)

  useEffect(() => {
    return onUrlChange(({ url }) => {
      setUrl(parseUrl(url, true))
    })
  })

  return url
}
