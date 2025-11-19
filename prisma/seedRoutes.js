const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed das rotas do FEED...");

  const routesData = [
    {
      name: "Feed — Listar feed",
      tag: "feed_list",
      path: "/feed",
      method: "GET",
    },
    {
      name: "Feed — Ver item do feed",
      tag: "feed_view",
      path: "/feed/:id",
      method: "GET",
    },
  ];

  for (const route of routesData) {
    const existing = await prisma.route.findUnique({
      where: { tag: route.tag }
    });

    if (existing) {
      console.log(`➡️ Rota ${route.tag} já existe, atualizando...`);
      await prisma.route.update({
        where: { id: existing.id },
        data: route,
      });
    } else {
      await prisma.route.create({ data: route });
      console.log(`✅ Rota ${route.tag} criada`);
    }
  }

  console.log("🌱 Seed das rotas de FEED finalizado!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
