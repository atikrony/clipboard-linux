const { app, BrowserWindow, globalShortcut, Tray, Menu, ipcMain, clipboard, screen } = require('electron');
const path = require('path');
const Store = require('electron-store');
const { spawn, execSync } = require('child_process');

// Initialize store
const store = new Store();

// Enable autostart
app.setLoginItemSettings({
    openAtLogin: true,
    openAsHidden: true,
    name: 'Mint Clipboard',
    path: process.execPath
});

let mainWindow = null;
let tray = null;
let isQuitting = false;

// Initialize clipboard history
if (!store.get('clipboardHistory')) {
    store.set('clipboardHistory', []);
}

function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    
    mainWindow = new BrowserWindow({
        width: 360,
        height: 480,
        show: false,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        resizable: false,
        movable: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    mainWindow.loadFile('index.html');

    // Initial position (will be updated when shown)
    const x = Math.floor(width - 380);
    const y = Math.floor((height - 480) / 2);
    mainWindow.setPosition(x, y);

    // Hide window when it loses focus
    mainWindow.on('blur', () => {
        if (!mainWindow.webContents.isDevToolsOpened()) {
            hideWindow();
        }
    });

    mainWindow.on('close', (event) => {
        if (!isQuitting) {
            event.preventDefault();
            hideWindow();
        }
    });
}

function createTray() {
    // Try to create tray icon, with fallback
    let iconPath = path.join(__dirname, 'assets', 'tray-icon.png');
    
    // Check if icon exists, create fallback if not
    const fs = require('fs');
    if (!fs.existsSync(iconPath)) {
        // Create a simple fallback icon
        iconPath = path.join(__dirname, 'assets', 'tray-icon-fallback.png');
        if (!fs.existsSync(iconPath)) {
            // If no icon exists, create a minimal one
            console.log('No tray icon found, running without system tray');
            return;
        }
    }
    
    try {
        tray = new Tray(iconPath);
    } catch (error) {
        console.log('Could not create system tray:', error.message);
        return;
    }
    
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show Clipboard',
            click: () => {
                showWindow();
            }
        },
        {
            label: 'Clear History',
            click: () => {
                store.set('clipboardHistory', []);
                if (mainWindow) {
                    mainWindow.webContents.send('history-cleared');
                }
            }
        },
        {
            type: 'separator'
        },
        {
            label: 'Start at Login',
            type: 'checkbox',
            checked: app.getLoginItemSettings().openAtLogin,
            click: (menuItem) => {
                app.setLoginItemSettings({
                    openAtLogin: menuItem.checked,
                    openAsHidden: true,
                    name: 'Mint Clipboard',
                    path: process.execPath
                });
            }
        },
        {
            type: 'separator'
        },
        {
            label: 'Quit',
            click: () => {
                isQuitting = true;
                app.quit();
            }
        }
    ]);

    tray.setContextMenu(contextMenu);
    tray.setToolTip('Mint Clipboard');
    
    tray.on('click', () => {
        showWindow();
    });
}

function getCursorPosition() {
    try {
        // Use xdotool to get mouse cursor position
        const result = execSync('xdotool getmouselocation', { encoding: 'utf8' });
        const match = result.match(/x:(\d+) y:(\d+)/);
        if (match) {
            return {
                x: parseInt(match[1]),
                y: parseInt(match[2])
            };
        }
    } catch (error) {
        console.log('Could not get cursor position, using default position');
    }
    
    // Fallback to center-right of screen
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    return {
        x: Math.floor(width - 380),
        y: Math.floor((height - 480) / 2)
    };
}

function showWindow() {
    if (mainWindow) {
        // Get cursor position and position window near cursor
        const cursorPos = getCursorPosition();
        const { width, height } = screen.getPrimaryDisplay().workAreaSize;
        
        // Calculate position near cursor but ensure window stays on screen
        let x = cursorPos.x - 180; // Center window horizontally on cursor
        let y = cursorPos.y - 100; // Position slightly above cursor
        
        // Keep window within screen bounds
        if (x < 0) x = 10;
        if (x + 360 > width) x = width - 370;
        if (y < 0) y = 10;
        if (y + 480 > height) y = height - 490;
        
        mainWindow.setPosition(x, y);
        mainWindow.show();
        mainWindow.focus();
        mainWindow.webContents.send('refresh-history');
    }
}

function hideWindow() {
    if (mainWindow) {
        mainWindow.hide();
    }
}

