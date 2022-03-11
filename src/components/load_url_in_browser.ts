import { Linking } from "react-native"

export type LoadUrlInBrowserProps = {
  onLoadUrlInBrowser?: (url: string) => void
  onLoadUrlInBrowserError?: (url: string, error: Error) => void
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

function defaultOnLoadUrlInBrowser(url: string) {
  Linking.openURL(url)
}

function defaultOnLoadUrlInBrowserError(url: string, error: Error) {
  console.log(`Error loading ${url}: ${error}`)
}

export function loadUrlInBrowser(url: string, callbacks: LoadUrlInBrowserProps) {
  const onLoadUrlInBrowser = callbacks.onLoadUrlInBrowser || defaultOnLoadUrlInBrowser
  const onLoadUrlInBrowserError = callbacks.onLoadUrlInBrowserError || defaultOnLoadUrlInBrowserError

  try {
    onLoadUrlInBrowser(url)
  } catch (error) {
    onLoadUrlInBrowserError(url, asError(error))
  }
}
