const { prisma } = require("../../../dataBase/prisma");

module.exports = {
  list(userId) {
    return prisma.userPhoto.findMany({
      where: { userId },
      orderBy: { position: "asc" }
    });
  },

  getLastPosition(userId) {
    return prisma.userPhoto.findFirst({
      where: { userId },
      orderBy: { position: "desc" }
    });
  },

  create(userId, url, position) {
    return prisma.userPhoto.create({
      data: { userId, url, position }
    });
  },

  findByPosition(userId, position) {
    return prisma.userPhoto.findFirst({
      where: { userId, position }
    });
  },

  updateUrl(id, url) {
    return prisma.userPhoto.update({
      where: { id },
      data: { url }
    });
  },

  updatePositionAndUrl(id, url, position) {
  return prisma.userPhoto.update({
    where: { id },
    data: {
      url: url || undefined,
      position
    }
  });
},

  remove(id) {
    return prisma.userPhoto.delete({ where: { id } });
  }
};
