const repo = require("./plan.repository");

module.exports = {
  async create(payload) {
    return repo.create(payload);
  },

  async list(page = 1, limit = 20) {
    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      repo.count(),
      repo.list(skip, limit)
    ]);

    return {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      items
    };
  },

  async getOne(id) {
    const plan = await repo.getOne(id);
    if (!plan) throw new Error("Plano não encontrado");
    return plan;
  },

  async update(id, payload) {
    return repo.update(id, payload);
  },

  async remove(id) {
    return repo.remove(id);
  },

  async listRoutes() {
    return repo.getAllRoutes();
  },
};
