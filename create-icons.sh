#!/bin/bash

echo "Creating application icons..."

# Create various icon sizes for different platforms
cd /home/irony/Downloads/clip/assets

# Create icon.icns for macOS (if iconutil is available)
if command -v iconutil &> /dev/null; then
    echo "Creating macOS icon..."
    mkdir -p icon.iconset
    
    # Create different sizes for iconset
    for size in 16 32 64 128 256 512 1024; do
        if command -v convert &> /dev/null; then
            convert tray-icon.png -resize ${size}x${size} icon.iconset/icon_${size}x${size}.png
        fi
    done
    
    # Create @2x versions for retina
    for size in 16 32 64 128 256 512; do
        double=$((size * 2))
        if command -v convert &> /dev/null; then
            convert tray-icon.png -resize ${double}x${double} icon.iconset/icon_${size}x${size}@2x.png
        fi
    done
    
    iconutil -c icns icon.iconset
    rm -rf icon.iconset
fi

# Create Windows icon (if available)
if command -v convert &> /dev/null; then
    echo "Creating Windows icon..."
    convert tray-icon.png -resize 256x256 icon.ico
fi

echo "Icons created successfully!"
