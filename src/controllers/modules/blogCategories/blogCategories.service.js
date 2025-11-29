const repo = require("./blogCategories.repository");
const slugify = require("slugify");

module.exports = {
  async create({ name }) {
    if (!name) throw new Error("Nome é obrigatório");

    const slug = slugify(name, { lower: true, strict: true });

    const exists = await repo.findBySlug(slug);
    if (exists) throw new Error("Categoria já existe");

    return repo.create({ name, slug });
  },

  async list() {
    return repo.list();
  },

  async getBySlug(slug) {
    const category = await repo.findBySlug(slug);
    if (!category) throw new Error("Categoria não encontrada");
    return category;
  },

  async getById(id) {
  const category = await repo.findById(id);
  if (!category) throw new Error("Categoria não encontrada");
  return category;
},


  async update(id, { name }) {
    if (!name) throw new Error("Nome é obrigatório");

    const slug = slugify(name, { lower: true, strict: true });

    return repo.update(id, { name, slug });
  },

  async remove(id) {
    return repo.remove(id);
  }
};
