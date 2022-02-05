import { useEffect, useState } from "react"

import { makeRequest, SsoRequestParams } from "../loader/sso"

export function useSso<Mode>(params: SsoRequestParams<Mode>, onError: (error: Error) => void) {
  const [widgetSsoUrl, setWidgetSsoUrl] = useState<string | null>(null)

  useEffect(() => {
    makeRequest(params)
      .then((response) => setWidgetSsoUrl(response.widget_url.url))
      .catch((error) => onError(error))
  }, [])

  return widgetSsoUrl
}
