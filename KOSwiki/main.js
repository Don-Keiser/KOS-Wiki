const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function startServer() {
    exec('node server.js', (err, stdout, stderr) => {
        if (err) {
            console.error(`Error starting server: ${err}`);
            return;
        }
        console.log(`Server started: ${stdout}`);
        if (stderr) console.error(`Server stderr: ${stderr}`);
    });
}

function createWindow() {
    const { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize;

    const win = new BrowserWindow({
        width: Math.floor(width * 0.8),
        height: Math.floor(height * 0.8),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        icon: path.join(__dirname, 'images/logo.png')
    });

    // Load the initial URL
    win.loadURL('http://localhost:3000');

    // Intercept link clicks and prevent opening new windows
    win.webContents.on('new-window', (event, url) => {
        event.preventDefault();
        win.loadURL(url); // Load the clicked link in the same window
    });

    // Handle links with target="_blank" or other navigation events
    win.webContents.setWindowOpenHandler(({ url }) => {
        win.loadURL(url); // Load the URL in the current window
        return { action: 'deny' }; // Prevent default action (opening a new window)
    });
}

app.whenReady().then(() => {
    startServer();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
