import { vi } from "vitest"

const callbacks: Record<string, Record<string, ((...args: unknown[]) => void)[]>> = {
  dimensions: {},
  linking: {},
}
let width = 200
let height = 600

export function triggerDeviceRotation() {
  // prettier-ignore
  [width, height] = [height, width]

  if ("change" in callbacks["dimensions"]) {
    callbacks["dimensions"]["change"].forEach((fn) => fn())
  }
}

export function triggerUrlChange(url: string) {
  if ("url" in callbacks["linking"]) {
    callbacks["linking"]["url"].forEach((fn) => fn({ url }))
  }
}

export const Dimensions = {
  addEventListener: vi.fn().mockImplementation((event, fn) => {
    callbacks["dimensions"][event] = callbacks["dimensions"][event] || []
    callbacks["dimensions"][event].push(fn)
  }),
  removeEventListener: vi.fn().mockImplementation((event, fn) => {
    callbacks["dimensions"][event] = callbacks["dimensions"][event] || []
    const index = callbacks["dimensions"][event].indexOf(fn)
    if (index > -1) {
      callbacks["dimensions"][event].splice(index, 1)
    }
  }),
  get: vi.fn().mockImplementation(() => ({
    height,
    width,
  })),
}

export const Linking = {
  openURL: vi.fn().mockImplementation((url) => {
    return url
  }),
  addEventListener: vi.fn().mockImplementation((event, fn) => {
    callbacks["linking"][event] = callbacks["linking"][event] || []
    callbacks["linking"][event].push(fn)
  }),
  removeEventListener: vi.fn().mockImplementation((event, fn) => {
    callbacks["linking"][event] = callbacks["linking"][event] || []
    const index = callbacks["linking"][event].indexOf(fn)
    if (index > -1) {
      callbacks["linking"][event].splice(index, 1)
    }
  }),
}

export const NativeModules = {
  RNCWebViewManager: {
    startLoadWithResult: vi.fn(),
  },
}

vi.mock("react-native", () => ({
  SafeAreaView: "SafeAreaView",
  Dimensions,
  Linking,
  NativeModules,
}))
