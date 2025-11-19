const repository = require("./userPreferences.repository");
const { prisma } = require("../../../dataBase/prisma");

module.exports = {

  // ===============================
  // GET — retorna preferências salvas
  // ===============================
  async get(userId) {
    return repository.get(userId);
  },

  // ===============================
  // UPDATE — salva preferências do usuário
  // ===============================
  async update(userId, payload) {

  // remover "mode" antes de enviar ao Prisma
  if ("mode" in payload) {
    delete payload.mode;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isPaid: true }
  });

  if (!user) throw new Error("Usuário não encontrado");

  console.log("🔎 DB isPaid:", user.isPaid);

  const isPaid = user.isPaid;

  const allowedFree = [
    "maxDistanceKm",
    "ageMin",
    "ageMax",
    "preferredGenders",
    "preferredOrientations"
  ];

  if (!isPaid) {
    const cleaned = {};
    allowedFree.forEach((key) => {
      if (payload[key] !== undefined) cleaned[key] = payload[key];
    });
    payload = cleaned;
  }

  return repository.update(userId, payload);
},

  // ===============================
  // OPTIONS — retorna enums traduzidos
  // ===============================
  async options(locale = "en") {
    const rows = await prisma.enumLabel.findMany({
      where: { locale }
    });

    const grouped = {};

    for (const row of rows) {
      if (!grouped[row.enumType]) grouped[row.enumType] = [];

      grouped[row.enumType].push({
        value: row.enumValue,
        label: row.label
      });
    }

    return grouped;
  }
};
