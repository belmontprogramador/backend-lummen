const { prisma } = require("../../../dataBase/prisma");

module.exports = {
  // =========================
  // ✅ BUSCA USUÁRIO POR ID
  // =========================
  getById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        preference: true,
        photos: true,
        credits: true,
        boosts: true,
        likesSent: true,
        likesReceived: true,
        dislikesSent: true,
        dislikesReceived: true,
        skipsSent: true,
        skipsReceived: true,
      },
    });
  },

  // =========================
  // ✅ LISTA DO FEED (SEM QUALQUER REPETIÇÃO)
  // =========================
  list({ skip, limit, where, loggedUserId }) {
    return prisma.user.findMany({
      skip,
      take: limit,

      where: {
        ...where,

        // ❌ nunca retorna você mesmo
        id: { not: loggedUserId },

        AND: [
          // ❌ você JÁ deu like nessa pessoa
          {
            likesReceived: {
              none: {
                likerId: loggedUserId,
              },
            },
          },

         

          // ❌ você JÁ deu dislike nessa pessoa
          {
            dislikesReceived: {
              none: {
                dislikerId: loggedUserId,
              },
            },
          },

          // ❌ essa pessoa JÁ te deu dislike
          {
            dislikesSent: {
              none: {
                dislikedId: loggedUserId,
              },
            },
          },

          // ❌ você JÁ deu skip nessa pessoa
          {
            skipsReceived: {
              none: {
                skipperId: loggedUserId,
              },
            },
          },

          // ❌ essa pessoa JÁ te deu skip
          {
            skipsSent: {
              none: {
                skippedId: loggedUserId,
              },
            },
          },
        ],
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        profile: true,
        preference: true,
        photos: true,
      },
    });
  },

  // =========================
  // ✅ CONTADOR DO FEED
  // =========================
  count(where) {
    return prisma.user.count({ where });
  },
};
