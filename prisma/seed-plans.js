const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed dos planos...");

  const plansData = [
    {
      name: "FREE",
      title: "Plano Gratuito",
      price: 0,
      durationDays: 99999,
      features: {
        filters: ["basic_filters"],
        limits: {
          maxLikesPerDay: 20,
          superLikes: 0,
          boosts: 0,
        },
        support: "standard",
      }
    },
    {
      name: "PREMIUM_1",
      title: "Premium – Filtros Avançados",
      price: 19.90,
      durationDays: 30,
      features: {
        filters: ["basic_filters", "advanced_filters"],
        limits: {
          maxLikesPerDay: 200,
          superLikes: 5,
          boosts: 1,
        },
        support: "priority",
      }
    },
    {
      name: "PREMIUM_2",
      title: "Premium Plus – Tudo Ilimitado",
      price: 39.90,
      durationDays: 30,
      features: {
        filters: ["basic_filters", "advanced_filters", "exclusive_filters"],
        limits: {
          maxLikesPerDay: 9999,
          superLikes: 20,
          boosts: 3,
        },
        support: "vip",
      }
    }
  ];

  for (const plan of plansData) {
    const existing = await prisma.plan.findUnique({ where: { name: plan.name } });

    if (existing) {
      console.log(`➡️ Plano ${plan.name} já existe, atualizando...`);
      await prisma.plan.update({
        where: { name: plan.name },
        data: plan,
      });
      continue;
    }

    await prisma.plan.create({ data: plan });
    console.log(`✅ Plano ${plan.name} criado`);
  }

  console.log("🌱 Seed finalizado!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
