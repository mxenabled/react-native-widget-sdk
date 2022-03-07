import React, { useRef, MutableRefObject, ReactElement } from "react"
import { SafeAreaView } from "react-native"
import { WebView } from "react-native-webview"

import { Type, WidgetOptionProps } from "../widget/configuration"
import { WidgetLoadingProps, WidgetStylingProps, WidgetLoadUrlCallbackProps } from "./standard_props"

import { makeRequestInterceptor } from "./request_interceptor"
import { useWidgetUrl } from "./loading_strategy"
import { useFullscreenStyles } from "./screen_dimensions"

type MaybeWebViewRef = MutableRefObject<WebView | null>
type BaseProps =
  & WidgetLoadingProps
  & WidgetStylingProps
  & WidgetOptionProps
  & WidgetLoadUrlCallbackProps

export function useWidgetRenderer<Props extends BaseProps, Opts>(
  widgetType: Type,
  props: Props,
  optsFromProps: (ps: Props) => Opts,
  handleRequest: (url: string, callbacks: Props) => void,
): ReactElement {
  const [_ref, elem] = useWidgetRendererWithRef(
    widgetType,
    props,
    optsFromProps,
    handleRequest,
  )

  return elem
}

export function useWidgetRendererWithRef<Props extends BaseProps, Opts>(
  widgetType: Type,
  props: Props,
  optsFromProps: (ps: Props) => Opts,
  handleRequest: (url: string, callbacks: Props) => void,
): [MaybeWebViewRef, ReactElement] {
  const ref = useRef<WebView>(null)
  const widgetUrl = useWidgetUrl(widgetType, props, optsFromProps)
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
