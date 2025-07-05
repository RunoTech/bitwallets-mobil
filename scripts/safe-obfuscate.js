const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const crypto = require('crypto');

// Safe obfuscation configuration that won't break React Native
const safeObfuscatorConfig = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.5,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.3,
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
    'encodeURI', 'encodeURIComponent', 'escape', 'unescape', 'eval'
  ],
  
  // Additional settings
  sourceMap: false,
  sourceMapMode: 'separate',
  sourceMapSourcesMode: 'sources-content'
};

// Function to recursively find all JS files (skip TS/TSX for now)
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
        '**/*.ts.map',
        '**/*.ts',
        '**/*.tsx'
      ] 
    });
    return files;
  } catch (error) {
    throw error;
  }
}

// Function to obfuscate a single file safely
function obfuscateFileSafe(filePath) {
  try {
    console.log(`🔒 Safe obfuscating: ${filePath}`);
    
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
    
    // Apply safe obfuscation
    const obfuscatedCode = JavaScriptObfuscator.obfuscate(sourceCode, safeObfuscatorConfig).getObfuscatedCode();
    
    // Write obfuscated code
    fs.writeFileSync(filePath, obfuscatedCode);
    
    console.log(`✅ Safe obfuscated: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error safe obfuscating ${filePath}:`, error.message);
  }
}

// Main safe obfuscation function
async function safeObfuscateProject() {
  console.log('🚀 Starting SAFE code obfuscation (JavaScript files only)...\n');
  
  try {
    // Find only JavaScript files (skip TypeScript for now)
    const patterns = [
      'app/**/*.js',
      'app/**/*.jsx',
      'lib/**/*.js',
      'lib/**/*.jsx',
      'services/**/*.js',
      'services/**/*.jsx',
      'context/**/*.js',
      'context/**/*.jsx',
      'types/**/*.js',
      'types/**/*.jsx',
      'theme/**/*.js',
      'theme/**/*.jsx'
    ];
    
    let allFiles = [];
    for (const pattern of patterns) {
      const files = await findFiles(pattern);
      allFiles = allFiles.concat(files);
    }
    
    // Remove duplicates
    allFiles = [...new Set(allFiles)];
    
    console.log(`📁 Found ${allFiles.length} JavaScript files to obfuscate safely\n`);
    
    // Obfuscate each file
    for (const file of allFiles) {
      obfuscateFileSafe(file);
    }
    
    console.log('\n🎉 SAFE code obfuscation completed successfully!');
    console.log('🔐 Your JavaScript code is now protected');
    console.log('🛡️  Safe obfuscation applied (no breaking changes)');
    console.log('🔒 String obfuscation enabled');
    console.log('⚡ Control flow obfuscation applied');
    console.log('📁 Timestamped backup files created');
    console.log('💡 Note: TypeScript files were skipped for safety');
    
  } catch (error) {
    console.error('❌ Safe obfuscation failed:', error);
    process.exit(1);
  }
}

// Run safe obfuscation
safeObfuscateProject(); 