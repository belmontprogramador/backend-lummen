const service = require("./messages.service");

module.exports = {
  async send(req, res) {
    try {
      const fromUserId = req.user.id;
      const { toUserId, text, imageUrl } = req.body;

      const result = await service.sendMessage(
        fromUserId,
        toUserId,
        text,
        imageUrl
      );

      res.json(result);
    } catch (err) {
      console.error("❌ Erro ao enviar mensagem:", err);
      res.status(400).json({ error: err.message });
    }
  },

  async list(req, res) {
    try {
      const userId = req.user.id;
      const { otherUserId } = req.params;

      const result = await service.listConversation(userId, otherUserId);

      res.json(result);
    } catch (err) {
      console.error("❌ Erro ao carregar mensagens:", err);
      res.status(400).json({ error: err.message });
    }
  },
};
