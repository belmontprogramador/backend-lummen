// src/modules/userProfiles/userProfiles.repository.js

const { prisma } = require("../../../dataBase/prisma");

module.exports = {
  async upsertProfile(userId, data) {
    return prisma.userProfile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  },

  async getProfile(userId) {
    return prisma.userProfile.findUnique({
      where: { userId },
    });
  },

  async deleteProfile(userId) {
    // se não existir, ignora erro
    return prisma.userProfile.delete({ where: { userId } }).catch(() => {});
  },
};
