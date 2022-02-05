import { useEffect, useState } from "react"

import { getScreenWidth, getScreenHeight, onDimensionChange } from "../platform/screen"

export function useScreenDimensions() {
  const [screenWidth, setScreenWidth] = useState(getScreenWidth())
  const [screenHeight, setScreenHeight] = useState(getScreenHeight())

  useEffect(() => {
    return onDimensionChange((orientation) => {
      setScreenWidth(getScreenWidth())
      setScreenHeight(getScreenHeight())
    })
  })

  return [screenWidth, screenHeight]
}
