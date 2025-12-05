const { prisma } = require("../dataBase/prisma");
const { runTask } = require("../workers/scoreWorkerPool");

function cleanObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

async function precalculateCompatibility(userId) {
  console.log("🚀 Iniciando pré-cálculo de compatibilidade para:", userId);

  const baseUserRaw = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      preference: true,
    },
  });

  if (!baseUserRaw) {
    console.log("⚠️ Usuário não encontrado");
    return;
  }

  const baseUser = cleanObject(baseUserRaw);

  const usersRaw = await prisma.user.findMany({
    where: {
      id: { not: userId },
      status: "ACTIVE",
    },
    include: {
      profile: true,
      preference: true,
    },
  });

  console.log(`📌 Total de usuários para comparar: ${usersRaw.length}`);

  for (const u of usersRaw) {
    try {
      const cleanTargetUser = cleanObject(u);

      const score = await runTask({
        loggedUser: baseUser,
        targetUser: cleanTargetUser,
      });

      // ⚠️ NOVO: ignora scores fracos
      if (score < 30) {
        // console.log(`⏭ Score ignorado (<50): ${baseUser.id} → ${u.id} = ${score}`);
        continue;
      }

      // Salva somente scores fortes
      await prisma.compatibilityScore.upsert({
        where: {
          userA_userB: {
            userA: baseUser.id,
            userB: u.id,
          },
        },
        update: { score },
        create: {
          userA: baseUser.id,
          userB: u.id,
          score,
        },
      });

      console.log(`💾 Score salvo: ${baseUser.id} → ${u.id} = ${score}`);

    } catch (err) {
      console.log("❌ Erro calculando score", u.id, err);
    }
  }

  console.log("🎉 Finalizado cálculo para usuário:", userId);
}

module.exports = { precalculateCompatibility }
