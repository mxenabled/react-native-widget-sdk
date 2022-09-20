#!/usr/bin/env node

/* istanbul ignore file */
/* eslint @typescript-eslint/no-var-requires: "off" */
const { exec, execSync } = require("child_process")

const tryExec = (cmd: string) => {
  return new Promise((resolve, _reject) => {
    exec(cmd).on("exit", resolve)
  })
}

async function main() {
  try {
    console.log("1. Installing react-native-webview")
    execSync("npm install --save react-native-webview")

    console.log("2. Linking react-native-webview (optional for older version of React Native)")
    await tryExec("npx react-native link react-native-webview")

    console.log("3. Installing native dependencies")
    execSync("cd ios && pod install")

    console.log("\nDone, you're now ready to use the MX Widget SDK in your application")
  } catch (error) {
    console.error(`Error: ${error}`)
  }
}

main()
