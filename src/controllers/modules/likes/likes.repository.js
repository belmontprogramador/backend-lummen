const { prisma } = require("../../../dataBase/prisma");

module.exports = {
  //
  // ❤️ LIKE
  //
  async upsertLike(likerId, likedId, isSuper = false) {
    return prisma.like.upsert({
      where: { likerId_likedId: { likerId, likedId } },
      create: { likerId, likedId, isSuper },
      update: { isSuper },
    });
  },

  async deleteLike(likerId, likedId) {
    return prisma.like
      .delete({
        where: { likerId_likedId: { likerId, likedId } },
      })
      .catch(() => null);
  },

  async existsLike(likerId, likedId) {
    const like = await prisma.like.findUnique({
      where: { likerId_likedId: { likerId, likedId } },
    });
    return !!like;
  },

  async getReceivedLikes(userId) {
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

  // ⭐️ NOVO – BUSCAR LIKES QUE O USUÁRIO ENVIOU
  async getSentLikes(userId) {
    return prisma.like.findMany({
      where: { likerId: userId },
      include: {
        liked: {
          include: {
            profile: true,
            photos: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  //
  // 💔 DISLIKE
  //
  async upsertDislike(dislikerId, dislikedId) {
    return prisma.dislike.upsert({
      where: { dislikerId_dislikedId: { dislikerId, dislikedId } },
      create: { dislikerId, dislikedId },
      update: {},
    });
  },

  async getSentLikes(userId) {
  return prisma.like.findMany({
    where: { likerId: userId },
    include: {
      liked: {
        include: {
          profile: true,
          photos: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
},

async getReceivedLikes(userId) {
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
    orderBy: { createdAt: 'desc' },
  });
},

  async deleteDislike(dislikerId, dislikedId) {
    return prisma.dislike
      .delete({
        where: { dislikerId_dislikedId: { dislikerId, dislikedId } },
      })
      .catch(() => null);
  },

  async existsDislike(dislikerId, dislikedId) {
    const dislike = await prisma.dislike.findUnique({
      where: { dislikerId_dislikedId: { dislikerId, dislikedId } },
    });
    return !!dislike;
  },

  //
  // ⏭ SKIP
  //
  async upsertSkip(skipperId, skippedId) {
    return prisma.skip.upsert({
      where: { skipperId_skippedId: { skipperId, skippedId } },
      create: { skipperId, skippedId },
      update: {},
    });
  },

async listMatches(userId) {
  const likes = await prisma.like.findMany({
    where: {
      OR: [
        { likerId: userId },
        { likedId: userId }
      ]
    },
    include: {
      liker: {
        include: {
          profile: true,
          photos: true,
        },
      },
      liked: {
        include: {
          profile: true,
          photos: true,
        },
      },
    },
  });

  // --- ENCONTRAR MATCHES (like mútuo)
  const matches = [];
  const processed = new Set();

  for (const like of likes) {
    // pares invertidos
    const pairKey = `${like.likerId}-${like.likedId}`;
    const reverseKey = `${like.likedId}-${like.likerId}`;

    // evita duplicar
    if (processed.has(pairKey) || processed.has(reverseKey)) continue;

    const reverse = likes.find(
      (l) => l.likerId === like.likedId && l.likedId === like.likerId
    );

    if (reverse) {
      processed.add(pairKey);
      processed.add(reverseKey);

      const otherUser = like.likerId === userId ? like.liked : like.liker;

      matches.push({
        id: otherUser.id,
        name: otherUser.name,
        profile: otherUser.profile,
        photos: otherUser.photos,
        photo: otherUser.photo || otherUser.photos?.[0]?.src || null

      });
    }
  }

  return matches;
},

  async existsSkip(skipperId, skippedId) {
    const skip = await prisma.skip.findUnique({
      where: { skipperId_skippedId: { skipperId, skippedId } },
    });
    return !!skip;
  },
  
};
