const { Worker } = require("bullmq");
const { prisma } = require("../dataBase/prisma");
const matchQueue = require("../queues/match.queue");

// 🚨 IMPORT CORRETO — AJUSTE CONFORME A SUA ESTRUTURA
const { removeCompatibilityBetween } = require("../controllers/modules/likes/scoreCleanup");

const connection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD || undefined,
  tls: process.env.REDIS_TLS === "true" ? {} : undefined,
  maxRetriesPerRequest: null,
};

new Worker(
  "likeQueue",
  async (job) => {
    const { likerId, likedId, isSuper = false } = job.data;

    console.log("👍 LIKE WORKER → PROCESSANDO:", likerId, "→", likedId);

    // 1️⃣ Remover dislike
    await prisma.dislike.deleteMany({
      where: { dislikerId: likerId, dislikedId: likedId }
    });

    // 2️⃣ Remover skip
    await prisma.skip.deleteMany({
      where: { skipperId: likerId, skippedId: likedId }
    });

    // 3️⃣ Criar o LIKE de verdade
    const like = await prisma.like.upsert({
      where: { likerId_likedId: { likerId, likedId } },
      create: { likerId, likedId, isSuper },
      update: { isSuper }
    });

    // 4️⃣ SÓ AGORA limpa compatibilidade
    await removeCompatibilityBetween(likerId, likedId);

    // 5️⃣ Checar match
    const reverse = await prisma.like.findUnique({
      where: {
        likerId_likedId: {
          likerId: likedId,
          likedId: likerId
        }
      }
    });

    if (reverse) {
      console.log("💘 MATCH DETECTADO NO WORKER → ENFILEIRANDO");

      await matchQueue.add("process-match", {
        user1: likerId,
        user2: likedId,
      });
    }

    return { like, matched: !!reverse };
  },
  { connection }
);
