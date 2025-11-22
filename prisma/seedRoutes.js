const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed das rotas do sistema (FREE / PREMIUM)...");

  const routesData = [

    // =====================================================
    // FEED (FREE & PREMIUM)
    // =====================================================
    {
      name: "Feed - Listar usuários (FREE)",
      tag: "feed_list_free",
      path: "/feed/free",
      method: "GET",
    },
    {
      name: "Feed - Listar usuários (PREMIUM)",
      tag: "feed_list_premium",
      path: "/feed/premium",
      method: "GET",
    },
    {
      name: "Feed - Ver perfil específico (FREE)",
      tag: "feed_view_free",
      path: "/feed/free/:id",
      method: "GET",
    },
    {
      name: "Feed - Ver perfil específico (PREMIUM)",
      tag: "feed_view_premium",
      path: "/feed/premium/:id",
      method: "GET",
    },

    // =====================================================
    // USER PREFERENCES
    // =====================================================
    {
      name: "Ver minhas Preferências de Match",
      tag: "preferences_get",
      path: "/user-preferences",
      method: "GET",
    },
    {
      name: "Atualizar Preferências Básicas de Match (Free)",
      tag: "preferences_update_free",
      path: "/user-preferences/free",
      method: "PATCH",
    },
    {
      name: "Atualizar Preferências Premium de Match",
      tag: "preferences_update_premium",
      path: "/user-preferences/premium",
      method: "PATCH",
    },
    {
      name: "Ver Opções de Preferências (listas estáticas)",
      tag: "preferences_options",
      path: "/user-preferences/options",
      method: "GET",
    },
    {
      name: "Ver Preferências Públicas de Outros Usuários",
      tag: "preferences_get_public",
      path: "/user-preferences/public/:userId",
      method: "GET",
    },
  ];


  // ==============================================
  // EXECUTAR OU ATUALIZAR ROTAS
  // ==============================================
  for (const route of routesData) {

    const existing = await prisma.route.findUnique({
      where: { tag: route.tag }
    });

    if (existing) {
      console.log(`➡️ Rota ${route.tag} já existe — atualizando...`);
      await prisma.route.update({
        where: { id: existing.id },
        data: route,
      });
    } else {
      await prisma.route.create({ data: route });
      console.log(`✅ Rota ${route.tag} criada`);
    }
  }

  console.log("🌱 Seed finalizado com sucesso!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
