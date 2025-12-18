const { getDefaultConfig } = require("expo/metro-config")
const path = require("path")

const config = getDefaultConfig(__dirname)

// Point to the SDK's root directory
const sdkRoot = path.resolve(__dirname, "..")

// Watch all files within the SDK
config.watchFolders = [sdkRoot]

// Only use example's node_modules, not SDK's
config.resolver.nodeModulesPaths = [path.resolve(__dirname, "node_modules")]

// Blacklist React dependencies in SDK's node_modules to prevent duplicates
config.resolver.blockList = [
  new RegExp(`${sdkRoot}/node_modules/react/`),
  new RegExp(`${sdkRoot}/node_modules/react-native/`),
  new RegExp(`${sdkRoot}/node_modules/react-native-webview/`),
]

// Force React dependencies to resolve from example's node_modules only
config.resolver.extraNodeModules = {
  "@mxenabled/react-native-widget-sdk": sdkRoot,
  react: path.resolve(__dirname, "node_modules/react"),
  "react-native": path.resolve(__dirname, "node_modules/react-native"),
  "react-native-webview": path.resolve(__dirname, "node_modules/react-native-webview"),
}

module.exports = config
