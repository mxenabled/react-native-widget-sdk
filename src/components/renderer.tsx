import React, { useRef, MutableRefObject, ReactElement } from "react"
import { SafeAreaView, StyleProp, ViewStyle } from "react-native"
import { WebView } from "react-native-webview"
import { Payload } from "@mxenabled/widget-post-message-definitions"

import { Props, useSsoUrl } from "../sso"
import { loadUrlInBrowser, LoadUrlInBrowserProps } from "./load_url_in_browser"
import { makeRequestInterceptor } from "./request_interceptor"
import { useFullscreenStyles } from "./screen_dimensions"
import { sdkVersion } from "../version"

export type StylingProps = {
  style?: StyleProp<ViewStyle>
  webViewStyle?: StyleProp<ViewStyle>
}

type MaybeWebViewRef = MutableRefObject<WebView | null>
type BaseProps<Configuration> = Props<Configuration> & StylingProps & LoadUrlInBrowserProps

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
      dispatchEvent(url, props)
    },
    onLoadUrlInBrowser: (url) => {
      loadUrlInBrowser(url, props)
    },
  })

  const setReactNativeSDKVersionOnWindow = `
    window.MXReactNativeSDKVersion = "${sdkVersion}";
  `

  return [
    ref,
    <SafeAreaView testID="widget_view" style={style}>
      <WebView
        testID="widget_webview"
        style={props.webViewStyle}
        ref={ref}
        scrollEnabled={true}
        source={{ uri: url }}
        originWhitelist={["*"]}
        cacheMode="LOAD_NO_CACHE"
        injectedJavaScriptBeforeContentLoaded={setReactNativeSDKVersionOnWindow}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={(event) => {
          console.log("WebView message:", event.nativeEvent.data)
        }}
        incognito={true}
        onShouldStartLoadWithRequest={handler}
        onError={props.onWebViewError}
      />
    </SafeAreaView>,
  ]
}
