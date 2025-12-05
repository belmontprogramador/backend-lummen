const compatibilityQueue = require("../queues/compatibility.queue");
const { prisma } = require("../dataBase/prisma");

async function precalculateCompatibility(userId) {
  console.log("🚀 Iniciando enfileiramento de compatibilidade para:", userId);

  const baseUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      preference: true,
    },
  });

  if (!baseUser) {
    console.log("⚠️ Usuário não encontrado");
    return;
  }

  const users = await prisma.user.findMany({
    where: {
      id: { not: userId },
      status: "ACTIVE",
    },
    include: {
      profile: true,
      preference: true,
    },
  });

  console.log(`📌 Total de usuários enfileirados: ${users.length}`);

  for (const target of users) {
    await compatibilityQueue.add("calc", {
      baseUser,
      targetUser: target
    });
  }

  console.log("🎉 Enfileiramento finalizado!");
}

module.exports = { precalculateCompatibility };
