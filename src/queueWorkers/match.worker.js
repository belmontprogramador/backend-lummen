// src/queueWorkers/match.worker.js

const { Worker } = require("bullmq");
const connection = require("../utils/redis");
const { prisma } = require("../dataBase/prisma");

new Worker(
  "matchQueue",
  async (job) => {
    const { user1, user2 } = job.data;

    console.log("❤️ PROCESSANDO MATCH ENTRE:", user1, user2);

    // -------------------------------------------------
    // 1) Remover dislike entre eles (se existir)
    // -------------------------------------------------
    await prisma.dislike.deleteMany({
      where: {
        OR: [
          { dislikerId: user1, dislikedId: user2 },
          { dislikerId: user2, dislikedId: user1 }
        ]
      }
    });

    // -------------------------------------------------
    // 2) Remover skip entre eles (se existir)
    // -------------------------------------------------
    await prisma.skip.deleteMany({
      where: {
        OR: [
          { skipperId: user1, skippedId: user2 },
          { skipperId: user2, skippedId: user1 }
        ]
      }
    });

    // -------------------------------------------------
    // 3) Criar registro real de MATCH
    // -------------------------------------------------
    const match = await prisma.match.upsert({
      where: {
        userA_userB: { userA: user1, userB: user2 }
      },
      create: {
        userA: user1,
        userB: user2,
      },
      update: {}
    });

    console.log("🔥 MATCH SALVO NO BANCO:", match);

    // -------------------------------------------------
    // 4) Retorno final
    // -------------------------------------------------
  return { ok: true };

  },
  { connection }
);
