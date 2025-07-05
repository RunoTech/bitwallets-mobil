// Global polyfills for React Native - must be imported first
import 'react-native-get-random-values';

// Import all necessary polyfills
import { Buffer } from 'buffer';

// Set up global objects
if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

if (typeof global.process === 'undefined') {
  (global as any).process = require('process');
}

if (typeof (global as any).stream === 'undefined') {
  (global as any).stream = require('readable-stream');
}

if (typeof (global as any).util === 'undefined') {
  (global as any).util = require('util');
}

// Create a proper crypto polyfill for ethers and BIP39
const createCryptoPolyfill = () => {
  return {
    getRandomValues: (arr: Uint8Array) => {
      try {
        const getRandomBytes = require('react-native-get-random-values').getRandomBytes;
        const bytes = getRandomBytes(arr.length);
        arr.set(bytes);
        return arr;
      } catch (error) {
        console.warn('react-native-get-random-values failed, using Math.random fallback');
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 256);
        }
        return arr;
      }
    },
    randomBytes: (length: number) => {
      try {
        const getRandomBytes = require('react-native-get-random-values').getRandomBytes;
        return Buffer.from(getRandomBytes(length));
      } catch (error) {
        console.warn('react-native-get-random-values failed, using Math.random fallback');
        const array = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
          array[i] = Math.floor(Math.random() * 256);
        }
        return Buffer.from(array);
      }
    },
    subtle: {
      generateKey: async () => {
        throw new Error('Subtle crypto not available in React Native');
      }
    }
  };
};

// Set crypto globally for ethers and BIP39
(global as any).crypto = createCryptoPolyfill();

// Ensure process.nextTick is available
if (typeof global.process.nextTick === 'undefined') {
  global.process.nextTick = (callback: Function, ...args: any[]) => {
    setTimeout(() => callback(...args), 0);
  };
}

// TextEncoder/TextDecoder polyfills
if (typeof global.TextEncoder === 'undefined') {
  (global as any).TextEncoder = class TextEncoder {
    encode(str: string) {
      return new Uint8Array(Buffer.from(str, 'utf8'));
    }
  };
}

if (typeof global.TextDecoder === 'undefined') {
  (global as any).TextDecoder = class TextDecoder {
    decode(bytes: Uint8Array) {
      return Buffer.from(bytes).toString('utf8');
    }
  };
}

// URL polyfills - only if not already available
if (typeof global.URL === 'undefined') {
  try {
    (global as any).URL = require('url').URL;
  } catch (e) {
    // Skip URL polyfill if not available
    console.warn('URL polyfill not available');
  }
}

if (typeof global.URLSearchParams === 'undefined') {
  try {
    (global as any).URLSearchParams = require('url').URLSearchParams;
  } catch (e) {
    // Skip URLSearchParams polyfill if not available
    console.warn('URLSearchParams polyfill not available');
  }
}

// Additional polyfills for ethers compatibility
if (typeof (global as any).navigator === 'undefined') {
  (global as any).navigator = {
    userAgent: 'React Native'
  };
}

// Ensure window object exists for ethers
if (typeof (global as any).window === 'undefined') {
  (global as any).window = global;
}

// Tweetnacl polyfills for React Native
if (typeof (global as any).Uint8Array === 'undefined') {
  (global as any).Uint8Array = Uint8Array;
}

// Additional polyfills for better compatibility
if (typeof (global as any).ArrayBuffer === 'undefined') {
  (global as any).ArrayBuffer = ArrayBuffer;
}

if (typeof (global as any).DataView === 'undefined') {
  (global as any).DataView = DataView;
}

// Ensure proper TypedArray support
if (typeof (global as any).Int8Array === 'undefined') {
  (global as any).Int8Array = Int8Array;
}

if (typeof (global as any).Uint8ClampedArray === 'undefined') {
  (global as any).Uint8ClampedArray = Uint8ClampedArray;
}

if (typeof (global as any).Int16Array === 'undefined') {
  (global as any).Int16Array = Int16Array;
}

if (typeof (global as any).Uint16Array === 'undefined') {
  (global as any).Uint16Array = Uint16Array;
}

if (typeof (global as any).Int32Array === 'undefined') {
  (global as any).Int32Array = Int32Array;
}

if (typeof (global as any).Uint32Array === 'undefined') {
  (global as any).Uint32Array = Uint32Array;
}

if (typeof (global as any).Float32Array === 'undefined') {
  (global as any).Float32Array = Float32Array;
}

if (typeof (global as any).Float64Array === 'undefined') {
  (global as any).Float64Array = Float64Array;
}

// Default export to prevent route warnings
export default {}; 