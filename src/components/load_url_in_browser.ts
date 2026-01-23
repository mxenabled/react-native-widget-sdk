import * as WebBrowser from "expo-web-browser"

function asError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  } else if (typeof error === "string") {
    new Error(error)
  }

  return new Error(((error || {}) as { valueOf(): string }).valueOf())
}

function onLoadUrlInBrowserError(url: string, error: Error) {
  console.log(`Error loading ${url}: ${error}`)
}

export async function loadUrlInBrowser(url: string) {
  try {
    await WebBrowser.openAuthSessionAsync(url)
  } catch (error) {
    onLoadUrlInBrowserError(url, asError(error))
  }
}
