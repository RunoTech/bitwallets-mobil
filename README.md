# BitWallets Mobile App

A React Native mobile wallet application for managing cryptocurrency wallets.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- EAS CLI: `npm install -g @expo/eas-cli`
- Expo account at [expo.dev](https://expo.dev)

### Installation
```bash
cd bitwallets-mobil
npm install
```

### Development
```bash
npm start
```

### Build APK
```bash
# Using the build script (recommended)
./build-apk.sh

# Or manually
npm run build
```

## 📱 App Configuration

### Backend Connection
- **URL**: `http://207.154.200.212:3000`
- **Protocol**: HTTP
- **CSRF Protection**: Enabled
- **Network Security**: Configured for cleartext traffic

### Features
- User registration and authentication
- Wallet creation and management
- Multi-currency support (Ethereum, Tron, etc.)
- Secure mnemonic generation
- Device-based security

## 🏗️ Build Profiles

- **Production**: `eas build --profile production --platform android`
- **Preview**: `eas build --profile preview --platform android`
- **Development**: `eas build --profile development --platform android`

## 📋 Requirements

### Backend Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `GET /csrf-token` - CSRF token endpoint
- `GET /health` - Health check
- Wallet management endpoints

### Android Permissions
- Internet access
- Network state
- WiFi state
- Location (for network diagnostics)
- External storage

## 🔧 Configuration Files

- `app.json` - App configuration and permissions
- `eas.json` - Build profiles and settings
- `app/lib/axios.ts` - Network configuration
- `app/context/auth.tsx` - Authentication logic

## 📖 Documentation

For detailed build instructions, see [APK_BUILD_GUIDE.md](./APK_BUILD_GUIDE.md)

## 🛠️ Development

### Project Structure
```
app/
├── (auth)/          # Authentication screens
├── (app)/           # Main app screens
├── context/         # React context providers
├── lib/             # Utility libraries
├── services/        # API services
└── theme/           # UI theme configuration
```

### Key Dependencies
- React Native
- Expo Router
- Axios (HTTP client)
- React Hook Form
- React Native Paper (UI components)
- Ethers.js (Ethereum library)

## 🔒 Security

- CSRF token protection
- Device ID generation
- Password validation
- Secure storage for sensitive data
- Network security configuration

## 📞 Support

For issues or questions:
1. Check the console logs
2. Verify backend connectivity
3. Review network configuration
4. Test with different devices

---

**Version**: 1.0.0  
**Backend**: http://207.154.200.212:3000  
**Platform**: Android APK
