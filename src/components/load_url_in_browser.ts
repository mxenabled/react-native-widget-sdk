import { Linking } from "react-native"

export type LoadUrlInBrowserProps = {
  onLoadBrowserUrl?: (url: string) => void
  onLoadBrowserUrlError?: (url: string, error: Error) => void
}

function asError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  } else if (typeof error === "string") {
    new Error(error)
  }

  return new Error(
    ((error || {}) as { valueOf(): string }).valueOf()
  )
}

function defaultOnLoadBrowserUrl(url: string) {
  Linking.openURL(url)
}

function defaultOnLoadBrowserUrlError(url: string, error: Error) {
  console.log(`Error loading ${url}: ${error}`)
}

export function loadUrlInBrowser(url: string, callbacks: LoadUrlInBrowserProps) {
  const onLoadBrowserUrl = callbacks.onLoadBrowserUrl || defaultOnLoadBrowserUrl
  const onLoadBrowserUrlError = callbacks.onLoadBrowserUrlError || defaultOnLoadBrowserUrlError

  try {
    onLoadBrowserUrl(url)
  } catch (error) {
    onLoadBrowserUrlError(url, asError(error))
  }
}
