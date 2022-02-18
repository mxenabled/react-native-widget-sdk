import { Linking } from "react-native"

import { WidgetLoadUrlCallbackProps } from "./standard_props"
import { asError } from "../utils/error"

function defaultOnLoadUrl(url: string) {
  Linking.openURL(url)
}

function defaultOnLoadUrlError(url: string, error: Error) {
  console.log(`Error loading ${url}: ${error}`)
}

export function loadUrlInBrowser(callbacks: WidgetLoadUrlCallbackProps, url: string) {
  const onLoadUrl = callbacks.onLoadUrl || defaultOnLoadUrl
  const onLoadUrlError = callbacks.onLoadUrlError || defaultOnLoadUrlError

  try {
    onLoadUrl(url)
  } catch (error) {
    onLoadUrlError(url, asError(error))
  }
}
