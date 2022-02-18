import React, { useRef, MutableRefObject, ReactElement } from "react"
import { SafeAreaView } from "react-native"
import { WebView, WebViewNavigation } from "react-native-webview"

import { Type, BaseWidgetProps } from "../widget/configuration"
import { WidgetLoadingProps, WidgetStylingProps, LoadUrlCallbackProps } from "./standard_props"

import { makeRequestInterceptor } from "./request_interceptor"
import { useWidgetUrl } from "./loading_strategy"
import { useFullscreenStyles } from "./screen_dimensions"

type MaybeWebViewRef = MutableRefObject<WebView | null>
type BaseProps =
  & WidgetLoadingProps
  & WidgetStylingProps
  & BaseWidgetProps
  & LoadUrlCallbackProps

export function useWidgetRenderer<Props extends BaseProps, Opts>(
  widgetType: Type,
  props: Props,
  optsFromProps: (ps: Props) => Opts,
  handleRequest: (callbacks: Props, request: WebViewNavigation) => void,
): [MaybeWebViewRef, ReactElement] {
  const ref = useRef<WebView>(null)
  const widgetUrl = useWidgetUrl(Type.ConnectWidget, props, optsFromProps)
  const fullscreenStyles = useFullscreenStyles()
  const style = props.style || fullscreenStyles

  if (!widgetUrl) {
    return [ref, <SafeAreaView style={style} />]
  }

  const scheme = props.uiMessageWebviewUrlScheme || "mx"
  const handler = makeRequestInterceptor(widgetUrl, scheme, props, handleRequest)

  return [ref, (
    <SafeAreaView testID={`${widgetType}_view`} style={style}>
      <WebView
        testID={`${widgetType}_webview`}
        ref={ref}
        scrollEnabled={true}
        source={{ uri: widgetUrl }}
        originWhitelist={["*"]}
        cacheMode="LOAD_NO_CACHE"
        javaScriptEnabled={true}
        domStorageEnabled={true}
        incognito={true}
        onShouldStartLoadWithRequest={handler}
      />
    </SafeAreaView>
  )]
}
