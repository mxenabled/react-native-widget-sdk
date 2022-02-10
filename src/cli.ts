#!/usr/bin/env node

import { execSync } from "child_process"

try {
  console.log("Installing react-native-webview")
  execSync("npm install --save react-native-webview")
  console.log("\nLinking react-native-webview")
  execSync("npx react-native link react-native-webview")
  console.log("\nInstalling native depedencies")
  execSync("cd ios && pod install")
} catch (error) {
  console.error(`Error: ${error}`)
}

