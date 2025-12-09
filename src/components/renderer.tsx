import React, { useRef, MutableRefObject, ReactElement } from "react"
import { SafeAreaView, StyleProp, ViewStyle } from "react-native"
import { WebView } from "react-native-webview"
import { Payload, Type } from "@mxenabled/widget-post-message-definitions"

import { Props, useSsoUrl } from "../sso"
import { loadUrlInBrowser, LoadUrlInBrowserProps } from "./load_url_in_browser"
import { makeRequestInterceptor } from "./request_interceptor"
import { useFullscreenStyles } from "./screen_dimensions"
import { SdkTelemetryProps, postSdkInfoMessage } from "./telemetry"
import { sdkVersion } from "../version"

export type StylingProps = {
  style?: StyleProp<ViewStyle>
  webViewStyle?: StyleProp<ViewStyle>
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

  const jsCode = `
        // Create an object with the properties you want to check
        const propertiesToCheck = {
          app: window.app,
          MXReactNativeSDKVersion: window.MXReactNativeSDKVersion
        };
        
        // Post the data back to React Native
        window.ReactNativeWebView.postMessage(JSON.stringify({ 
          type: 'windowContent', 
          content: propertiesToCheck 
        }));
        
        // Must return true to avoid errors in some Android versions
        true;
      `

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
        injectedJavaScript={jsCode}
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
