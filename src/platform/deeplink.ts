import { Linking as RNLinking } from "react-native"

let Linking: RNLinking
try {
  Linking = require("expo-linking")
} catch (err) {
  Linking = RNLinking
}

export type UrlChangeEvent = {
  url: string
}

export const onUrlChange = (fn: (event: UrlChangeEvent) => void, dispatchBufferSeconds = 5) => {
  const dispatchTimes: Record<string, Date> = {}
  const callback = (event: UrlChangeEvent) => {
    const now = new Date()
    const url = event.url
    if (
      !(url in dispatchTimes) ||
      dispatchTimes[url].getTime() + dispatchBufferSeconds < now.getTime()
    ) {
      dispatchTimes[event.url] = now
      fn(event)
    }
  }

  const sub = Linking.addEventListener("url", callback)

  /* removeEventListener is deprecated but addEventListener does not return a
   * subscription object in versions of React Native v0.64 or below. We can
   * remove this condition when v64 (or below) is no longer supported.
   */
  return () => (sub ? sub.remove() : Linking.removeEventListener("url", callback))
}
