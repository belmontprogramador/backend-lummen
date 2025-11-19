const { prisma } = require("../../../dataBase/prisma");

module.exports = {

  // -------------------------------------------------------------
  // CREATE PLAN
  // -------------------------------------------------------------
  async create(data) {
    const {
      name,
      title,
      features,
      price,
      durationDays,
      allowedRoutes,
      paidRoutes
    } = data;

    // Montar mapa { tag: boolean }
    const routePayment = {};
    allowedRoutes.forEach(tag => {
      routePayment[tag] = paidRoutes.includes(tag);
    });

    return prisma.plan.create({
      data: {
        name,
        title,
        features,
        price,
        durationDays,
        allowedRoutes,
        routePayment
      }
    });
  },

  // -------------------------------------------------------------
  // LIST PLAN
  // -------------------------------------------------------------
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

  // -------------------------------------------------------------
  // GET ONE
  // -------------------------------------------------------------
  getOne(id) {
    return prisma.plan.findUnique({ where: { id } });
  },

  // -------------------------------------------------------------
  // UPDATE PLAN
  // -------------------------------------------------------------
  async update(id, data) {
    const existing = await prisma.plan.findUnique({ where: { id } });

    if (!existing) {
      throw new Error("Plano não encontrado.");
    }

    const isFree = existing.name === "free";

    const {
      name,
      title,
      features,
      price,
      durationDays,
      allowedRoutes,
      paidRoutes
    } = data;

    // -----------------------------------------------
    // ❌ BLOQUEIOS PARA O PLANO FREE
    // -----------------------------------------------
    if (isFree) {
      if (name && name !== "free") {
        throw new Error("O nome do plano FREE não pode ser alterado.");
      }

      if (price !== undefined && price !== existing.price) {
        throw new Error("O preço do plano FREE não pode ser alterado.");
      }

      if (durationDays !== undefined && durationDays !== existing.durationDays) {
        throw new Error("A duração do plano FREE não pode ser alterada.");
      }

      if (allowedRoutes && JSON.stringify(allowedRoutes) !== JSON.stringify(existing.allowedRoutes)) {
        throw new Error("As rotas permitidas do plano FREE não podem ser alteradas.");
      }

      if (paidRoutes && paidRoutes.length > 0) {
        throw new Error("O plano FREE não pode ter rotas pagas.");
      }
    }

    // -------------------------------------------------------------
    // RECONSTRUIR routePayment SOMENTE SE vierem novos dados
    // -------------------------------------------------------------
    let routePayment = undefined;

    if (allowedRoutes && paidRoutes) {
      routePayment = {};
      allowedRoutes.forEach(tag => {
        routePayment[tag] = paidRoutes.includes(tag);
      });
    }

    // -------------------------------------------------------------
    // ATUALIZAÇÃO PERMITIDA
    // -------------------------------------------------------------
    return prisma.plan.update({
      where: { id },
      data: {
        // ❌ FREE cannot change name
        ...(name && !isFree && { name }),

        // ✔ FREE pode mudar título e features
        ...(title && { title }),
        ...(features && { features }),

        // ❌ FREE cannot change price/duration
        ...(price !== undefined && !isFree && { price }),
        ...(durationDays !== undefined && !isFree && { durationDays }),

        ...(allowedRoutes && { allowedRoutes }),
        ...(routePayment && { routePayment })
      }
    });
  },

  // -------------------------------------------------------------
  // DELETE PLAN
  // -------------------------------------------------------------
  async remove(id) {
    const plan = await prisma.plan.findUnique({ where: { id } });

    if (plan?.name === "free") {
      throw new Error("O plano FREE não pode ser deletado.");
    }

    return prisma.plan.delete({ where: { id } });
  },

  // -------------------------------------------------------------
  // LIST ALL ROUTES (UI)
  // -------------------------------------------------------------
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
