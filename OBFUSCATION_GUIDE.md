# 🔒 Code Obfuscation Guide

Obfuscation prevents your app from hackers to break into source codes.

This guide explains how to use the advanced obfuscation tools to make your React Native codebase extremely difficult to reverse engineer.

## ⚠️ WARNING

**This obfuscation makes your code nearly impossible to maintain!** Only use this when you're ready to deploy and want maximum protection.

## 🛠️ Available Tools

### 1. Standard Obfuscation
```bash
npm run obfuscate
```
- Basic obfuscation with good protection
- Safe for development and testing
- Creates `.backup` files

### 2. Advanced Obfuscation (RECOMMENDED)
```bash
npm run obfuscate:advanced
```
- Maximum protection with anti-debugging
- String encryption and control flow obfuscation
- Creates timestamped backup files
- **Makes code extremely difficult to reverse engineer**

## 🚀 Build Commands with Obfuscation

### Standard Obfuscation + Build
```bash
npm run obfuscate:build          # Obfuscate + EAS build
npm run obfuscate:build:local     # Obfuscate + Local build
npm run obfuscate:build:apk       # Obfuscate + APK build
```

### Advanced Obfuscation + Build
```bash
npm run obfuscate:advanced:build      # Advanced obfuscate + EAS build
npm run obfuscate:advanced:build:apk  # Advanced obfuscate + APK build
```

## 🔧 Configuration

### Standard Configuration (`obfuscator.config.js`)
- Control flow flattening: 75%
- Dead code injection: 40%
- String array encoding: Base64
- Self-defending code enabled

### Advanced Configuration (`scripts/advanced-obfuscate.js`)
- Control flow flattening: 100%
- Dead code injection: 100%
- String array encoding: Base64 + RC4
- Anti-debugging protection
- String encryption
- Maximum obfuscation settings

## 📁 What Gets Obfuscated

The obfuscation targets all TypeScript/JavaScript files in:
- `app/**/*` - Main application code
- `lib/**/*` - Library code
- `services/**/*` - Service layer
- `context/**/*` - React context
- `types/**/*` - Type definitions
- `theme/**/*` - Theme files

## 🚫 What's Excluded

The following are NOT obfuscated:
- `node_modules/**`
- `android/**`
- `ios/**`
- `assets/**`
- Configuration files (`.config.js`, `package.json`, etc.)
- Backup files

## 🔄 Backup System

### Standard Obfuscation
- Creates `.backup` files
- One backup per file

### Advanced Obfuscation
- Creates timestamped backups: `.backup.YYYY-MM-DDTHH-MM-SS-sssZ`
- Multiple backups possible

## 🛡️ Protection Features

### Standard Protection
- Variable/function renaming
- String obfuscation
- Dead code injection
- Control flow obfuscation
- Self-defending code

### Advanced Protection
- All standard features +
- Anti-debugging protection
- String encryption (Base64 + RC4)
- Maximum control flow flattening
- Enhanced dead code injection
- String array rotation and shuffling

## ⚡ Performance Impact

- **Standard obfuscation**: Minimal performance impact
- **Advanced obfuscation**: Slight performance impact due to anti-debugging and encryption

## 🔍 Testing Obfuscated Code

1. Run obfuscation: `npm run obfuscate:advanced`
2. Test the app: `npm start`
3. Verify all functionality works
4. Build if satisfied: `npm run obfuscate:advanced:build:apk`

## 🚨 Important Notes

1. **Always test thoroughly** after obfuscation
2. **Keep backup files safe** - you'll need them for updates
3. **Advanced obfuscation is irreversible** without backups
4. **Some debugging tools may not work** with advanced obfuscation
5. **Performance may be slightly affected** with advanced obfuscation

## 🔧 Troubleshooting

### Common Issues

1. **App crashes after obfuscation**
   - Check if all required strings are in `reservedStrings`
   - Restore from backup and adjust configuration

2. **Build fails**
   - Ensure all dependencies are properly reserved
   - Check for syntax errors in original code

3. **Performance issues**
   - Use standard obfuscation instead of advanced
   - Reduce obfuscation thresholds

### Recovery

To restore from backup:
```bash
# Find backup files
find . -name "*.backup*"

# Restore specific file
cp app/somefile.ts.backup app/somefile.ts

# Restore all files (be careful!)
find . -name "*.backup" -exec sh -c 'cp "$1" "${1%.backup}"' _ {} \;
```

## 🎯 Recommended Workflow

1. **Development**: Use clean code
2. **Testing**: Use standard obfuscation
3. **Production**: Use advanced obfuscation
4. **Deployment**: Build with advanced obfuscation

## 📞 Support

If you encounter issues:
1. Check the backup files
2. Review the configuration
3. Test with standard obfuscation first
4. Ensure all dependencies are properly reserved

---

**Remember: Advanced obfuscation makes your code extremely difficult to reverse engineer, but also makes it nearly impossible to maintain. Use it wisely!** 