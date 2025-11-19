const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Iniciando SEED...");

  // Verificar se já existe plano FREE
  const exists = await prisma.plan.findUnique({
    where: { name: "free" },
  });

  if (!exists) {
    await prisma.plan.create({
      data: {
        name: "free",
        title: "Free Plan",
        features: ["Basic access"],
        price: 0,
        durationDays: 999999, // praticamente eterno
        allowedRoutes: [],
        routePayment: {},
      },
    });

    console.log("🟢 Plano FREE criado com sucesso!");
  } else {
    console.log("✔ Plano FREE já existe, nada a fazer");
  }
}

main()
  .catch((e) => {
    console.error("❌ ERRO NO SEED:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
