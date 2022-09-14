import { MutableRefObject } from "react"
import { WebView } from "react-native-webview"

export type WebViewRef = MutableRefObject<WebView | null>
