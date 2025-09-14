#!/bin/bash

# Quick start script for development/testing
# This script installs dependencies and starts the app without building

set -e

echo "=== Quick Start - Mint Clipboard ==="

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "Error: Please run this script from the mint-clipboard directory"
    exit 1
fi

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Please install Node.js first:"
    echo "curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
    echo "sudo apt-get install -y nodejs"
    exit 1
fi

# Check for xdotool (needed for auto-paste)
if ! command -v xdotool &> /dev/null; then
    echo "Warning: xdotool not found. Auto-paste feature will not work."
    echo "Install it with: sudo apt-get install xdotool"
    echo "Or run: ./install.sh for full installation"
    echo ""
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Starting Mint Clipboard..."
echo ""
echo "🎯 How to use:"
echo "  • Press Super+V (or Ctrl+Shift+V) to open clipboard"
echo "  • Click any item to copy it"
echo "  • Pin items to keep them at top"
echo "  • Search through history"
echo "  • Right-click system tray icon for options"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

# Start the application
npm start
