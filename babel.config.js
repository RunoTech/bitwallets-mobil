module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Add polyfills for Node.js modules
      ['module-resolver', {
        alias: {
          stream: 'readable-stream',
          buffer: 'buffer',
          process: 'process',
          util: 'util',
          url: 'url',
          // Add specific polyfills for ethers
          'stream-browserify': 'readable-stream',
          // Use react-native-get-random-values for random bytes
          'randombytes': 'react-native-get-random-values',
        },
      }],
    ],
  };
}; 