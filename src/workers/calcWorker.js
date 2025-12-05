const { Worker } = require("bullmq");
const connection = require("../queue/redis");
const { prisma } = require("../dataBase/prisma");
const calculateCompatibility = require("../utils/calculateCompatibility");

const BATCH_SIZE = 200;

new Worker(
  "compatibility-calc",
  async (job) => {
    const userId = job.data.userId;

    console.log(`🧠 Worker iniciando cálculo → userA=${userId}`);

    // total de usuários ativos
    const totalUsers = await prisma.user.count({
      where: { id: { not: userId }, status: "ACTIVE" },
    });

    const batches = Math.ceil(totalUsers / BATCH_SIZE);

    console.log(`📌 total=${totalUsers} batches=${batches}`);

    for (let i = 0; i < batches; i++) {
      const users = await prisma.user.findMany({
        where: { id: { not: userId }, status: "ACTIVE" },
        skip: i * BATCH_SIZE,
        take: BATCH_SIZE,
        include: {
          profile: true,
          preference: true,
        },
      });

      const baseUser = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true, preference: true },
      });

      const scores = [];

      for (const u of users) {
        const score = calculateCompatibility(baseUser, u);

        scores.push({
          userA: userId,
          userB: u.id,
          score,
        });
      }

      // upsert em massa
      await prisma.$transaction(
        scores.map((s) =>
          prisma.compatibilityScore.upsert({
            where: { userA_userB: { userA: s.userA, userB: s.userB } },
            update: { score: s.score },
            create: s,
          })
        )
      );

      console.log(
        `📦 batch ${i + 1}/${batches} → salvos=${scores.length} userA=${userId}`
      );
    }

    console.log(`🎉 Worker finalizou todos batches → userA=${userId}`);
  },
  { connection }
);
