import { useEffect, useState } from "react"

import { makeRequest, SsoRequestParams } from "../loader/sso_request"
import { Environment } from "../loader/environment"

type SsoErrorCallback = (error: Error) => void

export type SsoProps = {
  clientId: string
  apiKey: string
  userGuid: string
  environment: Environment | string
  onSsoError?: SsoErrorCallback
}

const defaultOnSsoError = (error: Error) =>
  console.log(`Error making SSO request: ${error}`)

export function useSso<Mode>(
  params: SsoRequestParams<Mode>,
  onSsoError: SsoErrorCallback = defaultOnSsoError
) {
  const [widgetSsoUrl, setWidgetSsoUrl] = useState<string | null>(null)

  useEffect(() => {
    makeRequest(params)
      .then((response) => setWidgetSsoUrl(response.widget_url.url))
      .catch((error) => onSsoError(error))
  }, [])

  return widgetSsoUrl
}
