const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const crypto = require('crypto');
const { execSync } = require('child_process');

// Advanced obfuscation configuration for compiled JavaScript
const buildObfuscatorConfig = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.8,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.6,
  debugProtection: true,
  debugProtectionInterval: 3000,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: true,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 8,
  stringArray: true,
  stringArrayEncoding: ['base64', 'rc4'],
  stringArrayThreshold: 0.8,
  transformObjectKeys: true,
  unicodeEscapeSequence: true,
  
  // Reserved strings for React Native
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
  sourceMapSourcesMode: 'sources-content',
  stringArrayCallsTransform: true,
  stringArrayCallsTransformThreshold: 0.75,
  stringArrayEncoding: ['base64', 'rc4'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 2,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 4,
  stringArrayWrappersType: 'function',
  stringArrayThreshold: 0.8,
  transformObjectKeys: true,
  unicodeEscapeSequence: true
};

// Function to add anti-debugging code
function addAntiDebugging(code) {
  const antiDebugCode = `
(function(){
  var _0x${crypto.randomBytes(4).toString('hex')} = function(){
    var _0x${crypto.randomBytes(4).toString('hex')} = new Date();
    var _0x${crypto.randomBytes(4).toString('hex')} = _0x${crypto.randomBytes(4).toString('hex')}.getTime();
    var _0x${crypto.randomBytes(4).toString('hex')} = setInterval(function(){
      var _0x${crypto.randomBytes(4).toString('hex')} = new Date();
      var _0x${crypto.randomBytes(4).toString('hex')} = _0x${crypto.randomBytes(4).toString('hex')}.getTime();
      if(_0x${crypto.randomBytes(4).toString('hex')} - _0x${crypto.randomBytes(4).toString('hex')} > 100){
        clearInterval(_0x${crypto.randomBytes(4).toString('hex')});
        while(1){}
      }
    }, 100);
  };
  _0x${crypto.randomBytes(4).toString('hex')}();
})();
`;
  return antiDebugCode + code;
}

// Function to obfuscate the build output
function obfuscateBuildOutput() {
  console.log('🚀 Starting build output obfuscation...\n');
  
  try {
    // Look for build output directories
    const buildDirs = [
      'android/app/build',
      'ios/build',
      '.expo/web-build',
      'dist',
      'build'
    ];
    
    let obfuscatedFiles = 0;
    
    for (const buildDir of buildDirs) {
      if (fs.existsSync(buildDir)) {
        console.log(`📁 Found build directory: ${buildDir}`);
        
        // Find JavaScript files in build output
        const jsFiles = glob.sync(`${buildDir}/**/*.js`, {
          ignore: ['**/node_modules/**', '**/*.min.js', '**/*.map']
        });
        
        console.log(`📄 Found ${jsFiles.length} JavaScript files in ${buildDir}`);
        
        for (const jsFile of jsFiles) {
          try {
            console.log(`🔒 Obfuscating build file: ${jsFile}`);
            
            const sourceCode = fs.readFileSync(jsFile, 'utf8');
            
            // Skip if already obfuscated
            if (sourceCode.includes('_0x')) {
              console.log(`⏭️  Skipping ${jsFile} (already obfuscated)`);
              continue;
            }
            
            // Create backup
            const backupPath = jsFile + '.backup';
            fs.writeFileSync(backupPath, sourceCode);
            
            // Add anti-debugging protection
            let protectedCode = addAntiDebugging(sourceCode);
            
            // Apply obfuscation
            const obfuscatedCode = JavaScriptObfuscator.obfuscate(protectedCode, buildObfuscatorConfig).getObfuscatedCode();
            
            // Write obfuscated code
            fs.writeFileSync(jsFile, obfuscatedCode);
            
            console.log(`✅ Obfuscated: ${jsFile}`);
            obfuscatedFiles++;
            
          } catch (error) {
            console.error(`❌ Error obfuscating ${jsFile}:`, error.message);
          }
        }
      }
    }
    
    if (obfuscatedFiles === 0) {
      console.log('⚠️  No build output found. Run a build first, then obfuscate.');
      console.log('💡 Try: npm run build:apk && npm run obfuscate:build');
    } else {
      console.log(`\n🎉 Build output obfuscation completed!`);
      console.log(`🔐 ${obfuscatedFiles} files obfuscated with maximum protection`);
      console.log('🛡️  Anti-debugging protection added');
      console.log('🔒 String encryption enabled');
      console.log('⚡ Control flow obfuscation applied');
      console.log('⚠️  WARNING: This obfuscation makes the code extremely difficult to reverse engineer!');
    }
    
  } catch (error) {
    console.error('❌ Build obfuscation failed:', error);
    process.exit(1);
  }
}

// Run build output obfuscation
obfuscateBuildOutput(); 