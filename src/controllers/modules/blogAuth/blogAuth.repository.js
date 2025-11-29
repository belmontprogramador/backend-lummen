const { prisma } = require("../../../dataBase/prisma");

module.exports = {
  findByEmail(email) {
    return prisma.blogAuthor.findUnique({ where: { email } });
  },

  findById(id) {
    return prisma.blogAuthor.findUnique({ where: { id } });
  },

  create(data) {
    return prisma.blogAuthor.create({ data });
  },

  async list(skip, take) {
    const [total, items] = await Promise.all([
      prisma.blogAuthor.count(),
      prisma.blogAuthor.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return { total, items };
  },

  update(id, data) {
    return prisma.blogAuthor.update({
      where: { id },
      data,
    });
  },

  remove(id) {
    return prisma.blogAuthor.update({
      where: { id },
      data: { active: false },
    });
  },
};
