import { Linking } from "react-native"

export type UrlChangeEvent = {
  url: string
}

export const onUrlChange = (fn: (event: UrlChangeEvent) => void) => {
  const callback = (event: UrlChangeEvent) =>
    fn(event)

  Linking.addEventListener("url", callback)

  return () =>
    Linking.removeEventListener("url", callback)
}
