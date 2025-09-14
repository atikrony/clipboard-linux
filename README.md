# Mint Clipboard

A Windows 10-style clipboard manager for Linux Mint and macOS that provides an exact replica of the Windows 10 clipboard experience.

![Mint Clipboard](https://via.placeholder.com/400x300/2d2d30/ffffff?text=Mint+Clipboard)

## ✨ Features

- 🎨 **Exact Windows 10 UI replica** - Pixel-perfect recreation of Windows 10 clipboard interface
- 📝 **Text clipboard support** - Copy, store, and paste text clips
- 🖼️ **Image clipboard support** - Copy, store, and paste images
- ⚡ **Auto-paste functionality** - Click any item to automatically paste it
- 🎯 **Cursor positioning** - Opens at your cursor location, not at a fixed position
- 🔄 **Real-time monitoring** - Automatically captures clipboard changes
- 🚀 **Fast and lightweight** - Built with Electron for optimal performance
- 🔧 **Automated setup** - Global hotkeys configured automatically during installation

## 🔥 Global Hotkeys

### Linux (after .deb installation)
- **Super + V** (Windows key + V) - Opens clipboard at cursor
- **Ctrl + Shift + V** - Alternative hotkey

### macOS (after .dmg installation)  
- **fn + V** (Function + V) - Opens clipboard at cursor
- **⌘ + Shift + V** - Alternative hotkey

## 📦 Installation

### Linux (.deb package)

1. Download the latest `.deb` file from the releases page
2. Install using your package manager:
   ```bash
   sudo dpkg -i mint-clipboard_1.0.0_amd64.deb
   ```
3. If dependencies are missing, run:
   ```bash
   sudo apt-get install -f
   ```
4. The global hotkey **Super + V** will be automatically configured
5. Reboot or log out/in for hotkeys to take effect

### macOS (.dmg package)

1. Download the latest `.dmg` file from the releases page
2. Open the DMG and drag Mint Clipboard to Applications
3. Run the application once to trigger setup
4. Grant accessibility permissions when prompted:
   - Go to System Preferences > Security & Privacy > Privacy
   - Select "Accessibility" and add Mint Clipboard
5. The global hotkey **fn + V** will be automatically configured

## 🚀 Usage

### Opening the Clipboard
- Press **Super + V** (Linux) or **fn + V** (macOS)
- The clipboard window will appear at your current cursor position

### Copying Items
- Copy text or images as usual (Ctrl+C / ⌘+C)
- Items are automatically added to the clipboard history

### Pasting Items
- Click any item in the clipboard to automatically paste it
- The window will close after pasting

### Window Controls
- **Drag** the window by clicking and dragging the header
- **Close** by clicking outside the window or pressing Escape

## 🔧 Manual Hotkey Setup

If automatic hotkey setup doesn't work, you can set it up manually:

### Linux Manual Setup

**For GNOME/Cinnamon:**
```bash
gsettings set org.cinnamon.desktop.keybindings.custom-keybinding:/org/cinnamon/desktop/keybindings/custom-keybindings/custom0/ name "Mint Clipboard"
gsettings set org.cinnamon.desktop.keybindings.custom-keybinding:/org/cinnamon/desktop/keybindings/custom-keybindings/custom0/ command "/usr/bin/mint-clipboard"
gsettings set org.cinnamon.desktop.keybindings.custom-keybinding:/org/cinnamon/desktop/keybindings/custom-keybindings/custom0/ binding "['<Super>v']"
```

**For KDE:**
```bash
kwriteconfig5 --file kglobalshortcutsrc --group "mint-clipboard" --key "_k_friendly_name" "Mint Clipboard"
kwriteconfig5 --file kglobalshortcutsrc --group "mint-clipboard" --key "show-clipboard" "Meta+V,none,Show Mint Clipboard"
```

### macOS Manual Setup

1. Open **System Preferences > Keyboard > Shortcuts**
2. Select **App Shortcuts** from the left sidebar
3. Click the **+** button
4. Set:
   - Application: Mint Clipboard
   - Menu Title: (leave blank)
   - Keyboard Shortcut: fn+V

## 🛠️ Development

### Requirements
- Node.js 16+
- npm or yarn

### Setup
```bash
git clone https://github.com/mint-clipboard/mint-clipboard.git
cd mint-clipboard
npm install
```

### Running in Development
```bash
npm start
```

### Building Packages
```bash
# Build for current platform
npm run build

# Build for Linux
npm run build-linux

# Build for macOS
npm run build-mac

# Build for all platforms
npm run build-all
```

## 📋 System Requirements

### Linux
- **OS**: Linux Mint 19+, Ubuntu 18.04+, or compatible
- **Desktop Environment**: Cinnamon, GNOME, KDE, XFCE, MATE
- **Dependencies**: xdotool (automatically installed with .deb)
- **Architecture**: x64, ARM64

### macOS
- **OS**: macOS 10.14+
- **Architecture**: x64, ARM64 (Apple Silicon)
- **Permissions**: Accessibility access (for global hotkeys)

## 🐛 Troubleshooting

### Linux Issues

**Global hotkey not working:**
1. Check if xdotool is installed: `which xdotool`
2. Try the manual hotkey setup instructions above
3. Reboot or restart your session

**Window positioning issues:**
1. Ensure xdotool is properly installed
2. Check if your desktop environment supports cursor positioning

### macOS Issues

**Global hotkey not working:**
1. Check accessibility permissions in System Preferences
2. Try the manual hotkey setup instructions above
3. Restart the application

**Permission denied errors:**
1. Grant accessibility permissions to Mint Clipboard
2. Add Mint Clipboard to Full Disk Access if needed

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review system requirements

## 🏆 Acknowledgments

- Inspired by the Windows 10 clipboard experience
- Built with Electron for cross-platform compatibility
- Special thanks to the Linux Mint community

---

**Made with ❤️ for the Linux Mint community**
- **Auto-Paste**: Click any item (text or image) to automatically paste into focused area
- **Clipboard History**: Automatically saves and displays clipboard history
- **Pin/Unpin Items**: Pin important clipboard items to keep them at the top
- **Movable Window**: Drag the header to move the clipboard window anywhere
- **Cursor Positioning**: Opens at cursor location when triggered with hotkey
- **Global Hotkeys**: 
  - `Super+V` (equivalent to Win+V on Windows) - Opens at cursor position
  - `Ctrl+Shift+V` (alternative hotkey)
- **System Tray**: Minimizes to system tray with right-click context menu
- **Auto-start**: Automatically starts on login
- **Dark Theme**: Beautiful dark theme matching Windows 10 style

## Requirements

- Linux Mint (or other Linux distributions)
- Node.js 16 or higher
- X11 display server

## Quick Start

1. **Clone or download** this repository
2. **Make scripts executable**:
   ```bash
   chmod +x start.sh install.sh
   ```
3. **Quick test run**:
   ```bash
   ./start.sh
   ```
4. **Full installation**:
   ```bash
   ./install.sh
   ```

## Usage

### Opening the Clipboard
- Press `Super+V` (Windows key + V) - Opens at cursor location
- Or press `Ctrl+Shift+V` - Opens at cursor location
- Or click the system tray icon - Opens at default position

### Basic Operations
- **Auto-paste text**: Click on any text item - automatically pastes to focused text field
- **Auto-paste images**: Click on any image item - automatically pastes to focused application
- **Pin/Unpin**: Click the pin icon on items (works for both text and images)
- **Delete item**: Click the delete (trash) icon (works for both text and images)
- **Clear all**: Click the clear all button in the header
- **Move window**: Drag the header (with ⋮⋮ indicator) to move the window

### System Tray
- **Left click**: Show/hide clipboard window
- **Right click**: Context menu with options

## Installation Details

The installation script will:
1. Install Node.js if not present
2. Install application dependencies
3. Build the application as an AppImage
4. Create desktop entry
5. Set up auto-start on login
6. Create system tray integration

## Manual Installation

If you prefer manual installation:

```bash
# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install dependencies
npm install

# Build the application
npm run build-linux

# Run the AppImage
./dist/mint-clipboard*.AppImage
```

## Development

To run in development mode:

```bash
npm install
npm start
```

## File Structure

```
mint-clipboard/
├── main.js              # Electron main process
├── index.html           # Application UI
├── styles.css           # Windows 10 style CSS
├── renderer.js          # Frontend JavaScript
├── package.json         # Project configuration
├── assets/
│   └── tray-icon.png   # System tray icon
├── install.sh          # Installation script
├── start.sh            # Quick start script
└── README.md           # This file
```

## Features Comparison

| Feature | Windows 10 Clipboard | Mint Clipboard |
|---------|----------------------|----------------|
| Interface | Dark themed, modern | ✅ Exact replica |
| Clipboard history | ✅ | ✅ |
| Search | ✅ | ✅ |
| Pin items | ✅ | ✅ |
| Global hotkey (Win+V) | ✅ | ✅ (Super+V) |
| System tray | ✅ | ✅ |
| Auto-start | ✅ | ✅ |
| Text support | ✅ | ✅ |

## Troubleshooting

### Global Hotkey Not Working
- Make sure no other application is using `Super+V`
- Try the alternative hotkey `Ctrl+Shift+V`
- Check if the application is running in the system tray

### System Tray Icon Not Visible
- Ensure your desktop environment supports system tray
- Check system tray settings in your desktop environment

### Permission Issues
- Make sure scripts are executable: `chmod +x *.sh`
- Run installation script with proper permissions

## Uninstallation

To remove Mint Clipboard:

```bash
# Remove autostart
rm ~/.config/autostart/mint-clipboard.desktop

# Remove desktop entry
rm ~/.local/share/applications/mint-clipboard.desktop

# Remove application files
rm -rf ~/path/to/mint-clipboard
```

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Changelog

### v1.0.0
- Initial release
- Windows 10 interface replica
- Full clipboard functionality
- Global hotkeys
- System tray integration
- Auto-start support
