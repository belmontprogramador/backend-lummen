const { prisma } = require("../../../dataBase/prisma");

module.exports = {
  // =========================
  // ⭐ BUSCA USER COMPLETO
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
      },
    });
  },

  // =========================
  // ⭐ FEED BASEADO EM SCORE
  // =========================
  async list({ skip, limit, loggedUserId }) {
    const scores = await prisma.compatibilityScore.findMany({
      where: {
        userA: loggedUserId,
      },
      orderBy: { score: "desc" },
      skip,
      take: limit,
      include: {
        userBUser: {
          include: {
            profile: true,
            preference: true,
            photos: true,
          },
        },
      },
    });

    // retorna só usuários já formatados
    return scores.map((s) => ({
      score: s.score,
      ...s.userBUser,
    }));
  },

  // =========================
  // ⭐ CONTADOR DO FEED
  // =========================
  count(loggedUserId) {
    return prisma.compatibilityScore.count({
      where: { userA: loggedUserId },
    });
  },
};
