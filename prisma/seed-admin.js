const { PrismaClient } = require("../generated/prisma");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Criando SUPER ADMIN...");

  const email = "belmontprogramador@gmail.com";
  const password = "01Ummilh@o"; // depois você troca em produção

  const passwordHash = await bcrypt.hash(password, 10);

  const exists = await prisma.admin.findUnique({
    where: { email },
  });

  if (exists) {
    console.log("⚠️ Super Admin já existe:", exists.email);
    return;
  }

  const admin = await prisma.admin.create({
    data: {
      name: "Super Admin Lummen",
      email,
      password: passwordHash,
      role: "SUPER",
      active: true,
    },
  });

  console.log("✅ Super Admin criado com sucesso:");
  console.log({
    id: admin.id,
    email: admin.email,
    role: admin.role,
  });
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed do Super Admin:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
