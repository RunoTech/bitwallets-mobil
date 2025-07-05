const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const crypto = require('crypto');
const { execSync } = require('child_process');

// Advanced obfuscation configuration
const obfuscatorConfig = {
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
    'router', 'useRouter', 'useLocalSearchParams', 'Link', 'Redirect',
    'Stack', 'Tabs', 'Tab', 'Button', 'Input', 'Card', 'Modal', 'Alert',
    'ActivityIndicator', 'FlatList', 'SectionList', 'Image', 'ImageBackground',
    'KeyboardAvoidingView', 'TouchableWithoutFeedback', 'TouchableHighlight',
    'TouchableNativeFeedback', 'Pressable', 'Switch', 'Slider', 'Picker',
    'RefreshControl', 'StatusBar', 'Animated', 'PanResponder', 'Dimensions',
    'Platform', 'Alert', 'Linking', 'Share', 'Vibration', 'PermissionsAndroid',
    'BackHandler', 'AppState', 'NetInfo', 'DeviceInfo', 'Haptics', 'Notifications',
    'FileSystem', 'MediaLibrary', 'Camera', 'Location', 'Sensors', 'Battery',
    'Brightness', 'Font', 'LinearGradient', 'BlurView', 'MaskedView', 'GestureHandlerRootView',
    'PanGestureHandler', 'TapGestureHandler', 'PinchGestureHandler', 'RotationGestureHandler',
    'FlingGestureHandler', 'ForceTouchGestureHandler', 'LongPressGestureHandler',
    'State', 'Directions', 'GestureState', 'GestureHandlerStateManager',
    'createNativeStackNavigator', 'createStackNavigator', 'createBottomTabNavigator',
    'createDrawerNavigator', 'createMaterialTopTabNavigator', 'createMaterialBottomTabNavigator',
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

// Function to compile TypeScript to JavaScript
function compileTypeScript(filePath) {
  try {
    console.log(`🔧 Compiling TypeScript: ${filePath}`);
    
    // Create a temporary JavaScript file
    const jsFilePath = filePath.replace(/\.(ts|tsx)$/, '.js');
    
    // Use TypeScript compiler to compile the file
    const tscCommand = `npx tsc ${filePath} --target es2020 --module commonjs --jsx react --outDir ${path.dirname(jsFilePath)} --skipLibCheck --noEmitOnError`;
    
    try {
      execSync(tscCommand, { stdio: 'pipe' });
      
      // Read the compiled JavaScript
      if (fs.existsSync(jsFilePath)) {
        const compiledCode = fs.readFileSync(jsFilePath, 'utf8');
        fs.unlinkSync(jsFilePath); // Clean up temporary file
        return compiledCode;
      }
    } catch (compileError) {
      console.log(`⚠️  TypeScript compilation failed for ${filePath}, using direct obfuscation`);
      return null;
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error compiling TypeScript ${filePath}:`, error.message);
    return null;
  }
}

// Function to obfuscate a single file with TypeScript compilation
function obfuscateFileWithCompilation(filePath) {
  try {
    console.log(`🔒 Compile + Obfuscating: ${filePath}`);
    
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
    
    // Try to compile TypeScript to JavaScript first
    let processedCode = compileTypeScript(filePath);
    
    // If compilation failed, use the original code with basic TypeScript cleanup
    if (!processedCode) {
      processedCode = sourceCode
        // Remove TypeScript-specific syntax that causes issues
        .replace(/export\s+interface\s+\w+[^{]*{[\s\S]*?}/g, '')
        .replace(/interface\s+\w+[^{]*{[\s\S]*?}/g, '')
        .replace(/export\s+type\s+\w+[^;]*;/g, '')
        .replace(/type\s+\w+[^;]*;/g, '')
        .replace(/: [A-Za-z<>\[\]{}|&]+(?=\s*[,)])/g, '')
        .replace(/: [A-Za-z<>\[\]{}|&]+(?=\s*[=;])/g, '')
        .replace(/\s+as\s+[A-Za-z<>\[\]{}|&]+/g, '')
        .replace(/<[^>]*>/g, '')
        .replace(/:\s*[A-Za-z<>\[\]{}|&]+/g, '');
    }
    
    // Add anti-debugging protection
    let protectedCode = addAntiDebugging(processedCode);
    
    // Apply obfuscation
    const obfuscatedCode = JavaScriptObfuscator.obfuscate(protectedCode, obfuscatorConfig).getObfuscatedCode();
    
    // Write obfuscated code back to the original file
    fs.writeFileSync(filePath, obfuscatedCode);
    
    console.log(`✅ Compile + Obfuscated: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error compile + obfuscating ${filePath}:`, error.message);
  }
}

// Main compilation + obfuscation function
async function compileAndObfuscateProject() {
  console.log('🚀 Starting TypeScript compilation + ADVANCED obfuscation...\n');
  
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
    
    console.log(`📁 Found ${allFiles.length} TypeScript files to compile and obfuscate\n`);
    
    // Obfuscate each file
    for (const file of allFiles) {
      obfuscateFileWithCompilation(file);
    }
    
    console.log('\n🎉 TypeScript compilation + ADVANCED obfuscation completed successfully!');
    console.log('🔐 Your code is now EXTREMELY difficult to reverse engineer');
    console.log('🛡️  Anti-debugging protection added');
    console.log('🔒 String encryption enabled');
    console.log('⚡ Control flow obfuscation applied');
    console.log('📁 Timestamped backup files created');
    console.log('⚠️  WARNING: This obfuscation makes the code nearly impossible to maintain!');
    
  } catch (error) {
    console.error('❌ Compilation + obfuscation failed:', error);
    process.exit(1);
  }
}

// Run compilation + obfuscation
compileAndObfuscateProject(); 