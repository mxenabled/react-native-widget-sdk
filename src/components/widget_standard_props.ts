import { StyleProp, ViewStyle } from "react-native"
import { Environment } from "../loader/environment"

export type UrlLoadingProps = {
  url: string
}

export type PlatformApiLoadingProps = {
  clientId: string
  apiKey: string
  userGuid: string
  environment: Environment | string
  onSsoError?: (error: Error) => void
}

export type WidgetLoadingProps
  = UrlLoadingProps
  | PlatformApiLoadingProps

export type WidgetStylingProps = {
  style?: StyleProp<ViewStyle>
}

export type LoadUrlCallbackProps = {
  onLoadUrl?: (url: string) => void
  onLoadUrlError?: (url: string, error: Error) => void
}
