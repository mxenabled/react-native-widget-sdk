import { useEffect, useState } from "react"

import { Type, WidgetOptionProps } from "../widget/configuration"

import { WidgetLoadingProps, UrlLoadingProps, ClientProxyLoadingProps, PlatformApiLoadingProps } from "./standard_props"
import { RequestParams, buildRequestParams as buildPlatformApiRequestParams, makeRequest as makePlatformApiRequest } from "../loader/platform_api"
import { genRequest as genClientProxyRequest, makeRequest as makeClientProxyRequest } from "../loader/client_proxy"

type LoadingParams<T, Options> = T & Required<Pick<RequestParams<Options>, "widgetType" | "options" | "uiMessageWebviewUrlScheme">>

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

function defaultOnClientProxyRequestError(error: Error) {
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

export function useClientProxy<Options>({
  proxy,
  widgetType,
  options,
  uiMessageWebviewUrlScheme,
  buildProxyRequest = (req) => req,
  onProxyRequestError = defaultOnClientProxyRequestError,
}: LoadingParams<ClientProxyLoadingProps, Options>) {
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null)
  const req = genClientProxyRequest({ proxy, uiMessageWebviewUrlScheme, widgetType, options })

  useEffect(() => {
    makeClientProxyRequest(buildProxyRequest(req))
      .then((json) => setWidgetUrl(json.widget_url.url))
      .catch(onProxyRequestError)
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
}: LoadingParams<PlatformApiLoadingProps, Options>) {
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null)

  const params = buildPlatformApiRequestParams<Options>(apiKey, clientId, userGuid,
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
    return useClientProxy({
      widgetType,
      uiMessageWebviewUrlScheme: props.uiMessageWebviewUrlScheme || "",
      options: optsFromProps(props),
      ...props
    })
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
