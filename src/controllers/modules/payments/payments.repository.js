const { prisma } = require("../../../dataBase/prisma");

module.exports = {
 create(data) {
  return prisma.payment.create({
    data: {
      ...data,
      plan: data.plan || null
    }
  });
},
  findByUser(userId) {
    return prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  findByEmail(email) {
    return prisma.payment.findMany({
      where: { user: { email } },
      orderBy: { createdAt: "desc" },
    });
  },

};
