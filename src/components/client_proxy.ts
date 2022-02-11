import { useEffect, useState } from "react"

import { makeRequest } from "../loader/client_proxy"

const defaultOnError = (error: Error) =>
  console.log(`Error making request to proxy API server: ${error}`)

export function useClientProxy<Options>(url: string, onError: (error: Error) => void = defaultOnError): string | null {
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null)

  useEffect(() => {
    makeRequest(url)
      .then((json) => setWidgetUrl(json.widget_url.url))
      .catch(onError)
  }, [])

  return widgetUrl
}
