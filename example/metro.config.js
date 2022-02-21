const { resolve } = require("path")

const siblings = {
  "@mxenabled/react-native-widget-sdk": resolve(__dirname, "..", "src")
}

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    extraNodeModules: new Proxy({}, {
      get: (target, name) =>
        name in siblings ? siblings[name] : resolve(process.cwd(), "node_modules", name),
    }),
  },
  watchFolders: [
    ...Object.values(siblings),
  ]
}
