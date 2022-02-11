import { useEffect, useState } from "react"

import { UrlLoadingProps, ClientProxyLoadingProps, PlatformApiLoadingProps } from "./standard_props"
import { RequestParams, buildRequestParams, makeRequest as makePlatformApiRequest } from "../loader/platform_api"
import { makeRequest as makeClientProxyRequest } from "../loader/client_proxy"

const badPropsMessage = `Missing required widget props!

Component needs one of the following groups of props:

  - url

    - or -

  - proxy

    - or -

  - apiKey
  - clientId
  - environment
  - userGuid`

export function isLoadingWithUrl(props: Object): props is UrlLoadingProps {
  return "url" in props
}

export function isLoadingWithClientProxy(props: Object): props is ClientProxyLoadingProps {
  return "proxy" in props
}

export function isLoadingWithPlatformApiSso(props: Object): props is PlatformApiLoadingProps {
  return "clientId" in props &&
    "apiKey" in props &&
    "userGuid" in props &&
    "environment" in props
}

export function isLoadingWithBadProps(): never {
  throw new Error(badPropsMessage)
}

function defaultOnClientProxyError(error: Error) {
  console.log(`Error making request to proxy API server: ${error}`)
}

export function useClientProxy<Options>(
  url: string,
  onError: (error: Error) => void = defaultOnClientProxyError,
): string | null {
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null)

  useEffect(() => {
    makeClientProxyRequest(url)
      .then((json) => setWidgetUrl(json.widget_url.url))
      .catch(onError)
  }, [])

  return widgetUrl
}

function defaultOnPlatformApiError(error: Error) {
  console.log(`Error making SSO request: ${error}`)
}

export function usePlatformApiSso<Options>({
  apiKey,
  clientId,
  userGuid,
  environment,
  widgetType,
  options,
  uiMessageWebviewUrlScheme,
  onSsoError = defaultOnPlatformApiError,
}: PlatformApiLoadingProps & Required<Pick<RequestParams<Options>, "widgetType" | "options" | "uiMessageWebviewUrlScheme">>) {
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null)

  const params = buildRequestParams<Options>(apiKey, clientId, userGuid,
    environment, widgetType, uiMessageWebviewUrlScheme, options)

  useEffect(() => {
    makePlatformApiRequest(params)
      .then((response) => setWidgetUrl(response.widget_url.url))
      .catch((error) => onSsoError(error))
  }, [])

  return widgetUrl
}
