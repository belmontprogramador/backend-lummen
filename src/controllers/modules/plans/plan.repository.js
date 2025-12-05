const { prisma } = require("../../../dataBase/prisma");

module.exports = {
  // CREATE -------------------------------------------------------
  create(data) {
    return prisma.plan.create({ data });
  },

  // LIST (ADMIN) -------------------------------------------------
  list(skip, limit) {
    return prisma.plan.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" }
    });
  },

  count() {
    return prisma.plan.count();
  },

  // LIST ALL (public, mas SEM filtro) ----------------------------
  listAll() {
    return prisma.plan.findMany({
      orderBy: { createdAt: "asc" }
    });
  },

  // LIST FILTERED (PUBLIC) ---------------------------------------
  listFiltered(where) {
    return prisma.plan.findMany({
      where,
      orderBy: { createdAt: "asc" }
    });
  },

  // GET ONE ------------------------------------------------------
  getOne(id) {
    return prisma.plan.findUnique({ where: { id } });
  },

  // UPDATE -------------------------------------------------------
  update(id, data) {
    return prisma.plan.update({
      where: { id },
      data
    });
  },

  // DELETE -------------------------------------------------------
  remove(id) {
    return prisma.plan.delete({
      where: { id }
    });
  },

  // LIST ROUTES (UI) ---------------------------------------------
  getAllRoutes() {
    return prisma.route.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        tag: true,
        path: true,
        method: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }
};
