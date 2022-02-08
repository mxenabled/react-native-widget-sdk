import { useEffect, useState } from "react"

import { buildRequestParams, makeRequest, RequestParams } from "../loader/platform_api_sso_request"
import { Environment } from "../loader/environment"

type ErrorCallback = (error: Error) => void

export type PlatformApiSsoProps = {
  clientId: string
  apiKey: string
  userGuid: string
  environment: Environment | string
  onSsoError?: ErrorCallback
}

const defaultOnError = (error: Error) =>
  console.log(`Error making SSO request: ${error}`)

export function usePlatformApiSso<Mode>({
  apiKey,
  clientId,
  userGuid,
  environment,
  widgetType,
  options = {},
  onSsoError = defaultOnError,
}: PlatformApiSsoProps & Pick<RequestParams<Mode>, "widgetType" | "options">) {
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null)

  const params = buildRequestParams(apiKey, clientId, userGuid,
    environment, widgetType, options)

  useEffect(() => {
    makeRequest(params)
      .then((response) => setWidgetUrl(response.widget_url.url))
      .catch((error) => onSsoError(error))
  }, [])

  return widgetUrl
}
