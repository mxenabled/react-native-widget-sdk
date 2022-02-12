import * as ReactNative from "react-native"

const callbacks: Record<string, (() => void)[]> = {}
let width = 200
let height = 600

export function rotateOrientation() {
  [width, height] = [height, width]

  if ("change" in callbacks) {
    callbacks["change"].forEach((fn) => fn())
  }
}

export const Dimensions = {
  addEventListener: jest.fn().mockImplementation((event, fn) => {
    callbacks[event] = callbacks[event] || []
    callbacks[event].push(fn)
  }),
  removeEventListener: jest.fn().mockImplementation((event, fn) => {
    callbacks[event] = callbacks[event] || []
    const index = callbacks[event].indexOf(fn)
    if (index > -1) {
      callbacks[event].splice(index, 1)
    }
  }),
  get: jest.fn().mockImplementation(() => ({
    height,
    width,
  }))
}

jest.doMock("react-native", () =>
  Object.setPrototypeOf(
    {
      Dimensions,
    },
    ReactNative
  ))
