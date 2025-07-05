const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const crypto = require('crypto');

// Advanced obfuscation configuration
const advancedConfig = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 1,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 1,
  debugProtection: true,
  debugProtectionInterval: 4000,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: true,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 5,
  stringArray: true,
  stringArrayEncoding: ['base64', 'rc4'],
  stringArrayThreshold: 1,
  transformObjectKeys: true,
  unicodeEscapeSequence: true,
  
  // Additional advanced settings
  domainLock: [],
  domainLockRedirectUrl: 'about:blank',
  forceTransformStrings: ['password', 'secret', 'key', 'token', 'auth'],
  identifierNamesCache: null,
  identifiersDictionary: [],
  identifiersPrefix: '_0x',
  inputFileName: '',
  reservedNames: [],
  reservedStrings: [
    'react', 'react-native', 'expo', 'navigation', 'asyncstorage', 'clipboard',
    'cookies', 'picker', 'vector-icons', 'paper', 'qrcode', 'randombytes',
    'reanimated', 'safe-area', 'screens', 'svg', 'webview', 'bip39', 'bs58',
    'buffer', 'ethers', 'tweetnacl', 'axios', 'form', 'gesture', 'haptics',
    'image', 'linking', 'router', 'splash', 'status-bar', 'symbols',
    'system-ui', 'web-browser', 'process', 'readable-stream', 'text-encoding',
    'url', 'util', 'bitwallets', 'wallet', 'crypto', 'blockchain'
  ],
  rotateStringArray: true,
  seed: Math.floor(Math.random() * 1000000),
  shuffleStringArray: true,
  sourceMap: false,
  sourceMapBaseUrl: '',
  sourceMapFileName: '',
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
  stringArrayThreshold: 1,
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

// Function to recursively find all JS/TS files
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
        '**/*.backup'
      ] 
    });
    return files;
  } catch (error) {
    throw error;
  }
}

// Function to obfuscate a single file with advanced protection
function obfuscateFileAdvanced(filePath) {
  try {
    console.log(`🔒 Advanced obfuscating: ${filePath}`);
    
    const sourceCode = fs.readFileSync(filePath, 'utf8');
    
    // Skip if file is empty or already obfuscated
    if (!sourceCode.trim() || sourceCode.includes('_0x')) {
      console.log(`⏭️  Skipping ${filePath} (empty or already obfuscated)`);
      return;
    }
    
    // Add anti-debugging protection
    let protectedCode = addAntiDebugging(sourceCode);
    
    // Apply advanced obfuscation
    const obfuscatedCode = JavaScriptObfuscator.obfuscate(protectedCode, advancedConfig).getObfuscatedCode();
    
    // Create backup with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = filePath + `.backup.${timestamp}`;
    if (!fs.existsSync(backupPath)) {
      fs.writeFileSync(backupPath, sourceCode);
    }
    
    // Write obfuscated code
    fs.writeFileSync(filePath, obfuscatedCode);
    
    console.log(`✅ Advanced obfuscated: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error advanced obfuscating ${filePath}:`, error.message);
  }
}

// Main advanced obfuscation function
async function advancedObfuscateProject() {
  console.log('🚀 Starting ADVANCED code obfuscation with maximum protection...\n');
  
  try {
    // Find all TypeScript and JavaScript files
    const patterns = [
      'app/**/*.ts',
      'app/**/*.tsx',
      'app/**/*.js',
      'app/**/*.jsx',
      'lib/**/*.ts',
      'lib/**/*.tsx',
      'lib/**/*.js',
      'lib/**/*.jsx',
      'services/**/*.ts',
      'services/**/*.tsx',
      'services/**/*.js',
      'services/**/*.jsx',
      'context/**/*.ts',
      'context/**/*.tsx',
      'context/**/*.js',
      'context/**/*.jsx',
      'types/**/*.ts',
      'types/**/*.tsx',
      'types/**/*.js',
      'types/**/*.jsx',
      'theme/**/*.ts',
      'theme/**/*.tsx',
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
    
    console.log(`📁 Found ${allFiles.length} files to obfuscate with advanced protection\n`);
    
    // Obfuscate each file
    for (const file of allFiles) {
      obfuscateFileAdvanced(file);
    }
    
    console.log('\n🎉 ADVANCED code obfuscation completed successfully!');
    console.log('🔐 Your code is now EXTREMELY difficult to reverse engineer');
    console.log('🛡️  Anti-debugging protection added');
    console.log('🔒 String encryption enabled');
    console.log('⚡ Control flow obfuscation applied');
    console.log('📁 Timestamped backup files created');
    console.log('⚠️  WARNING: This obfuscation makes the code nearly impossible to maintain!');
    
  } catch (error) {
    console.error('❌ Advanced obfuscation failed:', error);
    process.exit(1);
  }
}

// Run advanced obfuscation
advancedObfuscateProject(); 