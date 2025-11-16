const { prisma } = require("../dataBase/prisma");

async function main() {
  console.log("🛑 Apagando TODOS os usuários...");

  const deleted = await prisma.user.deleteMany({});

  console.log(`✔ ${deleted.count} usuários apagados com sucesso.`);
}

main()
  .catch((e) => {
    console.error("Erro ao apagar usuários:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Conexão encerrada.");
  });
