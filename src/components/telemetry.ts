import { WebViewRef } from "./webview"
import { sdkVersion } from "../version"

export type SdkTelemetryProps = {
  sendSdkInfoPostMessage?: (webViewRef: WebViewRef, msg: string) => void
}

export function postSdkInfoMessage(webViewRef: WebViewRef, props: SdkTelemetryProps) {
  if (!webViewRef.current) {
    return
  }

  const message = JSON.stringify({
    mx: true,
    type: "mx/sdk/info",
    metadata: {
      sdk: "rn",
      version: sdkVersion,
    },
  })

  if (props.sendSdkInfoPostMessage) {
    props.sendSdkInfoPostMessage(webViewRef, message)
  } else {
    webViewRef.current.postMessage(message)
  }
}
