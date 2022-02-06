import * as ReactNative from "react-native"

export const Dimensions = {
  addEventListener: jest.fn().mockReturnValue(() => {}),
  removeEventListener: jest.fn().mockReturnValue(() => {}),
  get: jest.fn().mockReturnValue({ width: 200, height: 600 })
}

jest.doMock("react-native", () =>
  Object.setPrototypeOf(
    {
      Dimensions,
    },
    ReactNative
  ))
