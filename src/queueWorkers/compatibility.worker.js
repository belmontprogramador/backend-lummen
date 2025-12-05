const { Worker } = require("bullmq");
const { prisma } = require("../dataBase/prisma");
const { runTask } = require("../workers/scoreWorkerPool");
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

    console.log(`💾 Score salvo: ${baseUser.id} → ${targetUser.id} = ${score}`);
  },
  {
    connection,
    concurrency: 20, // processa vários ao mesmo tempo
  }
);

console.log("⚡ Worker de COMPATIBILIDADE rodando!");
