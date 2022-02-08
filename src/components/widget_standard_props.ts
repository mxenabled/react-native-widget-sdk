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

export type LoadUrlCallbackProps = {
  onLoadUrl?: (url: string) => void
  onLoadUrlError?: (url: string, error: Error) => void
}
