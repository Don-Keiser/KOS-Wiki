const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');

// Function to start the Node.js server
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

// Create the main window
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        icon: path.join(__dirname, 'images/logo.png')
    });

    // Load the web app (assuming it's running on http://localhost:3000)
    win.loadURL('http://localhost:3000');
}

// Electron will call this function when the app is initialized
app.whenReady().then(() => {
    startServer();
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});