import React, { useRef, MutableRefObject, ReactElement } from "react"
import { SafeAreaView, StyleProp, ViewStyle } from "react-native"
import { WebView } from "react-native-webview"
import { Payload, Type } from "@mxenabled/widget-post-message-definitions"

import { Props, useSsoUrl } from "../sso"
import { loadUrlInBrowser, LoadUrlInBrowserProps } from "./load_url_in_browser"
import { makeRequestInterceptor } from "./request_interceptor"
import { useFullscreenStyles } from "./screen_dimensions"
import { SdkTelemetryProps, postSdkInfoMessage } from "./telemetry"

export type StylingProps = {
  style?: StyleProp<ViewStyle>,
  webviewStyle?: StyleProp<ViewStyle>
}

type MaybeWebViewRef = MutableRefObject<WebView | null>
type BaseProps<Configuration> = Props<Configuration> &
  StylingProps &
  LoadUrlInBrowserProps &
  SdkTelemetryProps

export function useWidgetRenderer<Configuration>(
  props: BaseProps<Configuration>,
  dispatchEvent: (url: string, callbacks: BaseProps<Configuration>) => Payload | undefined,
): ReactElement {
  const [_ref, elem] = useWidgetRendererWithRef(props, dispatchEvent)
  return elem
}

export function useWidgetRendererWithRef<Configuration>(
  props: BaseProps<Configuration>,
  dispatchEvent: (url: string, callbacks: BaseProps<Configuration>) => Payload | undefined,
): [MaybeWebViewRef, ReactElement] {
  const ref = useRef<WebView>(null)
  const url = useSsoUrl(props)
  const fullscreenStyles = useFullscreenStyles()
  const style = props.style || fullscreenStyles

  if (!url) {
    return [ref, <SafeAreaView style={style} />]
  }

  const scheme = props.uiMessageWebviewUrlScheme || "mx"
  const handler = makeRequestInterceptor(url, scheme, {
    onIntercept: (url) => {
      const event = dispatchEvent(url, props)
      if (event && event.type === Type.Load) {
        postSdkInfoMessage(ref, props)
      }
    },
    onLoadUrlInBrowser: (url) => {
      loadUrlInBrowser(url, props)
    },
  })

  return [
    ref,
    <SafeAreaView testID="widget_view" style={style}>
      <WebView
        testID="widget_webview"
        style={props.webviewStyle}
        ref={ref}
        scrollEnabled={true}
        source={{ uri: url }}
        originWhitelist={["*"]}
        cacheMode="LOAD_NO_CACHE"
        javaScriptEnabled={true}
        domStorageEnabled={true}
        incognito={true}
        onShouldStartLoadWithRequest={handler}
        onError={props.onError}
      />
    </SafeAreaView>,
  ]
}
