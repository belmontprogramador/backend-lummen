const repo = require("./likes.repository");
const { prisma } = require("../../../dataBase/prisma");

// FILAS
const likeQueue = require("../../../queues/like.queue");
const dislikeQueue = require("../../../queues/dislike.queue");
const skipQueue = require("../../../queues/skip.queue");
const matchQueue = require("../../../queues/match.queue");

module.exports = {
  //
  // ❤️ LIKE
  //
  async createLike(likerId, likedId, isSuper = false) {
    if (likerId === likedId)
      throw new Error("Você não pode curtir a si mesmo.");

    // ----------------------------------------------------
    // 🔥 1 — REGRA DO PLANO FREE (10 likes / 24h)
    // ----------------------------------------------------
    const user = await prisma.user.findUnique({
      where: { id: likerId },
      select: { plan: true }
    });

    const isFree = !user.plan || user.plan.name.toLowerCase() === "free";

    console.log("📌 [LIKE LIMIT CHECK]");
    console.log("User:", likerId);
    console.log("Plano:", isFree ? "FREE" : "PAGO");

    if (isFree) {
      const totalLikes24h = await prisma.like.count({
        where: {
          likerId,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      });

      if (totalLikes24h >= 1) {
        throw new Error("Você atingiu o limite de 10 likes nas últimas 24 horas.");
      }
    }

    // ----------------------------------------------------
    // 2 — Verificar se já foi dislike
    // ----------------------------------------------------
    const dislike = await prisma.dislike.findUnique({
      where: {
        dislikerId_dislikedId: { dislikerId: likerId, dislikedId: likedId }
      }
    });

    if (dislike)
      throw new Error("Você já deu dislike neste usuário.");

    // ----------------------------------------------------
    // 3 — Verificar se já foi skip
    // ----------------------------------------------------
    const skip = await prisma.skip.findUnique({
      where: {
        skipperId_skippedId: { skipperId: likerId, skippedId: likedId }
      }
    });

    if (skip)
      throw new Error("Você já deu skip neste usuário.");

    // ----------------------------------------------------
    // 🔥 4 — Enviar LIKE para a fila
    // ----------------------------------------------------
    await likeQueue.add("process-like", {
      likerId,
      likedId,
      isSuper,
    });

    console.log("📨 LIKE ENVIADO PARA FILA:", likerId, likedId);

    // ----------------------------------------------------
    // ⭐ 5 — Detectar MATCH imediatamente
    // ----------------------------------------------------
    const reverseLike = await prisma.like.findUnique({
      where: {
        likerId_likedId: {
          likerId: likedId,
          likedId: likerId
        }
      }
    });

    const matched = !!reverseLike;

    if (matched) {
      await matchQueue.add("process-match", {
        user1: likerId,
        user2: likedId,
      });

      console.log("💘 MATCH DETECTADO → ENVIADO PARA FILA MATCH");
    }

    return {
      like: { likerId, likedId, isSuper },
      matched
    };
  },

  async removeLike(likerId, likedId) {
    return repo.deleteLike(likerId, likedId);
  },

  async checkLike(likerId, likedId) {
    return repo.existsLike(likerId, likedId);
  },

  async receivedLikes(userId) {
    return repo.getReceivedLikes(userId);
  },

  async sentLikes(userId) {
    return repo.getSentLikes(userId);
  },

  //
  // 💔 DISLIKE
  //
  async createDislike(dislikerId, dislikedId) {
    if (dislikerId === dislikedId)
      throw new Error("Você não pode dar dislike em si mesmo.");

    await dislikeQueue.add("process-dislike", {
      dislikerId,
      dislikedId,
    });

    console.log("📨 DISLIKE ENVIADO PARA FILA:", dislikerId, dislikedId);

    return { dislikerId, dislikedId };
  },

  async removeDislike(dislikerId, dislikedId) {
    return prisma.dislike
      .delete({
        where: {
          dislikerId_dislikedId: { dislikerId, dislikedId }
        }
      })
      .catch(() => null);
  },

  //
  // ⏭ SKIP
  //
  async createSkip(skipperId, skippedId) {
    if (skipperId === skippedId)
      throw new Error("Você não pode dar skip em si mesmo.");

    await skipQueue.add("process-skip", {
      skipperId,
      skippedId,
    });

    console.log("📨 SKIP ENVIADO PARA FILA:", skipperId, skippedId);

    return { skipperId, skippedId };
  },

  async listMatches(userId) {
    return repo.listMatches(userId);
  },
};
