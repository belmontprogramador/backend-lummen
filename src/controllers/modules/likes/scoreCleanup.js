const { prisma } = require("../../../dataBase/prisma");

async function removeCompatibilityBetween(userA, userB) {
  try {
    // REMOVE APENAS userA → userB
    await prisma.compatibilityScore.deleteMany({
      where: { userA, userB }
    });

    console.log(`🧹 Score removido APENAS de ${userA} → ${userB}`);
  } catch (err) {
    console.error("❌ Erro ao remover score:", err);
  }
}

module.exports = { removeCompatibilityBetween };
