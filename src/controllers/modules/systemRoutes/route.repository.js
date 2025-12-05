// src/modules/systemRoutes/route.repository.js
const { prisma } = require("../../../dataBase/prisma");

async function findAll() {
  return prisma.route.findMany({
    select: {
      id: true,
      name: true,
      tag: true,
      path: true,
      method: true,
    },
    orderBy: { name: "asc" }
  });
}

module.exports = {
  findAll,
};
