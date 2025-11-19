const { prisma } = require("../../../dataBase/prisma");

module.exports = {
  findByEmail(email) {
    return prisma.admin.findUnique({ where: { email } });
  },

  findById(id) {
    return prisma.admin.findUnique({ where: { id } });
  },

  create(data) {
    return prisma.admin.create({ data });
  },

  list({ skip, limit }) {
    return prisma.$transaction([
      prisma.admin.count(),
      prisma.admin.findMany({
        skip,
        take: limit,
        orderBy: { id: "desc" },
      })
    ]).then(([total, items]) => ({ total, items }));
  },

  update(id, data) {
    return prisma.admin.update({
      where: { id },
      data,
    });
  },

  remove(id) {
    return prisma.admin.delete({ where: { id } });
  }
};
