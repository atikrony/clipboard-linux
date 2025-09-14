#!/bin/bash

# Build script for Mint Clipboard
# Creates distributable packages for Linux and macOS

set -e

echo "🔨 Building Mint Clipboard Packages"
echo "===================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create assets directory if it doesn't exist
if [ ! -d "assets" ]; then
    echo "📁 Creating assets directory..."
    mkdir -p assets
    
    # Create a simple tray icon if it doesn't exist
    if [ ! -f "assets/tray-icon.png" ]; then
        echo "🎨 Creating placeholder icon..."
        # Create a simple 32x32 PNG (you can replace this with a real icon)
        convert -size 32x32 xc:transparent \
                -draw "fill #2d2d30 rectangle 2,2 30,30" \
                -draw "fill white rectangle 6,6 26,26" \
                -draw "fill #2d2d30 rectangle 8,8 24,24" \
                assets/tray-icon.png 2>/dev/null || {
            echo "⚠️  ImageMagick not found. Using placeholder."
            echo "Please add a real icon at assets/tray-icon.png"
            touch assets/tray-icon.png
        }
    fi
fi

# Make post-install scripts executable
if [ -f "build/postinstall.sh" ]; then
    chmod +x build/postinstall.sh
fi

if [ -f "build/postinstall-mac.sh" ]; then
    chmod +x build/postinstall-mac.sh
fi

echo "🐧 Building Linux .deb package..."
npm run build-linux

echo ""
echo "🍎 Building macOS .dmg package..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    npm run build-mac
else
    echo "⚠️  macOS builds can only be created on macOS systems."
    echo "   You can still build the .dmg on a Mac later using: npm run build-mac"
fi

echo ""
echo "✅ Build Complete!"
echo ""

# List built packages
if [ -d "dist" ]; then
    echo "📦 Generated packages:"
    find dist -name "*.deb" -o -name "*.dmg" -o -name "*.AppImage" | while read file; do
        echo "   • $(basename "$file")"
    done
    echo ""
    echo "📁 All packages are in the 'dist' directory"
else
    echo "❌ No dist directory found. Build may have failed."
fi

echo ""
echo "🚀 Next steps:"
echo "   • Test the .deb package: sudo dpkg -i dist/*.deb"
echo "   • Upload packages to GitHub releases"
echo "   • Share the install-linux.sh script for easy installation"
