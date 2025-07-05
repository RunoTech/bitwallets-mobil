# 🚀 Quota-Free Local APK Build Guide

## Quick Start

### Option 1: Automated Build Script (Recommended)
```bash
./build-local.sh
```
This interactive script will:
- ✅ Check system requirements
- ✅ Install dependencies
- ✅ Let you choose build profile
- ✅ Build APK locally (no quota used)
- ✅ Provide next steps

### Option 2: Manual Commands
```bash
# Development build (recommended for testing)
npm run build:local

# Preview build
npm run build:preview-local

# Production build
npm run build:prod-local
```

## 🎯 Build Profiles

| Profile | Command | Use Case |
|---------|---------|----------|
| **Development** | `npm run build:local` | Testing, debugging, daily development |
| **Preview** | `npm run build:preview-local` | Pre-release testing |
| **Production** | `npm run build:prod-local` | Final release |

## 📋 Prerequisites

### Required
- ✅ Node.js (v18+)
- ✅ EAS CLI: `npm install -g @expo/eas-cli`
- ✅ 3GB+ free disk space

### Optional (but recommended)
- ✅ Java JDK 11+
- ✅ Android SDK (for testing)
- ✅ Expo account login: `eas login`

## 🔧 System Requirements Check

The build script automatically checks:
- ✅ EAS CLI installation
- ✅ Java availability
- ✅ Android SDK availability
- ✅ Disk space
- ✅ Dependencies

## 📱 Build Output

### Location
```
~/.expo/android-builds/
```

### APK File
- Development: `bitwallets-mobil-development.apk`
- Preview: `bitwallets-mobil-preview.apk`
- Production: `bitwallets-mobil-production.apk`

## 🚀 Installation & Testing

1. **Transfer APK** to your Android device
2. **Enable "Install from unknown sources"** in Android settings
3. **Install the APK**
4. **Test with backend** at `http://207.154.200.212:3000`

## 🔍 Debug Features

The APK includes built-in debugging:
- 🌐 **Test Network** - Check connectivity
- 🔍 **View Error Logs** - See detailed errors
- 📊 **Log Summary** - Quick error overview

## 💡 Benefits of Local Builds

- ✅ **No EAS quota usage**
- ✅ **Faster builds** (no upload/download)
- ✅ **Works offline**
- ✅ **Real device testing**
- ✅ **Solves simulator network issues**

## 🛠️ Troubleshooting

### Build Fails
```bash
# Check system requirements
./build-local.sh

# Try different profile
npm run build:local

# Check disk space
df -h
```

### APK Won't Install
- Enable "Install from unknown sources"
- Check APK file integrity
- Try different Android device

### Network Issues in APK
- Use debug buttons in the app
- Check error logs
- Verify backend is running at `207.154.200.212:3000`

## 📞 Support

If you encounter issues:
1. Run `./build-local.sh` for system checks
2. Check the build logs
3. Verify system requirements
4. Try different build profile

---

**Backend URL**: http://207.154.200.212:3000  
**Build Type**: Local (No quota used)  
**Debug Features**: Built-in network testing and error logging 

# Local Production Build Guide: Signed APK & AAB

This guide will help you generate a **signed, distributable APK and AAB** for your BitWallets app.

---

## 1. Generate a Keystore (if you don't have one)

```sh
keytool -genkeypair -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```
- Save `my-release-key.jks` in `bitwallets-mobil/android/app/`.
- Remember your passwords and alias!

---

## 2. Configure Gradle for Signing

Edit `bitwallets-mobil/android/app/build.gradle`:

```groovy
android {
    ...
    signingConfigs {
        release {
            storeFile file('my-release-key.jks')
            storePassword 'your-store-password'
            keyAlias 'my-key-alias'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            shrinkResources false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

---

## 3. Build the Signed APK and AAB

From your project root:

```sh
cd bitwallets-mobil/android
./gradlew clean
./gradlew assembleRelease      # For APK
./gradlew bundleRelease        # For AAB
```

- APK: `bitwallets-mobil/android/app/build/outputs/apk/release/app-release.apk`
- AAB: `bitwallets-mobil/android/app/build/outputs/bundle/release/app-release.aab`

---

## 4. Verify the Signature

```sh
jarsigner -verify -verbose -certs app/build/outputs/apk/release/app-release.apk
jarsigner -verify -verbose -certs app/build/outputs/bundle/release/app-release.aab
```
- You should see `jar verified.`

---

## 5. Distribute or Upload

- **Share APK**: Send `app-release.apk` directly to testers.
- **Play Store**: Upload `app-release.aab` to Google Play Console.

---

## Troubleshooting
- If you see `jar is unsigned`, check your `build.gradle` and keystore path/passwords.
- If you lose your keystore, you cannot update the app on Play Store with the same package name.

---

**Keep your keystore file and passwords safe!** 