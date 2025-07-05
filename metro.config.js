const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add Node.js polyfills
config.resolver.alias = {
  ...config.resolver.alias,
  stream: 'readable-stream',
  buffer: 'buffer',
  process: 'process',
  util: 'util',
  url: 'url',
  // Add specific polyfills for ethers
  'stream-browserify': 'readable-stream',
  // Use react-native-get-random-values for random bytes
  'randombytes': 'react-native-get-random-values',
  // Remove crypto aliases - let ethers use our polyfills
  'crypto-browserify': 'react-native-get-random-values',
  'crypto-js': 'react-native-get-random-values',
  // Add react-native-randombytes
  'react-native-randombytes': 'react-native-randombytes',
};

// Add Node.js polyfills to the resolver
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add URL to the resolver
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config; 