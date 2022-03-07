import { useEffect, useState } from "react"

import { Type, WidgetOptionProps } from "../widget/configuration"

import { WidgetLoadingProps, UrlLoadingProps, ClientProxyLoadingProps, PlatformApiLoadingProps } from "./standard_props"
import { buildRequestParams as buildPlatformApiRequestParams, makeRequest as makePlatformApiRequest } from "../loader/platform_api"
import { genRequest as genClientProxyRequest, makeRequest as makeClientProxyRequest } from "../loader/client_proxy"

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

function isLoadingWithUrl(props: WidgetLoadingProps): props is UrlLoadingProps {
  return "url" in props
}

function isLoadingWithClientProxy(props: WidgetLoadingProps): props is ClientProxyLoadingProps {
  return "proxy" in props
}

function isLoadingWithPlatformApiSso(props: WidgetLoadingProps): props is PlatformApiLoadingProps {
  return "clientId" in props &&
    "apiKey" in props &&
    "userGuid" in props &&
    "environment" in props
}

function isLoadingWithBadProps(): never {
  throw new Error(badPropsMessage)
}

export function useWidgetUrl<Props extends WidgetLoadingProps & WidgetOptionProps, Opts>(
  widgetType: Type,
  props: Props,
  optsFromProps: (ps: Props) => Opts,
): string | null {
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null)

  useEffect(() => {
    if (isLoadingWithUrl(props)) {
      setWidgetUrl(props.url)
    } else if (isLoadingWithClientProxy(props)) {
      const { proxy, language } = props
      const buildProxyRequest = props.buildProxyRequest || ((req) => req)
      const onProxyRequestError = props.onProxyRequestError || defaultOnClientProxyRequestError
      const uiMessageWebviewUrlScheme = props.uiMessageWebviewUrlScheme || ""
      const options = optsFromProps(props)

      const req = genClientProxyRequest({ proxy, uiMessageWebviewUrlScheme, language, widgetType, options })

      makeClientProxyRequest(buildProxyRequest(req))
        .then((json) => setWidgetUrl(json.widget_url.url))
        .catch(onProxyRequestError)
    } else if (isLoadingWithPlatformApiSso(props)) {
      const { apiKey, clientId, userGuid, environment, language } = props
      const onSsoError = props.onSsoError || defaultOnPlatformApiError
      const uiMessageWebviewUrlScheme = props.uiMessageWebviewUrlScheme || ""
      const options = optsFromProps(props)

      const params = buildPlatformApiRequestParams<Opts>(apiKey, clientId, userGuid,
        environment, widgetType, uiMessageWebviewUrlScheme, language, options)

      makePlatformApiRequest(params)
        .then((response) => setWidgetUrl(response.widget_url.url))
        .catch((error) => onSsoError(error))
    } else {
      isLoadingWithBadProps()
    }
  }, [])

  return widgetUrl
}
