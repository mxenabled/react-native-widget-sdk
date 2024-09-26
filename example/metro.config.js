const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const { resolve } = require('path')

const siblings = {
  '@mxenabled/react-native-widget-sdk': resolve(__dirname, '..', 'src'),
  '@mxenabled/widget-post-message-definitions': resolve(
    __dirname,
    '..',
    'node_modules',
    '@mxenabled',
    'widget-post-message-definitions',
  ),
}
/**
 * Metro configuration
 * https://metrobundler.dev/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) =>
          name in siblings ? siblings[name] : resolve(process.cwd(), 'node_modules', name),
      },
    ),
  },
  watchFolders: [...Object.values(siblings)],
}

module.exports = mergeConfig(getDefaultConfig(__dirname), config)
