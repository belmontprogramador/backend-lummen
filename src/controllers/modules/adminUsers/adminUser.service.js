const repo = require("./adminUser.repository");

module.exports = {
  async list(query) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;

    return await repo.list(page, limit);
  },

  async getOne(id) {
    return await repo.getOne(id);
  },

  async update(id, data) {
    return await repo.update(id, data);
  },

  async remove(id) {
    return await repo.remove(id);
  }
};
