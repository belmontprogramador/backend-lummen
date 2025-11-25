const repo = require("./likes.repository");
const { prisma } = require("../../../dataBase/prisma");

module.exports = {
  //
  // ❤️ LIKE
  //
  async createLike(likerId, likedId, isSuper = false) {
    if (likerId === likedId)
      throw new Error("Você não pode curtir a si mesmo.");

    const dislike = await prisma.dislike.findUnique({
      where: { dislikerId_dislikedId: { dislikerId: likerId, dislikedId: likedId } }
    });
    if (dislike) throw new Error("Você já deu dislike neste usuário.");

    const skip = await prisma.skip.findUnique({
      where: { skipperId_skippedId: { skipperId: likerId, skippedId: likedId } }
    });
    if (skip) throw new Error("Você já deu skip neste usuário.");

    const like = await repo.upsertLike(likerId, likedId, isSuper);

    const reverseLike = await prisma.like.findUnique({
      where: {
        likerId_likedId: {
          likerId: likedId,
          likedId: likerId
        }
      }
    });

    const matched = !!reverseLike;

    return {
      like,
      matched,
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

  // ⭐️ LIKES ENVIADOS
  async sentLikes(userId) {
    return repo.getSentLikes(userId);
  },

  //
  // 💔 DISLIKE
  //
  async createDislike(dislikerId, dislikedId) {
    if (dislikerId === dislikedId)
      throw new Error("Você não pode dar dislike em si mesmo.");

    const like = await prisma.like.findUnique({
      where: { likerId_likedId: { likerId: dislikerId, likedId: dislikedId } }
    });
    if (like) throw new Error("Você já curtiu este usuário.");

    return prisma.dislike.upsert({
      where: { dislikerId_dislikedId: { dislikerId, dislikedId } },
      create: { dislikerId, dislikedId },
      update: {},
    });
  },

  async sentLikes(userId) {
  return repo.getSentLikes(userId);
},

async receivedLikes(userId) {
  return repo.getReceivedLikes(userId);
},

async listMatches(userId) {
    return repo.listMatches(userId);
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

    const like = await prisma.like.findUnique({
      where: { likerId_likedId: { likerId: skipperId, likedId: skippedId } }
    });
    if (like) throw new Error("Você já curtiu este usuário.");

    const dislike = await prisma.dislike.findUnique({
      where: { dislikerId_dislikedId: { dislikerId: skipperId, dislikedId: skippedId } }
    });
    if (dislike) throw new Error("Você já deu dislike neste usuário.");

    return prisma.skip.upsert({
      where: { skipperId_skippedId: { skipperId, skippedId } },
      create: { skipperId, skippedId },
      update: {},
    });
  },
};
