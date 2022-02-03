import { Dimensions } from "react-native"

enum Orientation {
  Portrait,
  Landscape,
}

export const isPortrait = () =>
  getScreenHeight() >= getScreenWidth()

export const isLandscape = () =>
  getScreenHeight() <= getScreenWidth()

export const getScreenHeight = () =>
  getScreen().height

export const getScreenWidth = () =>
  getScreen().width

export const getScreen = () =>
  Dimensions.get("screen")

export const onDimensionChange = (fn: (orientation: Orientation) => void) => {
  const callback = () =>
    fn(isPortrait() ? Orientation.Portrait : Orientation.Landscape)

  Dimensions.addEventListener("change", callback)

  return () =>
    Dimensions.removeEventListener("change", callback)
}
