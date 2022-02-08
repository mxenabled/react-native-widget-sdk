import { PlatformApiSsoProps } from "./platform_api_sso"

type UrlProps = {
  url: string
}

export type WidgetLoadingProps
  = PlatformApiSsoProps
  | UrlProps

const badPropsMessage = `Missing required widget props!

Component needs either a 'url' prop or the following props to make an API request:

  - apiKey
  - clientId
  - environment
  - userGuid`

export function isLoadingWithUrl(props: Object): props is UrlProps {
  return "url" in props
}

export function isLoadingWithPlatformApiSso(props: Object): props is PlatformApiSsoProps {
  return "clientId" in props &&
    "apiKey" in props &&
    "userGuid" in props &&
    "environment" in props
}

export function isLoadingWithBadProps(): never {
  throw new Error(badPropsMessage)
}
