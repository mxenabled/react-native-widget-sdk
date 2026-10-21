import { Platform } from "react-native"

// The Android emulator reaches the host machine through 10.0.2.2. CI builds set
// EXPO_PUBLIC_PROXY_BASE_URL so a Sauce Labs device can reach the proxy through
// Sauce Connect. Expo inlines EXPO_PUBLIC_* variables when it bundles the JS.
const defaultBaseUrl = Platform.OS === "android" ? "http://10.0.2.2:8089" : "http://localhost:8089"

export const proxyBaseUrl = process.env.EXPO_PUBLIC_PROXY_BASE_URL || defaultBaseUrl

export const proxy = `${proxyBaseUrl}/user/widget_urls`
