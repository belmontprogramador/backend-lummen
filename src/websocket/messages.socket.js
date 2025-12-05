const jwt = require("jsonwebtoken");
const messagesService = require("../controllers/modules/messages/messages.service");

module.exports = function (io) {
  io.on("connection", async (socket) => {
    console.log("🔌 WS conectado:", socket.id);

    // ============================================================
    // 1) MOSTRAR O QUE O FRONT ESTÁ ENVIANDO
    // ============================================================
     
    // ============================================================
    // 2) MOSTRAR O QUE O BACKEND TEM EM process.env.API_KEY
    // ============================================================
    console.log("🟦 process.env.API_KEY =", process.env.API_KEY);
    console.log("🟦 LENGTH DA API_KEY =", process.env.API_KEY?.length);

    // ===== VALIDAR API KEY =====
    try {
      const apiKey = socket.handshake.auth?.apiKey;

      console.log("🟨 apiKey RECEBIDA =", apiKey);
      console.log("🟨 LENGTH da recebida =", apiKey?.length);

      if (apiKey !== process.env.API_TOKENS) {
        console.log("❌ API KEY inválida no WS");
        socket.disconnect();
        return;
      }
    } catch (err) {
      console.log("🔴 ERRO NO TRY DE API KEY:", err);
      socket.disconnect();
      return;
    }

    // ===== AUTENTICAÇÃO DO WEBSOCKET =====
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        console.log("❌ Nenhum token recebido");
        socket.disconnect();
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;

      socket.join(`user:${socket.userId}`);
      console.log("🟩 Usuário autenticado no WS:", socket.userId);

    } catch (err) {
      console.log("❌ Token inválido no WS:", err);
      socket.disconnect();
      return;
    }

    // ===== RECEBER MENSAGEM =====
    socket.on("message:send", async (data, callback) => {
      console.log("📨 [WS] Recebido message:send:", data);

      try {
        const { toUserId, text, imageUrl } = data;

        const msg = await messagesService.sendMessage(
          socket.userId,
          toUserId,
          text,
          imageUrl
        );

        console.log("📨 [WS] Mensagem salva e emitida:", msg);

        io.to(`user:${socket.userId}`).emit("message:new", msg);
        io.to(`user:${toUserId}`).emit("message:new", msg);

        if (callback) callback({ ok: true, message: msg });

      } catch (err) {
        console.log("❌ Erro ao enviar WS:", err);
        if (callback) callback({ ok: false, error: err.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("🔌 Desconectou:", socket.userId);
    });
  });
};
