// src/queueWorkers/dislike.worker.js

const { Worker } = require("bullmq");
const { prisma } = require("../dataBase/prisma");

// ➤ Padrão de conexão do seu backend
const connection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD || undefined,
  tls: process.env.REDIS_TLS === "true" ? {} : undefined,
  maxRetriesPerRequest: null,
};

new Worker(
  "dislikeQueue",
  async (job) => {
    const { dislikerId, dislikedId } = job.data;

    console.log("💔 DISLIKE WORKER → PROCESSANDO:", dislikerId, "→", dislikedId);

    const dislike = await prisma.dislike.upsert({
      where: {
        dislikerId_dislikedId: { dislikerId, dislikedId }
      },
      create: { dislikerId, dislikedId },
      update: {}
    });

    // limpar compatibilidade
    await prisma.compatibilityScore.deleteMany({
      where: {
        OR: [
          { userA: dislikerId, userB: dislikedId },
          { userA: dislikedId, userB: dislikerId }
        ]
      }
    });

    return dislike;
  },
  { connection }
);
