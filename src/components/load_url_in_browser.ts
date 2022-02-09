import { Linking } from "react-native"

import { LoadUrlCallbackProps } from "./widget_standard_props"
import { asError } from "../utils/error"

function defaultOnLoadUrl(url: string) {
  Linking.openURL(url)
}

function defaultOnLoadUrlError(url: string, error: Error) {
  console.log(`Error loading ${url}: ${error}`)
}

export default function loadUrlInBrowser(callbacks: LoadUrlCallbackProps, url: string) {
  const onLoadUrl = callbacks.onLoadUrl || defaultOnLoadUrl
  const onLoadUrlError = callbacks.onLoadUrlError || defaultOnLoadUrlError

  try {
    onLoadUrl(url)
  } catch (error) {
    onLoadUrlError(url, asError(error))
  }
}
