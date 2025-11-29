const repo = require("./blogPosts.repository");

module.exports = {
  async create(data) {
    if (!data.title || !data.content || !data.authorId) {
      throw new Error("title, content e authorId são obrigatórios");
    }

    if (data.categoryId) {
      const categoryExists = await repo.checkCategory(data.categoryId);
      if (!categoryExists) {
        throw new Error("Categoria inválida");
      }
    }

    return repo.create(data);
  },

  async list(page, limit) {
    return repo.list(page, limit);
  },

  async listByAuthor(authorId, page, limit) {
    return repo.listByAuthor(authorId, page, limit);
  },

  async getOne(id) {
    const post = await repo.findById(id);
    if (!post) throw new Error("Post não encontrado");
    return post;
  },

  async update(id, data) {
    return repo.update(id, data);
  },

  async remove(id) {
    return repo.remove(id);
  },

  async listByCategory(value, page, limit) {
  return repo.listByCategory(value, page, limit);
},


  async verifyOwnership(postId, user) {
    const post = await repo.findById(postId);
    if (!post) throw new Error("Post não encontrado");

    const isOwner = post.authorId === user.id;
    const isAdmin = ["ADMIN", "SUPER"].includes(user.role);

    if (!isOwner && !isAdmin) {
      throw new Error("Sem permissão para esta ação");
    }
  },
};
