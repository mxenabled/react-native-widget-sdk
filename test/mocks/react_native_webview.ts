import { vi } from "vitest"

vi.mock("react-native-webview", () => {
  const { View } = require("react-native")
  return {
    __esModule: true,
    default: View,
    WebView: View,
  }
})
