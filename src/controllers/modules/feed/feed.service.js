const repository = require("./feed.repository");

module.exports = {
  async list(query, loggedUserId) {
    const page = Math.max(parseInt(query.page || "1"), 1);
    const limit = Math.max(parseInt(query.limit || "20"), 1);
    const skip = (page - 1) * limit;

    const filter = {};

    // 🔥 Aqui depois entra:
    // - busca por distância
    // - idade
    // - gênero
    // - preferencias
    // - boosts
    // - ordem por prioridade

    const [total, items] = await Promise.all([
      repository.count(filter),
      repository.list({ skip, limit, where: filter, loggedUserId }),
    ]);

    return {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      items,
    };
  },

  async getOne(id) {
    const user = await repository.getById(id);
    if (!user) throw new Error("Usuário não encontrado");
    return user;
  }
};
