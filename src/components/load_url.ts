import { Linking } from "react-native"

export type LoadUrlCallbacks = {
  onLoadUrl?: (url: string) => void
  onLoadUrlError?: (url: string, error: Error) => void
}

export const defaultOnLoadUrl = (url: string) =>
  Linking.openURL(url)

export const defaultOnLoadUrlError = (url: string, error: Error) =>
  console.log(`Error loading ${url}: ${error}`)

export const loadUrl = (callbacks: LoadUrlCallbacks, url: string) => {
  const onLoadUrl = callbacks.onLoadUrl || defaultOnLoadUrl
  const onLoadUrlError = callbacks.onLoadUrlError || defaultOnLoadUrlError

  try {
    onLoadUrl(url)
  } catch (error) {
    if (error instanceof Error) {
      onLoadUrlError(url, error)
    } else if (typeof error === "string") {
      onLoadUrlError(url, new Error(error))
    } else {
      onLoadUrlError(url, new Error(
        ((error || {}) as {valueOf(): string}).valueOf()
      ))
    }
  }
}
