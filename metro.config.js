const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    //doing this only redux saga
    // Add the resolver configuration here
  resolver: {
    unstable_enablePackageExports: false, // <--- Add this line
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
