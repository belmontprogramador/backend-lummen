const { prisma } = require("../../../dataBase/prisma");

module.exports = {
  create(data) {
    return prisma.blogCategory.create({ data });
  },

  list() {
    return prisma.blogCategory.findMany({
      orderBy: { name: "asc" }
    });
  },

  findBySlug(slug) {
    return prisma.blogCategory.findUnique({
      where: { slug }
    });
  },

  update(id, data) {
    return prisma.blogCategory.update({
      where: { id },
      data
    });
  },
findById(id) {
  return prisma.blogCategory.findUnique({
    where: { id }
  });
},

  remove(id) {
    return prisma.blogCategory.delete({
      where: { id }
    });
  }
};
