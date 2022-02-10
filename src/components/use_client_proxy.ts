import { useEffect, useState } from "react"

const defaultOnError = (error: Error) =>
  console.log(`Error making request to proxy API server: ${error}`)

export default function useClientProxy<Options>(url: string, onError: (error: Error) => void = defaultOnError): string | null {
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null)

  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`status code: ${response.status}`)
        }

        return response
      })
      .then((response) => response.json())
      .then((json) => setWidgetUrl(json.widget_url.url))
      .catch(onError)
  }, [])

  return widgetUrl
}
