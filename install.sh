#!/bin/bash

# Mint Clipboard Installation Script for Linux Mint
# This script installs Node.js, builds the app, and sets up auto-start

set -e

echo "=== Mint Clipboard Installation Script ==="
echo "Installing Windows 10-style clipboard for Linux Mint..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "Error: Please run this script from the mint-clipboard directory"
    exit 1
fi

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "Node.js is already installed"
fi

# Install xdotool for auto-paste functionality
if ! command -v xdotool &> /dev/null; then
    echo "Installing xdotool for auto-paste functionality..."
    sudo apt-get update
    sudo apt-get install -y xdotool
else
    echo "xdotool is already installed"
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Handle npm audit warnings (optional)
echo "Checking for security issues..."
npm audit --audit-level moderate || echo "Some npm audit warnings found, but proceeding with installation..."

# Build the application
echo "Building application..."
npm run build-linux

# Create desktop entry
echo "Creating desktop entry..."
DESKTOP_FILE="$HOME/.local/share/applications/mint-clipboard.desktop"
mkdir -p "$HOME/.local/share/applications"

cat > "$DESKTOP_FILE" << EOF
[Desktop Entry]
Name=Mint Clipboard
Comment=Windows 10 style clipboard manager for Linux Mint
Exec=$PWD/dist/mint-clipboard*.AppImage
Icon=$PWD/assets/tray-icon.png
Type=Application
Categories=Utility;
StartupNotify=false
NoDisplay=true
X-GNOME-Autostart-enabled=true
EOF

# Create autostart entry
echo "Setting up autostart..."
AUTOSTART_DIR="$HOME/.config/autostart"
mkdir -p "$AUTOSTART_DIR"
cp "$DESKTOP_FILE" "$AUTOSTART_DIR/mint-clipboard.desktop"

# Make AppImage executable
chmod +x dist/mint-clipboard*.AppImage

echo ""
echo "=== Installation Complete! ==="
echo ""
echo "Mint Clipboard has been installed successfully!"
echo ""
echo "Features:"
echo "  • Windows 10-style interface"
echo "  • Clipboard history with search"
echo "  • Pin/unpin clipboard items"
echo "  • Global hotkey: Super+V (like Win+V)"
echo "  • Alternative hotkey: Ctrl+Shift+V"
echo "  • System tray integration"
echo "  • Auto-start on login"
echo ""
echo "To start now: ./dist/mint-clipboard*.AppImage"
echo "Or press Super+V after starting the application"
echo ""
echo "The app will automatically start on next login."
echo "Right-click the system tray icon for options."
