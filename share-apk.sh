#!/bin/bash

echo "📱 BitWallets APK Sharing Helper"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Find the latest APK
APK_FILE=$(ls -t *.apk 2>/dev/null | head -n1)

if [ -z "$APK_FILE" ]; then
    echo "❌ No APK file found in current directory"
    echo "Please run a build first: npm run build:local"
    exit 1
fi

echo -e "${GREEN}✅ Found APK: $APK_FILE${NC}"
echo ""

# Get file size
FILE_SIZE=$(du -h "$APK_FILE" | cut -f1)
echo "📊 File size: $FILE_SIZE"
echo ""

# Copy to Desktop for easy access
DESKTOP_COPY="$HOME/Desktop/bitwallets-app.apk"
cp "$APK_FILE" "$DESKTOP_COPY"
echo -e "${GREEN}✅ Copied to Desktop: $DESKTOP_COPY${NC}"
echo ""

echo "🚀 Sharing Options:"
echo ""
echo "1. 📁 Desktop Copy: $DESKTOP_COPY"
echo "2. 📧 Email: Attach the APK file"
echo "3. ☁️  Cloud Storage:"
echo "   • Google Drive: drive.google.com"
echo "   • Dropbox: dropbox.com"
echo "   • iCloud Drive: icloud.com"
echo "4. 📱 Direct Transfer:"
echo "   • AirDrop (Mac to Mac/iPhone)"
echo "   • USB cable"
echo "   • Bluetooth"
echo "5. 💬 Messaging:"
echo "   • WhatsApp"
echo "   • Telegram"
echo "   • Slack"
echo ""

echo "📋 Installation Instructions for Recipients:"
echo "1. Download the APK file"
echo "2. Enable 'Install from unknown sources' in Android settings"
echo "3. Open the APK file and install"
echo "4. Open BitWallets app"
echo "5. Use debug buttons to test network connectivity"
echo ""

echo "🔗 Backend URL: http://207.154.200.212:3000"
echo ""

# Open Desktop folder
echo -e "${BLUE}Opening Desktop folder...${NC}"
open ~/Desktop

echo ""
echo -e "${YELLOW}💡 Tip: The APK includes debug features to test network connectivity!${NC}" 