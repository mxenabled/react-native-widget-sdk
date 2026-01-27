import { WebViewNavigation } from "react-native-webview"
import * as WebBrowser from "expo-web-browser"

type Callbacks = {
  onIntercept: (url: string) => void
}

export function makeRequestInterceptor(widgetUrl: string, callbacks: Callbacks) {
  return (request: WebViewNavigation) => {
    const { protocol } = new URL(request.url)

    if (request.url === widgetUrl) {
      return true
    } else if (protocol === "mx:") {
      callbacks.onIntercept(request.url)
      return false
    } else {
      WebBrowser.openBrowserAsync(request.url)
      return false
    }
  }
}
