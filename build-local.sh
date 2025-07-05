#!/bin/bash

echo "🚀 Starting Quota-Free Local BitWallets APK Build"
echo "📱 Backend URL: http://207.154.200.212:3000"
echo "💡 This build will NOT use your EAS daily quota!"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "eas.json" ]; then
    print_error "Please run this script from the bitwallets-mobil directory"
    exit 1
fi

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    print_error "EAS CLI is not installed. Please install it first:"
    echo "npm install -g @expo/eas-cli"
    exit 1
fi

print_success "EAS CLI is ready"

# Check EAS CLI version
EAS_VERSION=$(eas --version 2>/dev/null || echo "unknown")
print_status "EAS CLI version: $EAS_VERSION"

# Check if logged in to Expo
if ! eas whoami &> /dev/null; then
    print_warning "Not logged in to Expo. For local builds, this is optional but recommended."
    echo "To login: eas login"
    echo ""
    read -p "Continue without login? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    print_success "Logged in to Expo"
fi

# Check system requirements
print_status "Checking system requirements..."

# Check Java
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    print_success "Java found: $JAVA_VERSION"
else
    print_warning "Java not found. You may need to install JDK 11 or higher."
fi

# Check Android SDK (optional for local builds)
if command -v adb &> /dev/null; then
    print_success "Android SDK found"
else
    print_warning "Android SDK not found. Local builds may still work but you'll need it for testing."
fi

# Check available disk space
DISK_SPACE=$(df . | awk 'NR==2 {print $4}')
DISK_SPACE_GB=$((DISK_SPACE / 1024 / 1024))
if [ $DISK_SPACE_GB -lt 3 ]; then
    print_warning "Low disk space: ${DISK_SPACE_GB}GB available. Recommended: 3GB+"
else
    print_success "Disk space: ${DISK_SPACE_GB}GB available"
fi

echo ""
print_status "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi

print_success "Dependencies installed"

echo ""
print_status "Choose build profile:"
echo "1) Development (recommended for testing)"
echo "2) Preview"
echo "3) Production"
echo ""

read -p "Enter your choice (1-3): " -n 1 -r
echo

case $REPLY in
    1)
        PROFILE="development"
        print_status "Building development APK..."
        ;;
    2)
        PROFILE="preview"
        print_status "Building preview APK..."
        ;;
    3)
        PROFILE="production"
        print_status "Building production APK..."
        ;;
    *)
        print_error "Invalid choice. Using development profile."
        PROFILE="development"
        ;;
esac

echo ""
print_status "Starting local build with profile: $PROFILE"
print_status "This will take 10-15 minutes..."
print_status "Build location: ~/.expo/android-builds/"

# Start the build
eas build --profile $PROFILE --platform android --local

BUILD_EXIT_CODE=$?

echo ""
if [ $BUILD_EXIT_CODE -eq 0 ]; then
    print_success "✅ Local build completed successfully!"
    echo ""
    print_status "Next steps:"
    echo "1. Find your APK in: ~/.expo/android-builds/"
    echo "2. Transfer to your Android device"
    echo "3. Enable 'Install from unknown sources' in Android settings"
    echo "4. Install the APK and test with your backend"
    echo ""
    print_status "Debug features available in the app:"
    echo "• 🌐 Test Network - Check connectivity to 207.154.200.212:3000"
    echo "• 🔍 View Error Logs - See detailed error history"
    echo "• 📊 Log Summary - Quick error overview"
    echo ""
    print_success "🎉 No EAS quota was used for this build!"
else
    print_error "❌ Build failed with exit code: $BUILD_EXIT_CODE"
    echo ""
    print_status "Troubleshooting tips:"
    echo "• Check your internet connection"
    echo "• Ensure you have sufficient disk space"
    echo "• Try running: npm run build:local"
    echo "• Check the build logs above for specific errors"
fi

echo ""
print_status "Backend URL: http://207.154.200.212:3000" 