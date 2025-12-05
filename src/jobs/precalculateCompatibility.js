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

  // 🔥 BUSCAR TODOS OS USUÁRIOS QUE DEVEM SER EXCLUÍDOS DO FEED
  const skipped = await prisma.skip.findMany({
    where: { skipperId: userId },
    select: { skippedId: true }
  });

  const disliked = await prisma.dislike.findMany({
    where: { dislikerId: userId },
    select: { dislikedId: true }
  });

  const liked = await prisma.like.findMany({
    where: { likerId: userId },
    select: { likedId: true }
  });

  const excludedIds = [
    ...skipped.map(s => s.skippedId),
    ...disliked.map(d => d.dislikedId),
    ...liked.map(l => l.likedId)
  ];

  // 🔥 REMOVER DUPLICADOS
  const uniqueExcluded = [...new Set(excludedIds)];

  // 🔥 BUSCAR APENAS QUEM DEVE APARECER NO FEED
  const users = await prisma.user.findMany({
    where: {
      id: {
        not: userId,
        notIn: uniqueExcluded,
      },
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
