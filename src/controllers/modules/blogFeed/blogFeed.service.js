const repo = require("./blogFeed.repository");

module.exports = {
  async listFeed(page, limit) {
    return repo.listFeed(page, limit);
  },

async getById(id) {
  const post = await repo.getById(id);
  if (!post) throw new Error("Post não encontrado");
  return post;
},

};
