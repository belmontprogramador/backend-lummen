const service = require("./likes.service");

module.exports = {
  //
  // ❤️ CREATE LIKE
  //
  async create(req, res) {
    try {
      const likerId = req.user.id;
      const { likedId, isSuper = false } = req.body;

      if (!likedId) {
        return res.status(400).json({ error: "likedId é obrigatório." });
      }

      const result = await service.createLike(likerId, likedId, isSuper);

      return res.json({
        success: true,
        message: "Like enviado para processamento.",
        ...result,
      });

    } catch (err) {
      console.error("❌ Erro ao criar like:", err);
      return res.status(400).json({ error: err.message });
    }
  },

  //
  // ❤️ REMOVE LIKE
  //
  async remove(req, res) {
    try {
      const likerId = req.user.id;
      const { likedId } = req.params;

      await service.removeLike(likerId, likedId);

      return res.json({
        success: true,
        message: "Like removido com sucesso",
      });

    } catch (err) {
      console.error("❌ Erro ao remover like:", err);
      return res.status(400).json({ error: err.message });
    }
  },

  //
  // ❤️ CHECK LIKE
  //
  async check(req, res) {
    try {
      const likerId = req.user.id;
      const { likedId } = req.params;

      const exists = await service.checkLike(likerId, likedId);

      return res.json({
        liked: exists,
      });

    } catch (err) {
      console.error("❌ Erro ao verificar like:", err);
      return res.status(400).json({ error: err.message });
    }
  },

  //
  // 📩 RECEIVED LIKES
  //
  async received(req, res) {
    try {
      const userId = req.user.id;
      const list = await service.receivedLikes(userId);

      return res.json(list);

    } catch (err) {
      console.error("❌ Erro ao buscar likes recebidos:", err);
      return res.status(400).json({ error: err.message });
    }
  },

  //
  // 📤 SENT LIKES
  //
  async sent(req, res) {
    try {
      const userId = req.user.id;
      const list = await service.sentLikes(userId);

      return res.json(list);

    } catch (err) {
      console.error("❌ Erro ao buscar likes enviados:", err);
      return res.status(400).json({ error: err.message });
    }
  },

  //
  // 💘 MATCHES
  //
  async matches(req, res) {
    try {
      const userId = req.user.id;
      const result = await service.listMatches(userId);

      return res.json(result);

    } catch (err) {
      console.error("❌ Erro ao buscar matches:", err);
      return res.status(400).json({ error: err.message });
    }
  },

  //
  // 📦 ALL (sent + received)
  //
  async all(req, res) {
    try {
      const userId = req.user.id;

      const sent = await service.sentLikes(userId);
      const received = await service.receivedLikes(userId);

      return res.json({ sent, received });

    } catch (err) {
      console.error("❌ Erro ao buscar likes (all):", err);
      return res.status(400).json({ error: err.message });
    }
  },

  //
  // 💔 DISLIKE
  //
  async createDislike(req, res) {
    try {
      const dislikerId = req.user.id;
      const { dislikedId } = req.body;

      if (!dislikedId) {
        return res.status(400).json({ error: "dislikedId é obrigatório." });
      }

      const result = await service.createDislike(dislikerId, dislikedId);

      return res.json({
        success: true,
        message: "Dislike enviado para processamento.",
        ...result,
      });

    } catch (err) {
      console.error("❌ Erro ao criar dislike:", err);
      return res.status(400).json({ error: err.message });
    }
  },

  async removeDislike(req, res) {
    try {
      const dislikerId = req.user.id;
      const { dislikedId } = req.params;

      await service.removeDislike(dislikerId, dislikedId);

      return res.json({
        success: true,
        message: "Dislike removido",
      });

    } catch (err) {
      console.error("❌ Erro ao remover dislike:", err);
      return res.status(400).json({ error: err.message });
    }
  },

  //
  // ⏭ SKIP
  //
  async createSkip(req, res) {
    try {
      const skipperId = req.user.id;
      const { skippedId } = req.body;

      if (!skippedId) {
        return res.status(400).json({ error: "skippedId é obrigatório." });
      }

      const result = await service.createSkip(skipperId, skippedId);

      return res.json({
        success: true,
        message: "Skip enviado para processamento.",
        ...result,
      });

    } catch (err) {
      console.error("❌ Erro ao criar skip:", err);
      return res.status(400).json({ error: err.message });
    }
  },
};
