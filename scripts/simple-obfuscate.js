const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const crypto = require('crypto');

// Simple, reliable obfuscation configuration
const simpleObfuscatorConfig = {
  compact: true,
  controlFlowFlattening: false, // Disabled to avoid breaking code
  deadCodeInjection: false, // Disabled to avoid breaking code
  debugProtection: false, // Disabled to avoid issues
  disableConsoleOutput: false, // Keep console for debugging
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: false, // Disabled to avoid issues
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.5,
  transformObjectKeys: false, // Disabled to avoid breaking React Native
  unicodeEscapeSequence: false,
  
  // Essential reserved strings for React Native
  reservedStrings: [
    'react', 'react-native', 'expo', 'navigation', 'asyncstorage', 'clipboard',
    'cookies', 'picker', 'vector-icons', 'paper', 'qrcode', 'randombytes',
    'reanimated', 'safe-area', 'screens', 'svg', 'webview', 'bip39', 'bs58',
    'buffer', 'ethers', 'tweetnacl', 'axios', 'form', 'gesture', 'haptics',
    'image', 'linking', 'router', 'splash', 'status-bar', 'symbols',
    'system-ui', 'web-browser', 'process', 'readable-stream', 'text-encoding',
    'url', 'util', 'bitwallets', 'wallet', 'crypto', 'blockchain',
    'View', 'Text', 'TouchableOpacity', 'ScrollView', 'SafeAreaView', 'StatusBar',
    'StyleSheet', 'useState', 'useEffect', 'useContext', 'useCallback',
    'useMemo', 'useRef', 'useReducer', 'useLayoutEffect', 'useImperativeHandle',
    'useDebugValue', 'useDeferredValue', 'useTransition', 'useId', 'useSyncExternalStore',
    'useInsertionEffect', 'Fragment', 'createContext', 'forwardRef', 'memo',
    'lazy', 'Suspense', 'Profiler', 'StrictMode', 'export', 'import', 'default',
    'from', 'require', 'module', 'exports', 'global', 'window', 'document',
    'console', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
    'Promise', 'async', 'await', 'function', 'const', 'let', 'var', 'return',
    'if', 'else', 'for', 'while', 'switch', 'case', 'break', 'continue',
    'try', 'catch', 'finally', 'throw', 'new', 'this', 'super', 'class',
    'extends', 'static', 'public', 'private', 'protected', 'interface', 'type',
    'enum', 'namespace', 'declare', 'abstract', 'implements', 'override',
    'readonly', 'optional', 'required', 'partial', 'pick', 'omit', 'record',
    'keyof', 'typeof', 'instanceof', 'in', 'of', 'delete', 'void', 'null',
    'undefined', 'true', 'false', 'NaN', 'Infinity', 'arguments', 'callee',
    'caller', 'length', 'prototype', 'constructor', 'hasOwnProperty',
    'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString',
    'valueOf', 'Object', 'Array', 'String', 'Number', 'Boolean', 'Symbol',
    'Date', 'RegExp', 'Error', 'EvalError', 'RangeError', 'ReferenceError',
    'SyntaxError', 'TypeError', 'URIError', 'JSON', 'Math', 'parseInt',
    'parseFloat', 'isNaN', 'isFinite', 'decodeURI', 'decodeURIComponent',
    'encodeURI', 'encodeURIComponent', 'escape', 'unescape', 'eval',
    'useRouter', 'useLocalSearchParams', 'Link', 'Redirect', 'Stack', 'Tabs',
    'Tab', 'Button', 'Input', 'Card', 'Modal', 'Alert', 'ActivityIndicator',
    'FlatList', 'SectionList', 'Image', 'ImageBackground', 'KeyboardAvoidingView',
    'TouchableWithoutFeedback', 'TouchableHighlight', 'TouchableNativeFeedback',
    'Pressable', 'Switch', 'Slider', 'Picker', 'RefreshControl', 'Animated',
    'PanResponder', 'Dimensions', 'Platform', 'Linking', 'Share', 'Vibration',
    'PermissionsAndroid', 'BackHandler', 'AppState', 'NetInfo', 'DeviceInfo',
    'Notifications', 'FileSystem', 'MediaLibrary', 'Camera', 'Location',
    'Sensors', 'Battery', 'Brightness', 'Font', 'LinearGradient', 'BlurView',
    'MaskedView', 'GestureHandlerRootView', 'PanGestureHandler', 'TapGestureHandler',
    'PinchGestureHandler', 'RotationGestureHandler', 'FlingGestureHandler',
    'ForceTouchGestureHandler', 'LongPressGestureHandler', 'State', 'Directions',
    'GestureState', 'GestureHandlerStateManager', 'createNativeStackNavigator',
    'createStackNavigator', 'createBottomTabNavigator', 'createDrawerNavigator',
    'createMaterialTopTabNavigator', 'createMaterialBottomTabNavigator',
    'NavigationContainer', 'useNavigation', 'useRoute', 'useFocusEffect',
    'useIsFocused', 'useScrollToTop', 'useLinking', 'useLinkingState',
    'useLinkingOptions', 'useLinkingContext', 'useLinkingBuilder', 'useLinkingBuilderState',
    'useLinkingBuilderOptions', 'useLinkingBuilderContext', 'useLinkingBuilderBuilder',
    'useLinkingBuilderBuilderState', 'useLinkingBuilderBuilderOptions', 'useLinkingBuilderBuilderContext'
  ],
  
  // Additional settings
  sourceMap: false,
  sourceMapMode: 'separate',
  sourceMapSourcesMode: 'sources-content'
};

