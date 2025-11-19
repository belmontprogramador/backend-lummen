// src/controllers/modules/userPreferences/userPreferences.repository.js
const { prisma } = require("../../../dataBase/prisma");

module.exports = {
  get(userId) {
    return prisma.userPreference.findUnique({
      where: { userId }
    });
  },

  update(userId, data) {
    return prisma.userPreference.update({
      where: { userId },
      data
    });
  }
};
