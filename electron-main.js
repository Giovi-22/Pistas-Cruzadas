const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    // We want it resizable but fullscreen-able as requested
    minWidth: 800,
    minHeight: 600,
    title: "Pistas Cruzadas",
    autoHideMenuBar: true,
  });

  // Load the local Next.js server
  mainWindow.loadURL('http://localhost:3000');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

function startServer() {
  // Start the Next.js server as a background process
  const serverPath = path.join(__dirname, 'server.js');
  
  serverProcess = fork(serverPath, [], {
    env: { ...process.env, NODE_ENV: 'production', PORT: 3000 }
  });

  serverProcess.on('message', (msg) => {
    console.log('Server message:', msg);
  });

  serverProcess.on('error', (err) => {
    console.error('Server error:', err);
  });
}

app.on('ready', () => {
  // 1. Start the server
  startServer();

  // 2. Wait a bit for the server to be ready before showing the window
  // (In a more robust setup we would ping the port, but wait-on handles this in dev)
  setTimeout(createWindow, 3000); 
});

app.on('window-all-closed', function () {
  // Kill the server process when closing the app
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
