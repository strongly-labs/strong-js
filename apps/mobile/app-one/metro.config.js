/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path')
const {getDefaultConfig} = require('metro-config')

module.exports = async () => {
  const {
    resolver: {sourceExts, assetExts},
  } = await getDefaultConfig()
  return {
    resetCache: true,
    projectRoot: path.resolve(__dirname),
    watchFolders: [path.resolve(__dirname, '../../')],
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
  }
}
