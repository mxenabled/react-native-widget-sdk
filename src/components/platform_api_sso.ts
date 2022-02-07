import { useEffect, useState } from "react"

import { makeRequest, RequestParams } from "../loader/platform_api_sso_request"
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

export function usePlatformApiSso<Mode>(
  params: RequestParams<Mode>,
  onError: ErrorCallback = defaultOnError
) {
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null)

  useEffect(() => {
    makeRequest(params)
      .then((response) => setWidgetUrl(response.widget_url.url))
      .catch((error) => onError(error))
  }, [])

  return widgetUrl
}
