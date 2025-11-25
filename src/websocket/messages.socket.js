const jwt = require("jsonwebtoken");
const messagesService = require("../controllers/modules/messages/messages.service");

module.exports = function (io) {
  io.on("connection", async (socket) => {
    console.log("🔌 WS conectado:", socket.id);

    // ===== AUTENTICAÇÃO DO WEBSOCKET =====
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        socket.disconnect();
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;

      // Cada user fica em sua sala privada
      socket.join(`user:${socket.userId}`);

    } catch (err) {
      console.log("❌ Token inválido no WS");
      socket.disconnect();
      return;
    }

    // ===== RECEBER MENSAGEM =====
    socket.on("message:send", async (data, callback) => {
      try {
        const { toUserId, text, imageUrl } = data;

        // 🔥 SALVA NO BANCO VIA SERVICE
        const msg = await messagesService.sendMessage(
          socket.userId,
          toUserId,
          text,
          imageUrl
        );

        // 🔥 ENVIA TEMPO REAL PARA AMBOS
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
