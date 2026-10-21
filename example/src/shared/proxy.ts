import { Platform } from "react-native"

// The Android emulator reaches the host machine through 10.0.2.2. CI builds set
// EXPO_PUBLIC_PROXY_BASE_URL so a Sauce Labs device can reach the proxy through
// Sauce Connect.
//
// Expo inlines EXPO_PUBLIC_* values into the JS bundle at build time, so:
// - keep the direct `process.env.EXPO_PUBLIC_PROXY_BASE_URL` reference;
//   destructuring or `process.env[name]` isn't inlined
// - never put a secret in an EXPO_PUBLIC_* variable; it ends up in the app
const defaultBaseUrl = Platform.OS === "android" ? "http://10.0.2.2:8089" : "http://localhost:8089"
const proxyBaseUrl = process.env.EXPO_PUBLIC_PROXY_BASE_URL || defaultBaseUrl

export const proxy = `${proxyBaseUrl}/user/widget_urls`
