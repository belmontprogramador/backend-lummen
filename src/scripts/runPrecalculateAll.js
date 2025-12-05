require("dotenv").config();
const { prisma } = require("../dataBase/prisma");
const { precalculateCompatibility } = require("../jobs/precalculateCompatibility");

(async () => {
  console.log("⚡ Iniciando recálculo geral de compatibilidade…");

  // 1️⃣ Buscar todos os usuários ativos
  const users = await prisma.user.findMany({
    where: { status: "ACTIVE" },
    select: { id: true }
  });

  console.log(`📌 Total de usuários encontrados: ${users.length}`);

  let count = 0;

  // 2️⃣ Recalcular para cada usuário
  for (const u of users) {
    count++;
    console.log(`\n🚀 [${count}/${users.length}] Recalculando → ${u.id}`);

    try {
      await precalculateCompatibility(u.id);
      console.log(`✅ Finalizado para ${u.id}`);
    } catch (err) {
      console.error(`❌ Erro ao recalcular ${u.id}:`, err?.message || err);
    }
  }

  console.log("\n🎉 Recálculo geral finalizado!");
  process.exit(0);
})();
