import { StyleProp, ViewStyle } from "react-native"
import { Environment } from "../loader/environment"
import { Request } from "../loader/client_proxy"

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

export type ClientProxyLoadingProps = {
  proxy: string
  buildProxyRequest?: (req: Request) => Request
  onProxyRequestError?: (error: Error) => void
}

export type WidgetLoadingProps =
  | UrlLoadingProps
  | PlatformApiLoadingProps
  | ClientProxyLoadingProps

export type WidgetStylingProps = {
  style?: StyleProp<ViewStyle>
}

export type WidgetLoadUrlCallbackProps = {
  onLoadUrl?: (url: string) => void
  onLoadUrlError?: (url: string, error: Error) => void
}
