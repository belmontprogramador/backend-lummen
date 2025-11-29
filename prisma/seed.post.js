const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do Blog Lummen...");

  // ================================
  // ✅ CATEGORIAS (AGORA COM SLUG)
  // ================================
  const categories = [
    { name: "Vida LGBTQIA+", slug: "vida-lgbtqia" },
    { name: "Relacionamentos & Amor", slug: "relacionamentos-amor" },
    { name: "Saúde Mental & Bem-Estar", slug: "saude-mental" },
    { name: "Identidade & Gênero", slug: "identidade-genero" },
    { name: "Direitos & Comunidade", slug: "direitos-comunidade" },
    { name: "Eventos & Cultura", slug: "eventos-cultura" },
    { name: "Histórias Reais", slug: "historias-reais" },
    { name: "Tecnologia & Apps", slug: "tecnologia-apps" },
    { name: "Trabalho & Carreira", slug: "trabalho-carreira" },
    { name: "Sexualidade & Educação", slug: "sexualidade-educacao" },
    { name: "Estilo de Vida", slug: "estilo-de-vida" },
    { name: "Turismo LGBTQIA+", slug: "turismo-lgbtqia" },
  ];

  for (const cat of categories) {
    await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const allCategories = await prisma.blogCategory.findMany();

  // ================================
  // ✅ POSTS (1 PARA CADA CATEGORIA)
  // ================================
  for (const cat of allCategories) {
    await prisma.blogPost.create({
      data: {
        author: "Equipe Lummen",
        title: `Conteúdo sobre ${cat.name}`,
        subtitle: `Um guia especial de ${cat.name}`,
        content: `Este é o primeiro artigo oficial da categoria ${cat.name} no Lummen. Aqui você encontrará conteúdos exclusivos, seguros e pensados para a comunidade.`,
        publishedAt: new Date(),
        categoryId: cat.id,
        coverImage: null,
        bannerImage: null,
      },
    });
  }

  console.log("✅ Seed de categorias e posts concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
