const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const path = require("path");

// 🔧 Entorno
const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const hostname = "0.0.0.0";

// 🔍 Logs clave para debug en Electron
console.log("=== SERVER START ===");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("__dirname:", __dirname);
console.log("process.cwd():", process.cwd());

// 👉 IMPORTANTE: usar cwd en vez de __dirname
const app = next({
  dev,
  dir: process.cwd()
});

const handle = app.getRequestHandler();

// CORS — permite acceso desde cualquier origen (otra PC en la red)
const cors = require("cors")({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// 🔌 Cargar handlers de sockets (ruta robusta)
let socketHandlers;
try {
  socketHandlers = require(
    path.join(process.cwd(), "src/lib/game/socketHandlers")
  ).socketHandlers;
} catch (err) {
  console.error("❌ Error cargando socketHandlers:", err);
}

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    cors(req, res, () => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("🔌 Cliente conectado:", socket.id);

    if (socketHandlers) {
      socketHandlers(io, socket);
    } else {
      console.error("⚠️ socketHandlers no disponible");
    }
  });

  httpServer.once("error", (err) => {
    console.error("❌ Server error:", err);
    process.exit(1);
  });

  httpServer.listen(port, hostname, () => {
    console.log(`🚀 Ready on http://${hostname}:${port}`);
    
    // Obtener y mostrar las IPs locales
    const os = require('os');
    const interfaces = os.networkInterfaces();
    console.log('\n🌐 Puedes conectarte desde otros dispositivos usando estas IPs:');
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          console.log(`   👉 http://${iface.address}:${port}`);
        }
      }
    }
    console.log('');
  });
}).catch((err) => {
  console.error("❌ Error en app.prepare():", err);
});