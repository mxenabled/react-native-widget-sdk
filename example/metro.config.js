const { resolve } = require("path")

const siblings = {
  "@mxenabled/react-native-widget-sdk": resolve(__dirname, "..", "src"),
  "@mxenabled/widget-post-message-definitions": resolve(__dirname, "..", "node_modules", "@mxenabled", "widget-post-message-definitions"),
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
