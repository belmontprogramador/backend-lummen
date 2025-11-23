const { prisma } = require("../../../dataBase/prisma");

module.exports = {
  async upsertLike(likerId, likedId, isSuper = false) {
    return prisma.like.upsert({
      where: { likerId_likedId: { likerId, likedId } },
      create: { likerId, likedId, isSuper },
      update: { isSuper },
    });
  },

  async deleteLike(likerId, likedId) {
    return prisma.like.delete({
      where: { likerId_likedId: { likerId, likedId } },
    }).catch(() => null);
  },

  async exists(likerId, likedId) {
    const like = await prisma.like.findUnique({
      where: { likerId_likedId: { likerId, likedId } },
    });
    return !!like;
  },

  async getReceived(userId) {
    return prisma.like.findMany({
      where: { likedId: userId },
      include: {
        liker: {
          include: {
            profile: true,
            photos: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },
};
