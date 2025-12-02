const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

 

const maleNames = [
  "Lucas","Mateus","Pedro","João","Rafael","Gabriel","Bruno","Diego","Felipe",
  "André","Thiago","Leonardo","Caio","Daniel","Victor","Renan","Gustavo",
  "Igor","Arthur","Matheus"
];

const femaleNames = [
  "Ana","Beatriz","Camila","Daniela","Eduarda","Fernanda","Gabriela","Helena",
  "Isabela","Juliana","Larissa","Mariana","Natália","Patrícia","Rafaela",
  "Sabrina","Tatiane","Vanessa","Yasmin","Vitória"
];

const bios = [
  "Sempre em busca de novas conexões.",
  "Apaixonado por tecnologia e inovação.",
  "Vivendo um dia de cada vez.",
  "Empreendedor por natureza.",
  "Amante de esportes e boa música.",
  "Gosto de conhecer novas pessoas.",
  "Foco total no crescimento pessoal."
];

const jobs = ["Developer", "Designer", "Marketing", "Sales", "Product Manager"];
const companies = ["Tech Solutions", "Startup Hub", "Innovation Labs", "Cloud Corp"];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("🧹 Limpando usuários de teste...");
  await prisma.user.deleteMany({
    where: { email: { endsWith: "@test.com" } }
  });

  console.log("🌱 Criando 40 usuários no padrão REAL do backend...");

  const passwordHash = await bcrypt.hash("123456", 10);

  const freePlan = await prisma.plan.findFirst({
    where: { name: "free" }
  });

  if (!freePlan) {
    throw new Error("Plano FREE não encontrado no banco.");
  }

  for (let i = 1; i <= 40; i++) {
    const isFemale = Math.random() < 0.5;
    const name = isFemale ? random(femaleNames) : random(maleNames);

    const photo = `/uploads/users/user-${i}.jpg`;

    const user = await prisma.user.create({
      data: {
        email: `user${i}@test.com`,
        name,
        password: passwordHash,
        photo,
        status: "ACTIVE",
        isPaid: false,
        paidUntil: null,
        planId: freePlan.id
      }
    });

    // ✅ PERFIL (igual à criação real)
    await prisma.userProfile.create({
      data: {
        userId: user.id,
        bio: random(bios),
        heightCm: isFemale ? rand(155, 175) : rand(165, 195),
        preferredGenders: [],
        preferredOrientations: [],
        preferredPronouns: [],
        preferredIntentions: [],
        preferredRelationshipTypes: [],
        preferredZodiacs: [],
        latitude: -23.55 + Math.random() * 0.3,
        longitude: -46.63 + Math.random() * 0.3,
        jobTitle: random(jobs),
        company: random(companies),
        preferredEducationLevels: [],
        preferredLanguages: ["PORTUGUESE"],
        preferredInterestsActivities: [],
        preferredInterestsLifestyle: [],
        preferredInterestsCreativity: [],
        preferredInterestsSportsFitness: [],
        preferredInterestsMusic: [],
        preferredInterestsNightlife: [],
        preferredInterestsTvCinema: []
      }
    });

    // ✅ PREFERÊNCIAS (padrão do repository)
    await prisma.userPreference.create({
      data: {
        userId: user.id,
        preferredGenders: [],
        preferredOrientations: [],
        preferredPronouns: [],
        preferredZodiacs: [],
        preferredIntentions: [],
        preferredRelationshipTypes: [],
        preferredPets: [],
        preferredSmoking: [],
        preferredDrinking: [],
        preferredActivityLevel: [],
        preferredCommunication: [],
        preferredEducationLevels: [],
        preferredLanguages: [],
        preferredInterestsActivities: [],
        preferredInterestsLifestyle: [],
        preferredInterestsCreativity: [],
        preferredInterestsSportsFitness: [],
        preferredInterestsMusic: [],
        preferredInterestsNightlife: [],
        preferredInterestsTvCinema: [],
        maxDistanceKm: 50,
        ageMin: 18,
        ageMax: 99
      }
    });

    // ✅ BOOST CREDIT
    const credit = await prisma.boostCredit.create({
      data: {
        userId: user.id,
        type: "BOOST",
        credits: 0,
        used: 0
      }
    });

    // ✅ BOOST ACTIVATION
    await prisma.boostActivation.create({
      data: {
        userId: user.id,
        type: "BOOST",
        status: "PENDING",
        startsAt: new Date(),
        endsAt: new Date(),
        priority: 1,
        creditId: credit.id
      }
    });

    // ✅ PAYMENT PLACEHOLDER
    await prisma.payment.create({
      data: {
        userId: user.id,
        amount: 0,
        currency: "USD",
        status: "PENDING"
      }
    });

    console.log(`✅ Usuário ${i} criado`);
  }

  console.log("🎉 Seed finalizado com SUCESSO!");
}

main()
  .catch((e) => {
    console.error("❌ ERRO NO SEED:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
