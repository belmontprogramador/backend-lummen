const repository = require("./userPreferences.repository");
const { prisma } = require("../../../dataBase/prisma");

module.exports = {

  // ===============================
  // GET — retorna preferências salvas
  // ===============================
  async get(userId) {
    return repository.get(userId);
  },

  get(userId) {
  return prisma.userPreference.findUnique({ where: { userId } });
},

  // ===============================
  // UPDATE — salva preferências do usuário
  // ===============================
  async update(userId, payload) {

    // Apenas remove "mode" se vier do front
    if ("mode" in payload) {
      delete payload.mode;
    }

    // Aqui NÃO EXISTE mais regra de plano!
    // A rota já valida se é free/premium.
    // O controller já filtra os campos free.
    // => o service só salva.
    
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
