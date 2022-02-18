import { useEffect, useState } from "react"

import { Type, WidgetOptionProps } from "../widget/configuration"

import { WidgetLoadingProps, UrlLoadingProps, ClientProxyLoadingProps, PlatformApiLoadingProps } from "./standard_props"
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

function defaultOnClientProxyError(error: Error) {
  console.log(`Error making request to proxy API server: ${error}`)
}

function defaultOnPlatformApiError(error: Error) {
  console.log(`Error making SSO request: ${error}`)
}

export function isLoadingWithUrl(props: WidgetLoadingProps): props is UrlLoadingProps {
  return "url" in props
}

export function isLoadingWithClientProxy(props: WidgetLoadingProps): props is ClientProxyLoadingProps {
  return "proxy" in props
}

export function isLoadingWithPlatformApiSso(props: WidgetLoadingProps): props is PlatformApiLoadingProps {
  return "clientId" in props &&
    "apiKey" in props &&
    "userGuid" in props &&
    "environment" in props
}

export function isLoadingWithBadProps(): never {
  throw new Error(badPropsMessage)
}

export function useClientProxy(
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

export function useWidgetUrl<Props extends WidgetLoadingProps & WidgetOptionProps, Opts>(
  widgetType: Type,
  props: Props,
  optsFromProps: (ps: Props) => Opts,
): string | null {
  if (isLoadingWithUrl(props)) {
    return props.url
  } else if (isLoadingWithClientProxy(props)) {
    return useClientProxy(props.proxy, props.onProxyError)
  } else if (isLoadingWithPlatformApiSso(props)) {
    return usePlatformApiSso({
      widgetType,
      uiMessageWebviewUrlScheme: props.uiMessageWebviewUrlScheme || "",
      options: optsFromProps(props),
      ...props
    })
  }

  isLoadingWithBadProps()
}
