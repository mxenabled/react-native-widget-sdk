import { UrlLoadingProps, PlatformApiLoadingProps } from "./widget_standard_props"

const badPropsMessage = `Missing required widget props!

Component needs either a 'url' prop or the following props to make an API request:

  - apiKey
  - clientId
  - environment
  - userGuid`

export function isLoadingWithUrl(props: Object): props is UrlLoadingProps {
  return "url" in props
}

export function isLoadingWithPlatformApiSso(props: Object): props is PlatformApiLoadingProps {
  return "clientId" in props &&
    "apiKey" in props &&
    "userGuid" in props &&
    "environment" in props
}

export function isLoadingWithBadProps(): never {
  throw new Error(badPropsMessage)
}
