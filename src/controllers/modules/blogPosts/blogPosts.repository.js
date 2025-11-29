const { prisma } = require("../../../dataBase/prisma");

module.exports = {
  create(data) {
    return prisma.blogPost.create({ data });
  },

  list(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    return prisma.blogPost.findMany({
      skip,
      take: limit,
      orderBy: { publishedAt: "desc" },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  },

  // ✅ LISTAR POSTS POR AUTOR
  listByAuthor(authorId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    return prisma.blogPost.findMany({
      where: { authorId },
      skip,
      take: limit,
      orderBy: { publishedAt: "desc" },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  },

  findById(id) {
    return prisma.blogPost.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  },

  update(id, data) {
    return prisma.blogPost.update({
      where: { id },
      data,
    });
  },

  listByCategory(value, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  return prisma.blogPost.findMany({
    where: {
      OR: [
        { categoryId: value }, // busca por ID
        {
          category: {
            slug: value, // busca por slug
          },
        },
      ],
    },
    skip,
    take: limit,
    orderBy: { publishedAt: "desc" },
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
      author: {
        select: { id: true, name: true, email: true },
      },
    },
  });
},

  remove(id) {
    return prisma.blogPost.delete({
      where: { id },
    });
  },

  checkCategory(id) {
    return prisma.blogCategory.findUnique({
      where: { id },
    });
  },
};
