// src/modules/passwordReset/passwordReset.repository.js
const { prisma } = require("../../../dataBase/prisma");

module.exports = {
  findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true }
    });
  },

  updatePassword(id, newHash) {
    return prisma.user.update({
      where: { id },
      data: { password: newHash }
    });
  }
};
