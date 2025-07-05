#!/bin/bash

echo "🚀 Starting BitWallets APK Build Process..."
echo "📱 Backend URL: http://207.154.200.212:3000"
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI is not installed. Please install it first:"
    echo "npm install -g @expo/eas-cli"
    exit 1
fi

# Check if logged in to Expo
if ! eas whoami &> /dev/null; then
    echo "❌ Not logged in to Expo. Please login first:"
    echo "eas login"
    exit 1
fi

echo "✅ EAS CLI is ready"
echo ""

# Clean and install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔧 Building APK..."
echo "This will take a few minutes..."

# Build the APK
eas build --profile production --platform android

echo ""
echo "✅ Build process completed!"
echo "📱 Your APK will be available in the EAS dashboard or downloaded automatically."
echo ""
echo "🔗 Backend is configured to: http://207.154.200.212:3000" 