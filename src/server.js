const http = require("http");
const app = require("./app");
const cron = require("node-cron");
require("./utils/redis");
require("./queueWorkers");
require("./queueWorkers/compatibility.worker");
require("./queueWorkers/like.worker");
require("./queueWorkers/dislike.worker");
require("./queueWorkers/skip.worker");
require("./queueWorkers/match.worker");


 



const checkExpiredPayments = require("./jobs/checkExpiredPayments");

const { Server } = require("socket.io");

// Cria servidor HTTP
const server = http.createServer(app);

// WebSocket (Socket.IO)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization", "x-api-key"],
    credentials: true
  }
});


// Inicializa módulo de mensagens
require("./websocket/messages.socket")(io);

const PORT = process.env.PORT || 3002;

// Cron diário 03:00
cron.schedule("0 3 * * *", async () => {
  console.log("⏰ Iniciando verificação de pagamentos expirados...");
  await checkExpiredPayments();
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
