import { useEffect, useState } from "react"

import { buildRequestParams, makeRequest, RequestParams } from "../loader/platform_api_sso_request"
import { PlatformApiLoadingProps } from "./standard_props"

const defaultOnError = (error: Error) =>
  console.log(`Error making SSO request: ${error}`)

export function usePlatformApiSso<Options>({
  apiKey,
  clientId,
  userGuid,
  environment,
  widgetType,
  options,
  uiMessageWebviewUrlScheme,
  onSsoError = defaultOnError,
}: PlatformApiLoadingProps & Required<Pick<RequestParams<Options>, "widgetType" | "options" | "uiMessageWebviewUrlScheme">>) {
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null)

  const params = buildRequestParams<Options>(apiKey, clientId, userGuid,
    environment, widgetType, uiMessageWebviewUrlScheme, options)

  useEffect(() => {
    makeRequest(params)
      .then((response) => setWidgetUrl(response.widget_url.url))
      .catch((error) => onSsoError(error))
  }, [])

  return widgetUrl
}
