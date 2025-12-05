const { prisma } = require("../../../dataBase/prisma");

async function removeCompatibilityBetween(userA, userB) {
  try {
    await prisma.compatibilityScore.deleteMany({
      where: {
        OR: [
          { userA, userB },
          { userA: userB, userB: userA }
        ]
      }
    });

    console.log(`🧹 Score removido entre ${userA} ↔ ${userB}`);
  } catch (err) {
    console.error("❌ Erro ao remover scores:", err);
  }
}

module.exports = { removeCompatibilityBetween };
