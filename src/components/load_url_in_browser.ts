import { Linking } from "react-native"

function asError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  } else if (typeof error === "string") {
    new Error(error)
  }

  return new Error(((error || {}) as { valueOf(): string }).valueOf())
}

function onLoadUrlInBrowser(url: string) {
  Linking.openURL(url)
}

function onLoadUrlInBrowserError(url: string, error: Error) {
  console.log(`Error loading ${url}: ${error}`)
}

export function loadUrlInBrowser(url: string) {
  try {
    onLoadUrlInBrowser(url)
  } catch (error) {
    onLoadUrlInBrowserError(url, asError(error))
  }
}
