const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Iniciando limpeza de usuários de teste...");

  // ✅ APAGA APENAS USUÁRIOS COM EMAIL DE TESTE
  const deletedUsers = await prisma.user.deleteMany({
    where: {
      email: {
        endsWith: "@test.com"
      }
    }
  });

  console.log(`✅ ${deletedUsers.count} usuários de teste removidos com sucesso!`);
}

main()
  .catch((e) => {
    console.error("❌ Erro ao apagar usuários:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
