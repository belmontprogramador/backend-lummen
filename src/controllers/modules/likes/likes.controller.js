const service = require("./likes.service");

module.exports = {
  //
  // ❤️ LIKE
  //
  async create(req, res) {
    try {
      const likerId = req.user.id;
      const { likedId, isSuper = false } = req.body;

      const result = await service.createLike(likerId, likedId, isSuper);
      res.json(result);
    } catch (err) {
      console.error("❌ Erro ao criar like:", err);
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const likerId = req.user.id;
      const { likedId } = req.params;

      await service.removeLike(likerId, likedId);
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

      const exists = await service.checkLike(likerId, likedId);
      res.json({ liked: exists });
    } catch (err) {
      console.error("❌ Erro ao verificar like:", err);
      res.status(400).json({ error: err.message });
    }
  },

  async received(req, res) {
    try {
      const userId = req.user.id;
      const list = await service.receivedLikes(userId);
      res.json(list);
    } catch (err) {
      console.error("❌ Erro ao buscar likes recebidos:", err);
      res.status(400).json({ error: err.message });
    }
  },

  // ⭐️ LIKES ENVIADOS
  async sent(req, res) {
    try {
      const userId = req.user.id;
      const list = await service.sentLikes(userId);
      res.json(list);
    } catch (err) {
      console.error("❌ Erro ao buscar likes enviados:", err);
      res.status(400).json({ error: err.message });
    }
  },

  //
  // 💔 DISLIKE
  //
  async createDislike(req, res) {
    try {
      const dislikerId = req.user.id;
      const { dislikedId } = req.body;

      const result = await service.createDislike(dislikerId, dislikedId);
      res.json(result);
    } catch (err) {
      console.error("❌ Erro ao criar dislike:", err);
      res.status(400).json({ error: err.message });
    }
  },

async matches(req, res) {
  try {
    const userId = req.user.id;
    const result = await service.listMatches(userId); // <- AQUI ESTAVA ERRADO
    res.json(result);
  } catch (err) {
    console.error("❌ Erro ao buscar matches:", err);
    res.status(400).json({ error: err.message });
  }
},


  async all(req, res) {
  try {
    const userId = req.user.id;

    const sent = await service.sentLikes(userId);
    const received = await service.receivedLikes(userId);

    return res.json({
      sent,
      received,
    });

  } catch (err) {
    console.error("❌ Erro ao buscar likes (all):", err);
    return res.status(400).json({ error: err.message });
  }
},

  async removeDislike(req, res) {
    try {
      const dislikerId = req.user.id;
      const { dislikedId } = req.params;

      await service.removeDislike(dislikerId, dislikedId);
      res.json({ message: "Dislike removido" });
    } catch (err) {
      console.error("❌ Erro ao remover dislike:", err);
      res.status(400).json({ error: err.message });
    }
  },

  //
  // ⏭ SKIP
  //
  async createSkip(req, res) {
    try {
      const skipperId = req.user.id;
      const { skippedId } = req.body;

      const result = await service.createSkip(skipperId, skippedId);
      res.json(result);
    } catch (err) {
      console.error("❌ Erro ao criar skip:", err);
      res.status(400).json({ error: err.message });
    }
  },
};
