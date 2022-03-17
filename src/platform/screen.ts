import { Dimensions } from "react-native"

enum Orientation {
  Portrait,
  Landscape,
}

export const isPortrait = () => getScreenHeight() >= getScreenWidth()
export const isLandscape = () => getScreenHeight() <= getScreenWidth()

export const getScreenHeight = () => getScreen().height
export const getScreenWidth = () => getScreen().width
export const getScreen = () => Dimensions.get("screen")

export const onDimensionChange = (fn: (orientation: Orientation) => void) => {
  const callback = () => fn(isPortrait() ? Orientation.Portrait : Orientation.Landscape)
  const sub = Dimensions.addEventListener("change", callback)

  /* removeEventListener is deprecated but addEventListener does not return a
   * subscription object in versions of React Native v0.64 or below. We can
   * remove this condition when v64 (or below) is no longer supported.
   */
  return () => (sub ? sub.remove() : Dimensions.removeEventListener("change", callback))
}
