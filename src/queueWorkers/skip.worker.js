// src/queueWorkers/skip.worker.js

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
  "skipQueue",
  async (job) => {
    const { skipperId, skippedId } = job.data;

    console.log("⏭ SKIP WORKER → PROCESSANDO:", skipperId, "→", skippedId);

    const skip = await prisma.skip.upsert({
      where: {
        skipperId_skippedId: { skipperId, skippedId }
      },
      create: { skipperId, skippedId },
      update: {}
    });

    // limpar compatibilidade
    await prisma.compatibilityScore.deleteMany({
      where: {
        OR: [
          { userA: skipperId, userB: skippedId },
          { userA: skippedId, userB: skipperId }
        ]
      }
    });

    return skip;
  },
  { connection }
);
