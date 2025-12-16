const { getDefaultConfig } = require("expo/metro-config")
const path = require("path")

const config = getDefaultConfig(__dirname)

// Point to the SDK's root directory
const sdkRoot = path.resolve(__dirname, "..")

// Watch all files within the SDK
config.watchFolders = [sdkRoot]

// Map the SDK package to its source files
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(sdkRoot, "node_modules"),
]

// Ensure the SDK's source files are resolved
config.resolver.extraNodeModules = {
  "@mxenabled/react-native-widget-sdk": sdkRoot,
}

module.exports = config
