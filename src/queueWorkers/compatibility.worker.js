const { Worker } = require("bullmq");
const { prisma } = require("../dataBase/prisma");
const { runTask } = require("../workers/scoreWorkerPool");

// 🔥 Cliente Redis para cache (NÃO remove o connection do BullMQ!)
const redisClient = require("../utils/redisClient");

const connection = require("../utils/redis");

new Worker(
  "compatibilityQueue",
  async (job) => {
    const { baseUser, targetUser } = job.data;

    const score = await runTask({
      loggedUser: baseUser,
      targetUser
    });

    if (score < 30) return;

    // 1️⃣ Salva no PostgreSQL como sempre
    await prisma.compatibilityScore.upsert({
      where: {
        userA_userB: {
          userA: baseUser.id,
          userB: targetUser.id,
        }
      },
      update: { score },
      create: {
        userA: baseUser.id,
        userB: targetUser.id,
        score
      }
    });

    // 2️⃣ Salva no Redis (cache para feed super-rápido)
    await redisClient.zAdd(
      `compat:${baseUser.id}`,        // chave da lista do usuário
      { score: score, value: targetUser.id } // score + user
    );

    console.log(`💾 Score salvo: ${baseUser.id} → ${targetUser.id} = ${score}`);
    console.log(`⚡ Redis atualizado para compat:${baseUser.id}`);
  },
  {
    connection,
    concurrency: 20,
  }
);

console.log("⚡ Worker de COMPATIBILIDADE rodando!");
