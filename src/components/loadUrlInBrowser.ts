import * as WebBrowser from "expo-web-browser"

export async function loadUrlInBrowser(url: string) {
  try {
    await WebBrowser.openAuthSessionAsync(url)
  } catch (error) {
    console.log(`Error loading ${url}: ${error}`)
  }
}
