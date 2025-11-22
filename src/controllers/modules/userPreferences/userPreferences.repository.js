// src/controllers/modules/userPreferences/userPreferences.repository.js
const { prisma } = require("../../../dataBase/prisma");

module.exports = {
  get(userId) {
    return prisma.userPreference.findUnique({
      where: { userId }
    });
  },

  async getPublic(userId) {
  const prefs = await repository.get(userId);

  if (!prefs) throw new Error("Preferences not found");

  // Campos que podem ser mostrados para outros usuários
  const publicFields = [
    "preferredGenders",
    "preferredOrientations",
    "ageMin",
    "ageMax",
    "maxDistanceKm"
  ];

  const result = {};
  for (const f of publicFields) result[f] = prefs[f];

  return result;
},

  update(userId, data) {
    return prisma.userPreference.update({
      where: { userId },
      data
    });
  }
};
