import { useEffect, useState } from "react"
import { StyleProp, ViewStyle } from "react-native"

import { getScreenWidth, getScreenHeight, onDimensionChange } from "../platform/screen"

export function useScreenDimensions() {
  const [screenWidth, setScreenWidth] = useState(getScreenWidth())
  const [screenHeight, setScreenHeight] = useState(getScreenHeight())

  useEffect(() => {
    return onDimensionChange((_orientation) => {
      setScreenWidth(getScreenWidth())
      setScreenHeight(getScreenHeight())
    })
  })

  return [screenWidth, screenHeight]
}

export function useFullscreenStyles(): StyleProp<ViewStyle> {
  const [screenWidth, screenHeight] = useScreenDimensions()

  return {
    width: screenWidth,
    height: screenHeight,
    overflow: "hidden",
  }
}
