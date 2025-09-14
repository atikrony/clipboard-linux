#!/bin/bash

echo "=== Mint Clipboard Build Script ==="
echo ""

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "Error: Please run this script from the mint-clipboard directory"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is required for building"
    echo "Install with: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
    echo "             sudo apt-get install -y nodejs"
    exit 1
fi

echo "Building Mint Clipboard for multiple platforms..."
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create icons
echo "🎨 Creating application icons..."
./create-icons.sh 2>/dev/null || echo "Icon creation skipped (optional tools not available)"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/

# Build for Linux (.deb)
echo ""
echo "🐧 Building for Linux (.deb)..."
npm run build-deb

# Build for macOS (.dmg) - Note: This will only work on macOS or with proper cross-compilation setup
echo ""
echo "🍎 Building for macOS (.dmg)..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    npm run build-dmg
else
    echo "⚠️  macOS build requires macOS system or cross-compilation setup"
    echo "   To build on macOS later, run: npm run build-dmg"
    echo "   For cross-compilation, see: https://www.electron.build/multi-platform-build"
fi

echo ""
echo "=== Build Complete! ==="
echo ""

# Show build results
if [ -d "dist" ]; then
    echo "📂 Build outputs in 'dist/' directory:"
    ls -la dist/
    echo ""
    
    # Show file sizes
    echo "📊 File sizes:"
    find dist/ -name "*.deb" -o -name "*.dmg" -o -name "*.AppImage" | while read file; do
        size=$(du -h "$file" | cut -f1)
        echo "  $(basename "$file"): $size"
    done
    echo ""
    
    # Installation instructions
    echo "📋 Installation instructions:"
    echo ""
    
    if ls dist/*.deb 1> /dev/null 2>&1; then
        echo "🐧 Linux (Ubuntu/Debian/Mint):"
        echo "   sudo dpkg -i dist/mint-clipboard_*.deb"
        echo "   sudo apt-get install -f  # Fix dependencies if needed"
        echo ""
    fi
    
    if ls dist/*.AppImage 1> /dev/null 2>&1; then
        echo "🐧 Linux (AppImage - Universal):"
        echo "   chmod +x dist/mint-clipboard-*.AppImage"
        echo "   ./dist/mint-clipboard-*.AppImage"
        echo ""
    fi
    
    if ls dist/*.dmg 1> /dev/null 2>&1; then
        echo "🍎 macOS:"
        echo "   Open dist/mint-clipboard-*.dmg"
        echo "   Drag Mint Clipboard to Applications folder"
        echo ""
    fi
    
else
    echo "❌ Build failed - no output directory found"
    exit 1
fi

echo "✅ All builds completed successfully!"
echo ""
echo "🚀 Ready for distribution!"