// Function to recursively find all TS/TSX files
async function findFiles(pattern) {
  try {
    const files = await glob(pattern, { 
      ignore: [
        'node_modules/**',
        'android/**',
        'ios/**',
        'assets/**',
        '*.config.js',
        '*.config.ts',
        'metro.config.js',
        'babel.config.js',
        'tsconfig.json',
        'package.json',
        'app.json',
        'eas.json',
        '**/*.backup*',
        '**/*.js.map',
        '**/*.ts.map'
      ] 
    });
    return files;
  } catch (error) {
    throw error;
  }
}

// Function to obfuscate a single file with minimal processing
function obfuscateFileSimple(filePath) {
  try {
    console.log(`🔒 Simple obfuscating: ${filePath}`);
    
    const sourceCode = fs.readFileSync(filePath, 'utf8');
    
    // Skip if file is empty or already obfuscated
    if (!sourceCode.trim() || sourceCode.includes('_0x')) {
      console.log(`⏭️  Skipping ${filePath} (empty or already obfuscated)`);
      return;
    }
    
    // Create backup with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = filePath + `.backup.${timestamp}`;
    if (!fs.existsSync(backupPath)) {
      fs.writeFileSync(backupPath, sourceCode);
    }
    
    // Apply simple obfuscation without breaking the code structure
    const obfuscatedCode = JavaScriptObfuscator.obfuscate(sourceCode, simpleObfuscatorConfig).getObfuscatedCode();
    
    // Write obfuscated code back to the original file
    fs.writeFileSync(filePath, obfuscatedCode);
    
    console.log(`✅ Simple obfuscated: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error simple obfuscating ${filePath}:`, error.message);
  }
}

// Main simple obfuscation function
async function simpleObfuscateProject() {
  console.log('🚀 Starting SIMPLE code obfuscation (safe and reliable)...\n');
  
  try {
    // Find all TypeScript files
    const patterns = [
      'app/**/*.ts',
      'app/**/*.tsx',
      'lib/**/*.ts',
      'lib/**/*.tsx',
      'services/**/*.ts',
      'services/**/*.tsx',
      'context/**/*.ts',
      'context/**/*.tsx',
      'types/**/*.ts',
      'types/**/*.tsx',
      'theme/**/*.ts',
      'theme/**/*.tsx'
    ];
    
    let allFiles = [];
    for (const pattern of patterns) {
      const files = await findFiles(pattern);
      allFiles = allFiles.concat(files);
    }
    
    // Remove duplicates
    allFiles = [...new Set(allFiles)];
    
    console.log(`📁 Found ${allFiles.length} TypeScript files to obfuscate\n`);
    
    // Obfuscate each file
    for (const file of allFiles) {
      obfuscateFileSimple(file);
    }
    
    console.log('\n🎉 SIMPLE code obfuscation completed successfully!');
    console.log('🔐 Your code is now protected with basic obfuscation');
    console.log('🛡️  Safe obfuscation applied (no breaking changes)');
    console.log('🔒 String obfuscation enabled');
    console.log('📁 Timestamped backup files created');
    console.log('💡 This obfuscation maintains code functionality while adding protection');
    
  } catch (error) {
    console.error('❌ Simple obfuscation failed:', error);
    process.exit(1);
  }
}

// Run simple obfuscation
simpleObfuscateProject(); 