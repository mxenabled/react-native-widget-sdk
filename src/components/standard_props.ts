import { StyleProp, ViewStyle } from "react-native"

export type WidgetStylingProps = {
  style?: StyleProp<ViewStyle>
}

export type WidgetLoadUrlCallbackProps = {
  onLoadUrl?: (url: string) => void
  onLoadUrlError?: (url: string, error: Error) => void
}
