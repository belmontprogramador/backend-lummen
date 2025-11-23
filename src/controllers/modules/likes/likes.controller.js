const service = require("./likes.service");

module.exports = {
  async create(req, res) {
    try {
      const likerId = req.user.id;
      const { likedId, isSuper = false } = req.body;

      const like = await service.create(likerId, likedId, isSuper);
      res.json(like);
    } catch (err) {
      console.error("❌ Erro ao criar like:", err);
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const likerId = req.user.id;
      const { likedId } = req.params;

      await service.remove(likerId, likedId);
      res.json({ message: "Like removido com sucesso" });
    } catch (err) {
      console.error("❌ Erro ao remover like:", err);
      res.status(400).json({ error: err.message });
    }
  },

  async check(req, res) {
    try {
      const likerId = req.user.id;
      const { likedId } = req.params;

      const exists = await service.check(likerId, likedId);
      res.json({ liked: exists });
    } catch (err) {
      console.error("❌ Erro ao verificar like:", err);
      res.status(400).json({ error: err.message });
    }
  },

  async received(req, res) {
    try {
      const userId = req.user.id;
      const list = await service.received(userId);
      res.json(list);
    } catch (err) {
      console.error("❌ Erro ao buscar likes recebidos:", err);
      res.status(400).json({ error: err.message });
    }
  },
};
