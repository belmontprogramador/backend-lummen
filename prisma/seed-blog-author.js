const { PrismaClient } = require("../generated/prisma");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const password = "01Ummilh@o"; // troque em produção
  const passwordHash = await bcrypt.hash(password, 10);

  const authors = [
    {
      name: "Belmont",
      email: "belmontprogramador@gmail.com",
      role: "SUPER",
    },
    {
      name: "Admin Blog",
      email: "admin@blog.com",
      role: "ADMIN",
    },
    {
      name: "Autor Blog",
      email: "autor@blog.com",
      role: "AUTHOR",
    },
  ];

  for (const author of authors) {
    const exists = await prisma.blogAuthor.findUnique({
      where: { email: author.email },
    });

    if (exists) {
      console.log(`⚠️ Autor já existe: ${exists.email}`);
      continue;
    }

    const created = await prisma.blogAuthor.create({
      data: {
        name: author.name,
        email: author.email,
        password: passwordHash,
        role: author.role,
        active: true,
      },
    });

    console.log("✅ Autor criado com sucesso:", {
      id: created.id,
      email: created.email,
      role: created.role,
    });
  }

  console.log("🌱 Seed de BlogAuthor finalizado!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed de BlogAuthor:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
