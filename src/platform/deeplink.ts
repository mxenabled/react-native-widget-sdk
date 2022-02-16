import { Linking } from "react-native"

export type UrlChangeEvent = {
  url: string
}

export const onUrlChange = (fn: (event: UrlChangeEvent) => void, dispatchBufferSeconds = 5) => {
  const dispatchTimes: Record<string, Date> = {}
  const callback = (event: UrlChangeEvent) => {
    const now = new Date()
    const url = event.url
    if (!(url in dispatchTimes) || dispatchTimes[url].getTime() + dispatchBufferSeconds < now.getTime()) {
      dispatchTimes[event.url] = now
      fn(event)
    }
  }

  Linking.addEventListener("url", callback)

  return () =>
    Linking.removeEventListener("url", callback)
}
