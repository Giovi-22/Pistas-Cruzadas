const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');
const fs = require('fs');

let mainWindow;
let serverProcess;

// Configurar log en archivo
const logPath = path.join(app.getPath('userData'), 'pistas-log.txt');
function logToFile(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  console.log(line.trim());
  try {
    fs.appendFileSync(logPath, line);
  } catch (e) {
    console.error("No se pudo escribir en el log:", e);
  }
}

logToFile('=== INICIANDO PISTAS CRUZADAS ===');
logToFile(`Modo empaquetado: ${app.isPackaged}`);

function createWindow() {
  logToFile('Creando ventana principal...');
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    minWidth: 800,
    minHeight: 600,
    title: "Pistas Cruzadas",
    autoHideMenuBar: true,
  });

  const loadWithRetry = () => {
    if (!mainWindow) return;
    logToFile('Intentando cargar http://localhost:3000...');
    mainWindow.loadURL('http://localhost:3000').then(() => {
      logToFile('URL cargada con éxito.');
    }).catch((err) => {
      logToFile(`Error cargando localhost:3000: ${err.message}. Reintentando en 2s...`);
      setTimeout(loadWithRetry, 2000);
    });
  };

  loadWithRetry();

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

function startServer() {
  const serverPath = path.join(__dirname, 'server.js');
  logToFile(`Iniciando servidor desde: ${serverPath}`);

  serverProcess = fork(serverPath, [], {
    env: { ...process.env, NODE_ENV: 'production', PORT: '3000' },
    stdio: 'pipe'
  });

  serverProcess.stdout.on('data', (data) => {
    logToFile(`[SERVER STDOUT] ${data.toString().trim()}`);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.executeJavaScript(`console.log("SERVER LOG:", \`${data.toString().replace(/`/g, '\\`').trim()}\`)`).catch(() => Object);
    }
  });

  serverProcess.stderr.on('data', (data) => {
    logToFile(`[SERVER STDERR] ${data.toString().trim()}`);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.executeJavaScript(`console.error("SERVER ERROR:", \`${data.toString().replace(/`/g, '\\`').trim()}\`)`).catch(() => Object);
    }
  });

  serverProcess.on('error', (err) => {
    logToFile(`[SERVER CRASH] ${err.message}`);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.executeJavaScript(`console.error("SERVER CRASH:", \`${err.message.replace(/`/g, '\\`')}\`)`).catch(() => Object);
    }
  });
  
  serverProcess.on('exit', (code) => {
    logToFile(`[SERVER EXIT] Proceso terminado con código ${code}`);
  });
}

const waitForServer = async () => {
  const http = require('http');
  logToFile('Esperando a que el servidor responda en localhost:3000...');

  return new Promise((resolve) => {
    const check = () => {
      http.get('http://localhost:3000', (res) => {
        logToFile(`Servidor respondió con status: ${res.statusCode}`);
        resolve();
      }).on('error', (err) => {
        // logToFile(`Esperando servidor... (${err.message})`);
        setTimeout(check, 500);
      });
    };
    check();
  });
};

app.on('ready', async () => {
  logToFile('App ready event emitido.');
  if (app.isPackaged) {
    logToFile('Aplicación en modo empaquetado. Iniciando servidor local...');
    startServer();
    await waitForServer();
    logToFile('Servidor local listo. Creando ventana...');
    createWindow();
  } else {
    logToFile('Aplicación en modo desarrollo. Creando ventana directamente...');
    createWindow();
  }
});

app.on('window-all-closed', function () {
  logToFile('Todas las ventanas cerradas.');
  if (serverProcess) {
    logToFile('Matando proceso del servidor...');
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
