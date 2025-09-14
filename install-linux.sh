#!/bin/bash

# Mint Clipboard Installation Script
# Automatically downloads and installs Mint Clipboard with hotkey setup

set -e

GITHUB_REPO="mint-clipboard/mint-clipboard"
TEMP_DIR="/tmp/mint-clipboard-install"
DEB_FILE=""

echo "🚀 Mint Clipboard Installation Script"
echo "======================================"
echo ""

# Check if running on Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo "❌ This script is for Linux systems only."
    echo "For macOS, please download the .dmg file manually."
    exit 1
fi

# Check if curl or wget is available
if command -v curl >/dev/null 2>&1; then
    DOWNLOADER="curl -L -o"
elif command -v wget >/dev/null 2>&1; then
    DOWNLOADER="wget -O"
else
    echo "❌ Neither curl nor wget found. Please install one of them."
    exit 1
fi

# Create temp directory
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

echo "📦 Downloading latest release..."

# Get the latest release download URL
if command -v curl >/dev/null 2>&1; then
    DOWNLOAD_URL=$(curl -s "https://api.github.com/repos/$GITHUB_REPO/releases/latest" | \
                   grep "browser_download_url.*\.deb" | \
                   cut -d '"' -f 4)
else
    echo "❌ Unable to fetch release information. Please download manually."
    exit 1
fi

if [ -z "$DOWNLOAD_URL" ]; then
    echo "❌ Could not find .deb file in latest release."
    echo "Please check: https://github.com/$GITHUB_REPO/releases"
    exit 1
fi

DEB_FILE=$(basename "$DOWNLOAD_URL")

echo "📥 Downloading: $DEB_FILE"
if command -v curl >/dev/null 2>&1; then
    curl -L -o "$DEB_FILE" "$DOWNLOAD_URL"
else
    wget -O "$DEB_FILE" "$DOWNLOAD_URL"
fi

echo "📦 Installing package..."
sudo dpkg -i "$DEB_FILE"

# Install missing dependencies if any
echo "🔧 Installing dependencies..."
sudo apt-get install -f -y

echo "⚙️  Setting up global hotkeys..."
# The postinstall script should handle this automatically

echo ""
echo "✅ Installation Complete!"
echo ""
echo "🔥 Mint Clipboard is now installed with the following hotkeys:"
echo "   • Super + V (Windows key + V) - Open clipboard"
echo "   • Ctrl + Shift + V - Alternative hotkey"
echo ""
echo "📝 Usage:"
echo "   1. Copy some text or images (Ctrl+C)"
echo "   2. Press Super+V to open the clipboard"
echo "   3. Click any item to paste it automatically"
echo ""
echo "🔄 Please log out and log back in (or reboot) for hotkeys to take effect."
echo ""
echo "💡 If hotkeys don't work, run: mint-clipboard --setup-hotkeys"
echo ""

# Cleanup
cd /
rm -rf "$TEMP_DIR"

echo "🎉 Enjoy your Windows 10-style clipboard experience!"
