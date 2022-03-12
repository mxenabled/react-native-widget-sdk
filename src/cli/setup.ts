#!/usr/bin/env node

/* istanbul ignore file */
/* eslint @typescript-eslint/no-var-requires: "off" */
const { execSync } = require("child_process")

try {
  console.log("Installing react-native-webview")
  execSync("npm install --save react-native-webview")
  console.log("\nLinking react-native-webview")
  execSync("npx react-native link react-native-webview")
  console.log("\nInstalling native depedencies")
  execSync("cd ios && pod install")
  console.log("\nDone, you're now ready to use the MX Widget SDK in your application")
} catch (error) {
  console.error(`Error: ${error}`)
}

