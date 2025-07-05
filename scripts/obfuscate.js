const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Load obfuscation config
const obfuscatorConfig = require('../obfuscator.config.js');

// Function to recursively find all JS/TS files
async function findFiles(pattern) {
  try {
    const files = await glob(pattern, { ignore: obfuscatorConfig.exclude });
    return files;
  } catch (error) {
    throw error;
  }
}

// Function to obfuscate a single file
function obfuscateFile(filePath) {
  try {
    console.log(`Obfuscating: ${filePath}`);
    
    const sourceCode = fs.readFileSync(filePath, 'utf8');
    
    // Skip if file is empty or already obfuscated
    if (!sourceCode.trim() || sourceCode.includes('_0x')) {
      console.log(`Skipping ${filePath} (empty or already obfuscated)`);
      return;
    }
    
    const obfuscatedCode = JavaScriptObfuscator.obfuscate(sourceCode, obfuscatorConfig).getObfuscatedCode();
    
    // Create backup
    const backupPath = filePath + '.backup';
    if (!fs.existsSync(backupPath)) {
      fs.writeFileSync(backupPath, sourceCode);
    }
    
    // Write obfuscated code
    fs.writeFileSync(filePath, obfuscatedCode);
    
    console.log(`✓ Obfuscated: ${filePath}`);
  } catch (error) {
    console.error(`✗ Error obfuscating ${filePath}:`, error.message);
  }
}

// Main obfuscation function
async function obfuscateProject() {
  console.log('🚀 Starting code obfuscation...\n');
  
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
    
    console.log(`Found ${allFiles.length} files to obfuscate\n`);
    
    // Obfuscate each file
    for (const file of allFiles) {
      obfuscateFile(file);
    }
    
    console.log('\n✅ Code obfuscation completed successfully!');
    console.log('📁 Backup files have been created with .backup extension');
    console.log('🔒 Your code is now heavily obfuscated and difficult to reverse engineer');
    
  } catch (error) {
    console.error('❌ Obfuscation failed:', error);
    process.exit(1);
  }
}

// Run obfuscation
obfuscateProject(); 