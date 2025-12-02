const { prisma } = require("../../../dataBase/prisma");

module.exports = {
  async upsertProfile(userId, data) {
    // REMOVE CAMPOS QUE NÃO EXISTEM NO MODEL
    const {
      age,        // ❌ campo virtual
      createdAt, // ❌ gerenciado pelo Prisma
      updatedAt, // ❌ gerenciado pelo Prisma
      user,      // ❌ relation
      ...safeData
    } = data;

    return prisma.userProfile.upsert({
      where: { userId },

      create: {
        userId,
        ...safeData,
      },

      update: {
        ...safeData,
      },
    });
  },

  async getProfile(userId) {
    return prisma.userProfile.findUnique({
      where: { userId },
    });
  },

  async deleteProfile(userId) {
    return prisma.userProfile.delete({ where: { userId } }).catch(() => {});
  },
};
