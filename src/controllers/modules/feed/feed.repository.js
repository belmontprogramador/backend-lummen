const { prisma } = require("../../../dataBase/prisma");

module.exports = {
  getById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,        // perfil unificado
        preference: true,
        photos: true,
        credits: true,
        boosts: true,
        likesSent: true,
        likesReceived: true,
      },
    });
  },

  list({ skip, limit, where, loggedUserId }) {
    return prisma.user.findMany({
      skip,
      take: limit,
      where: {
        ...where,
        id: { not: loggedUserId },
      },
      orderBy: { createdAt: "desc" },
      include: {
        profile: true,
        preference: true,
        photos: true,
      },
    });
  },

  count(where) {
    return prisma.user.count({ where });
  },
};
