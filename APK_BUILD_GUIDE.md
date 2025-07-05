# BitWallets APK Build Guide

## Overview
This guide will help you build an APK for the BitWallets mobile app that connects to the backend at `http://207.154.200.212:3000`.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **EAS CLI** - Install globally:
   ```bash
   npm install -g @expo/eas-cli
   ```
3. **Expo Account** - Sign up at [expo.dev](https://expo.dev)
4. **Android Development Environment** (for local builds)

## Quick Start

### Option 1: Using the Build Script (Recommended)
```bash
cd bitwallets-mobil
./build-apk.sh
```

### Option 2: Manual Build
```bash
cd bitwallets-mobil

# Install dependencies
npm install

# Login to Expo (if not already logged in)
eas login

# Build APK
eas build --profile production --platform android
```

## Build Profiles

The app is configured with three build profiles:

### Production (APK)
- **Command**: `eas build --profile production --platform android`
- **Output**: APK file
- **Use case**: Distribution to users

### Preview (APK)
- **Command**: `eas build --profile preview --platform android`
- **Output**: APK file
- **Use case**: Testing before production

### Development (APK)
- **Command**: `eas build --profile development --platform android`
- **Output**: APK file with development features
- **Use case**: Development and debugging

## Configuration Details

### Backend Configuration
- **URL**: `http://207.154.200.212:3000`
- **Protocol**: HTTP (not HTTPS)
- **Port**: 3000

### App Configuration
- **Package Name**: `com.anonymous.bitwallets`
- **Version**: 1.0.0
- **Version Code**: 1

### Network Security
The app is configured to allow cleartext traffic for the backend IP:
- Android: `usesCleartextTraffic: true`
- iOS: Network security exceptions for `207.154.200.212`

## Build Process

1. **Dependency Installation**: All required packages are installed
2. **Configuration Validation**: App configuration is validated
3. **Build Process**: EAS builds the APK using the production profile
4. **Output**: APK file is generated and available for download

## Troubleshooting

### Common Issues

1. **EAS CLI not found**
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Not logged in to Expo**
   ```bash
   eas login
   ```

3. **Build fails due to network issues**
   - Ensure backend is running at `http://207.154.200.212:3000`
   - Check firewall settings
   - Verify network connectivity

4. **APK doesn't connect to backend**
   - Verify the backend IP is correct in `app/lib/axios.ts`
   - Check that the backend is accessible from the device
   - Ensure the backend allows mobile app connections

### Network Testing
The app includes built-in network diagnostics. If you encounter connection issues:

1. Install the APK on a device
2. Open the app
3. Check the console logs for network diagnostics
4. Verify the backend is reachable from the device

## Distribution

### Internal Testing
- Use the generated APK file directly
- Install on Android devices for testing
- Share APK file with testers

### Production Distribution
- Upload APK to Google Play Store
- Or distribute via direct APK installation
- Ensure backend is publicly accessible

## Security Notes

- The app uses HTTP for backend communication (not HTTPS)
- CSRF protection is implemented
- Device ID generation for security
- Password validation and encryption

## Support

If you encounter issues:
1. Check the console logs in the app
2. Verify backend connectivity
3. Test with different devices/networks
4. Review the network configuration

## Backend Requirements

Ensure your backend at `http://207.154.200.212:3000` has:
- CORS enabled for mobile apps
- CSRF token endpoint (`/csrf-token`)
- Health check endpoint (`/health`)
- User registration endpoint
- Wallet creation endpoints

---

**Last Updated**: $(date)
**Backend URL**: http://207.154.200.212:3000
**App Version**: 1.0.0 