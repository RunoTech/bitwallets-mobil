const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const crypto = require('crypto');

// Maximum irreversible obfuscation configuration
const irreversibleConfig = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 1, // Maximum flattening
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 1, // Maximum dead code
  debugProtection: true,
  debugProtectionInterval: 2000,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: true,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 3, // Very short chunks
  stringArray: true,
  stringArrayEncoding: ['base64', 'rc4'],
  stringArrayThreshold: 1, // All strings
  transformObjectKeys: true,
  unicodeEscapeSequence: true,
  
  // Minimal reserved strings - only absolutely essential
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
  
  // Maximum obfuscation settings
  sourceMap: false,
  sourceMapMode: 'separate',
  sourceMapSourcesMode: 'sources-content',
  stringArrayCallsTransform: true,
  stringArrayCallsTransformThreshold: 1,
  stringArrayEncoding: ['base64', 'rc4'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 3,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 6,
  stringArrayWrappersType: 'function',
  stringArrayThreshold: 1,
  transformObjectKeys: true,
  unicodeEscapeSequence: true
};

// Function to add maximum anti-debugging and anti-recovery code
function addMaximumProtection(code) {
  const protectionCode = `
(function(){
  // Anti-debugging protection
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
  
  // Anti-recovery protection
  var _0x${crypto.randomBytes(4).toString('hex')} = function(){
    try {
      // Override console methods
      console.log = function(){};
      console.warn = function(){};
      console.error = function(){};
      console.info = function(){};
      console.debug = function(){};
      
      // Override error handling
      window.onerror = function(){ return true; };
      window.addEventListener('error', function(){ return true; });
      
      // Disable developer tools
      document.addEventListener('keydown', function(e){
        if(e.ctrlKey && e.shiftKey && e.keyCode === 73) return false;
        if(e.ctrlKey && e.shiftKey && e.keyCode === 74) return false;
        if(e.ctrlKey && e.keyCode === 85) return false;
      });
      
      // Disable right-click
      document.addEventListener('contextmenu', function(e){
        e.preventDefault();
        return false;
      });
      
    } catch(e) {}
  };
  
  _0x${crypto.randomBytes(4).toString('hex')}();
  _0x${crypto.randomBytes(4).toString('hex')}();
})();
`;
  return protectionCode + code;
}

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

// Function to obfuscate a single file irreversibly
function obfuscateFileIrreversible(filePath) {
  try {
    console.log(`🔒 IRREVERSIBLE obfuscating: ${filePath}`);
    
    const sourceCode = fs.readFileSync(filePath, 'utf8');
    
    // Skip if file is empty or already obfuscated
    if (!sourceCode.trim() || sourceCode.includes('_0x')) {
      console.log(`⏭️  Skipping ${filePath} (empty or already obfuscated)`);
      return;
    }
    
    // NO BACKUP CREATED - IRREVERSIBLE!
    console.log(`⚠️  NO BACKUP CREATED - This is IRREVERSIBLE!`);
    
    // Clean up TypeScript syntax that causes issues
    let processedCode = sourceCode
      // Remove interface declarations
      .replace(/export\s+interface\s+\w+[^{]*{[\s\S]*?}/g, '')
      .replace(/interface\s+\w+[^{]*{[\s\S]*?}/g, '')
      // Remove type declarations
      .replace(/export\s+type\s+\w+[^;]*;/g, '')
      .replace(/type\s+\w+[^;]*;/g, '')
      // Remove type annotations from function parameters
      .replace(/: [A-Za-z<>\[\]{}|&]+(?=\s*[,)])/g, '')
      // Remove type annotations from variables
      .replace(/: [A-Za-z<>\[\]{}|&]+(?=\s*[=;])/g, '')
      // Remove as type assertions
      .replace(/\s+as\s+[A-Za-z<>\[\]{}|&]+/g, '')
      // Remove generic type parameters
      .replace(/<[^>]*>/g, '')
      // Clean up any remaining type syntax
      .replace(/:\s*[A-Za-z<>\[\]{}|&]+/g, '')
      // Remove React.FC type annotations
      .replace(/React\.FC[^=]*=/g, '')
      .replace(/:\s*React\.FC[^=]*=/g, '=')
      // Clean up JSX type issues
      .replace(/:\s*JSX\.Element/g, '')
      .replace(/:\s*React\.ReactElement/g, '');
    
    // Add maximum protection
    let protectedCode = addMaximumProtection(processedCode);
    
    // Apply irreversible obfuscation
    const obfuscatedCode = JavaScriptObfuscator.obfuscate(protectedCode, irreversibleConfig).getObfuscatedCode();
    
    // Write obfuscated code back to the original file
    fs.writeFileSync(filePath, obfuscatedCode);
    
    console.log(`✅ IRREVERSIBLE obfuscated: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error irreversible obfuscating ${filePath}:`, error.message);
  }
}

// Main irreversible obfuscation function
async function irreversibleObfuscateProject() {
  console.log('🚨 WARNING: This is IRREVERSIBLE obfuscation!');
  console.log('🚨 NO BACKUPS WILL BE CREATED!');
  console.log('🚨 Your original code will be PERMANENTLY lost!');
  console.log('🚨 This makes the code completely unmaintainable!');
  console.log('');
  
  // Ask for confirmation
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('Type "IRREVERSIBLE" to confirm you want to proceed: ', (answer) => {
    if (answer !== 'IRREVERSIBLE') {
      console.log('❌ Operation cancelled. Your code is safe.');
      rl.close();
      process.exit(0);
    }
    
    rl.close();
    
    console.log('🚀 Starting IRREVERSIBLE code obfuscation...\n');
    
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
        const files = findFiles(pattern);
        allFiles = allFiles.concat(files);
      }
      
      // Remove duplicates
      allFiles = [...new Set(allFiles)];
      
      console.log(`📁 Found ${allFiles.length} TypeScript files to obfuscate IRREVERSIBLY\n`);
      
      // Obfuscate each file
      for (const file of allFiles) {
        obfuscateFileIrreversible(file);
      }
      
      console.log('\n🎉 IRREVERSIBLE code obfuscation completed!');
      console.log('🔐 Your code is now PERMANENTLY obfuscated');
      console.log('🛡️  Maximum anti-debugging protection added');
      console.log('🔒 String encryption enabled');
      console.log('⚡ Maximum control flow obfuscation applied');
      console.log('🚨 WARNING: Your original code is GONE FOREVER!');
      console.log('🚨 WARNING: This code is completely unmaintainable!');
      console.log('🚨 WARNING: Only you can understand what it does!');
      
    } catch (error) {
      console.error('❌ Irreversible obfuscation failed:', error);
      process.exit(1);
    }
  });
}

// Run irreversible obfuscation
irreversibleObfuscateProject(); 