const repo = require("./likes.repository");
const { prisma } = require("../../../dataBase/prisma");

module.exports = {
  //
  // ❤️ LIKE
  //
  async createLike(likerId, likedId, isSuper = false) {
  if (likerId === likedId)
    throw new Error("Você não pode curtir a si mesmo.");

  // 🔥 Bloqueia se houver DISLIKE
  const dislike = await prisma.dislike.findUnique({
    where: { dislikerId_dislikedId: { dislikerId: likerId, dislikedId: likedId } }
  });
  if (dislike) throw new Error("Você já deu dislike neste usuário.");

  // 🔥 Bloqueia se houver SKIP
  const skip = await prisma.skip.findUnique({
    where: { skipperId_skippedId: { skipperId: likerId, skippedId: likedId } }
  });
  if (skip) throw new Error("Você já deu skip neste usuário.");

  // 🔥 Cria / atualiza like
  const like = await repo.upsertLike(likerId, likedId, isSuper);

  // 🔥 MATCH: verificar se o outro já deu like
 const reverseLike = await prisma.like.findUnique({
  where: {
    likerId_likedId: {
      likerId: likedId,   // agora o outro é o autor
      likedId: likerId    // você é o alvo
    }
  }
});


  const matched = !!reverseLike;

  return {
    like,
    matched, // 🔥 FRONT VAI USAR PARA ABRIR O MODAL
  };
},

  async removeLike(likerId, likedId) {
    return repo.deleteLike(likerId, likedId);
  },

  async checkLike(likerId, likedId) {
    return repo.exists(likerId, likedId);
  },

  async receivedLikes(userId) {
    return repo.getReceived(userId);
  },

  //
  // 💔 DISLIKE
  //
  async createDislike(dislikerId, dislikedId) {
    if (dislikerId === dislikedId)
      throw new Error("Você não pode dar dislike em si mesmo.");

    // 🔥 Bloqueia se houver LIKE
    const like = await prisma.like.findUnique({
      where: { likerId_likedId: { likerId: dislikerId, likedId: dislikedId } }
    });
    if (like) throw new Error("Você já curtiu este usuário.");

    // 🔥 Cria / atualiza dislike
    return prisma.dislike.upsert({
      where: { dislikerId_dislikedId: { dislikerId, dislikedId } },
      create: { dislikerId, dislikedId },
      update: {},
    });
  },

  async removeDislike(dislikerId, dislikedId) {
    return prisma.dislike.delete({
      where: { dislikerId_dislikedId: { dislikerId, dislikedId } },
    }).catch(() => null);
  },

  //
  // ⏭ SKIP
  //
  async createSkip(skipperId, skippedId) {
    if (skipperId === skippedId)
      throw new Error("Você não pode dar skip em si mesmo.");

    // 🔥 Bloqueia se houver LIKE
    const like = await prisma.like.findUnique({
      where: { likerId_likedId: { likerId: skipperId, likedId: skippedId } }
    });
    if (like) throw new Error("Você já curtiu este usuário.");

    // 🔥 Bloqueia se houver DISLIKE
    const dislike = await prisma.dislike.findUnique({
      where: { dislikerId_dislikedId: { dislikerId: skipperId, dislikedId: skippedId } }
    });
    if (dislike) throw new Error("Você já deu dislike neste usuário.");

    // 🔥 Cria / atualiza skip
    return prisma.skip.upsert({
      where: { skipperId_skippedId: { skipperId, skippedId } },
      create: { skipperId, skippedId },
      update: {},
    });
  },
};
