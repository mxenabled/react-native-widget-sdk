import React, { ReactElement } from "react"
import { StyleProp, ViewStyle, View } from "react-native"
import { WebView } from "react-native-webview"
import { Payload } from "@mxenabled/widget-post-message-definitions"
import * as WebBrowser from "expo-web-browser"
import { Props, useSsoUrl } from "../sso"
import { makeRequestInterceptor } from "./request_interceptor"
import { useFullscreenStyles } from "./screen_dimensions"
import { sdkVersion } from "../version"

export type StylingProps = {
  style?: StyleProp<ViewStyle>
  webViewStyle?: StyleProp<ViewStyle>
}

type BaseProps<Configuration> = Props<Configuration> & StylingProps

export function useWidgetRenderer<Configuration>(
  props: BaseProps<Configuration>,
  dispatchEvent: (url: string, callbacks: BaseProps<Configuration>) => Payload | undefined,
): ReactElement {
  const url = useSsoUrl(props)
  const fullscreenStyles = useFullscreenStyles()
  const style = props.style || fullscreenStyles

  if (!url) {
    return <View style={style} />
  }

  const handler = makeRequestInterceptor(url, {
    onIntercept: (url) => {
      dispatchEvent(url, props)
    },
  })

  const setReactNativeSDKVersionOnWindow = `
    window.MXReactNativeSDKVersion = "${sdkVersion}";
  `

  return (
    <View testID="widget_view" style={style}>
      <WebView
        testID="widget_webview"
        style={props.webViewStyle}
        scrollEnabled={true}
        source={{ uri: url }}
        originWhitelist={["*"]}
        cacheMode="LOAD_NO_CACHE"
        injectedJavaScriptBeforeContentLoaded={setReactNativeSDKVersionOnWindow}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        incognito={true}
        onOpenWindow={(event) => {
          WebBrowser.openBrowserAsync(event.nativeEvent.targetUrl)
        }}
        onShouldStartLoadWithRequest={handler}
        onError={props.onWebViewError}
      />
    </View>
  )
}
