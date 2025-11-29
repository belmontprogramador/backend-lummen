const { prisma } = require("../../../dataBase/prisma");

module.exports = {
  async listFeed(page = 1, limit = 10) {
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    return prisma.blogPost.findMany({
      skip,
      take,
      orderBy: { publishedAt: "desc" },

      // ✅ select enxuto para performance
      select: {
        id: true,
        title: true,
        subtitle: true,
        slug: true,
        coverImage: true,
        bannerImage: true,
        publishedAt: true,

        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },

        author: {
          select: {
            id: true,
            name: true,
            photo: true,
          },
        },
      },
    });
  },

  async getById(id) {
  return prisma.blogPost.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      subtitle: true,
      content: true,
      coverImage: true,
      bannerImage: true,
      publishedAt: true,

      category: {
        select: {
          id: true,
          name: true,
        },
      },

      author: {
        select: {
          id: true,
          name: true,
          photo: true,
        },
      },
    },
  });
},

};