function monitorClipboard() {
    let lastClipboard = '';
    let lastImage = null;
    
    setInterval(() => {
        const currentClipboard = clipboard.readText();
        const currentImage = clipboard.readImage();
        
        // Check for text changes
        if (currentClipboard && currentClipboard !== lastClipboard && currentClipboard.trim().length > 0) {
            lastClipboard = currentClipboard;
            addClipboardItem({
                content: currentClipboard,
                type: 'text'
            });
        }
        
        // Check for image changes
        if (!currentImage.isEmpty()) {
            const imageDataURL = currentImage.toDataURL();
            if (imageDataURL !== lastImage) {
                lastImage = imageDataURL;
                addClipboardItem({
                    content: imageDataURL,
                    type: 'image'
                });
            }
        }
    }, 500);
}

function addClipboardItem(itemData) {
    let history = store.get('clipboardHistory', []);
    
    // Remove if already exists to move to top
    history = history.filter(item => item.content !== itemData.content);
    
    // Add new item to beginning
    history.unshift({
        id: Date.now(),
        content: itemData.content,
        timestamp: new Date().toLocaleString(),
        pinned: false,
        type: itemData.type
    });
    
    // Keep only last 50 items (excluding pinned)
    const pinned = history.filter(item => item.pinned);
    const unpinned = history.filter(item => !item.pinned).slice(0, 50);
    history = [...pinned, ...unpinned];
    
    store.set('clipboardHistory', history);
    
    // Notify renderer if window is open
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('clipboard-updated', history);
    }
}

app.whenReady().then(() => {
    createWindow();
    createTray();
    monitorClipboard();

    // Start hidden in system tray on autostart
    if (app.getLoginItemSettings().wasOpenedAtLogin) {
        console.log('Started automatically at login - running in background');
    }

    // Register global shortcut (Super+V equivalent to Win+V)
    globalShortcut.register('Super+V', () => {
        if (mainWindow.isVisible()) {
            hideWindow();
        } else {
            showWindow();
        }
    });

    // Also register Ctrl+Shift+V as alternative
    globalShortcut.register('CommandOrControl+Shift+V', () => {
        if (mainWindow.isVisible()) {
            hideWindow();
        } else {
            showWindow();
        }
    });
});

app.on('window-all-closed', (event) => {
    event.preventDefault();
});

app.on('before-quit', () => {
    isQuitting = true;
    globalShortcut.unregisterAll();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// IPC handlers
ipcMain.handle('get-clipboard-history', () => {
    return store.get('clipboardHistory', []);
});

ipcMain.handle('copy-to-clipboard', async (event, content, type = 'text') => {
    // Copy to clipboard based on type
    if (type === 'image') {
        // Convert data URL to image and copy
        const nativeImage = require('electron').nativeImage;
        const image = nativeImage.createFromDataURL(content);
        clipboard.writeImage(image);
    } else {
        clipboard.writeText(content);
    }
    
    // Hide window first
    hideWindow();
    
    // Wait a bit for window to hide and focus to return to previous app
    setTimeout(() => {
        // Simulate Ctrl+V to paste automatically for both text and images
        simulateCtrlV();
    }, 100);
});

function simulateCtrlV() {
    try {
        // Use xdotool to simulate Ctrl+V on Linux
        spawn('xdotool', ['key', 'ctrl+v'], {
            stdio: 'ignore'
        });
    } catch (error) {
        console.log('xdotool not available, trying alternative method');
        // Alternative: use ydotool if available
        try {
            spawn('ydotool', ['key', 'ctrl+v'], {
                stdio: 'ignore'
            });
        } catch (altError) {
            console.log('Auto-paste not available - install xdotool or ydotool for auto-paste functionality');
        }
    }
}

ipcMain.handle('delete-clipboard-item', (event, id) => {
    let history = store.get('clipboardHistory', []);
    history = history.filter(item => item.id !== id);
    store.set('clipboardHistory', history);
    return history;
});

ipcMain.handle('toggle-pin', (event, id) => {
    let history = store.get('clipboardHistory', []);
    const item = history.find(item => item.id === id);
    if (item) {
        item.pinned = !item.pinned;
        store.set('clipboardHistory', history);
    }
    return history;
});

ipcMain.handle('clear-all', () => {
    store.set('clipboardHistory', []);
    return [];
});

ipcMain.handle('hide-window', () => {
    hideWindow();
});
