import React, { useRef, MutableRefObject, ReactElement } from "react"
import { SafeAreaView } from "react-native"
import { WebView } from "react-native-webview"

import { Props, useSsoUrl } from "../sso"
import { WidgetStylingProps, WidgetLoadUrlCallbackProps } from "./standard_props"

import { makeRequestInterceptor } from "./request_interceptor"
import { useFullscreenStyles } from "./screen_dimensions"

type MaybeWebViewRef = MutableRefObject<WebView | null>
type BaseProps<Configuration> =
  & Props<Configuration>
  & WidgetStylingProps
  & WidgetLoadUrlCallbackProps

export function useWidgetRenderer<Configuration>(
  props: BaseProps<Configuration>,
  dispatchEvent: (url: string, callbacks: BaseProps<Configuration>) => void,
): ReactElement {
  const [_ref, elem] = useWidgetRendererWithRef(props, dispatchEvent)
  return elem
}

export function useWidgetRendererWithRef<Configuration>(
  props: BaseProps<Configuration>,
  dispatchEvent: (url: string, callbacks: BaseProps<Configuration>) => void,
): [MaybeWebViewRef, ReactElement] {
  const widgetType = props.widgetType
  const ref = useRef<WebView>(null)
  const url = useSsoUrl(props)
  const fullscreenStyles = useFullscreenStyles()
  const style = props.style || fullscreenStyles

  if (!url) {
    return [ref, <SafeAreaView style={style} />]
  }

  const scheme = props.uiMessageWebviewUrlScheme || "mx"
  const handler = makeRequestInterceptor(url, scheme, props, dispatchEvent)

  return [ref, (
    <SafeAreaView testID={`${widgetType}_view`} style={style}>
      <WebView
        testID={`${widgetType}_webview`}
        ref={ref}
        scrollEnabled={true}
        source={{ uri: url }}
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
