const repo = require("./blogAuth.repository");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../../../utils/hash");

const pickAuthor = (a) => ({
  id: a.id,
  name: a.name,
  email: a.email,
  photo: a.photo,  // ✅ FOTO VAI PARA O FRONT
  active: a.active,
  role: a.role,
  createdAt: a.createdAt,
});

module.exports = {
  async login({ email, password }) {
    const author = await repo.findByEmail(email.toLowerCase());
    if (!author || !author.active) throw new Error("Credenciais inválidas");

    const ok = await comparePassword(password, author.password);
    if (!ok) throw new Error("Credenciais inválidas");

    const token = jwt.sign(
      { id: author.id, email: author.email, role: author.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return { token, author: pickAuthor(author) };
  },

  async me(id) {
    const author = await repo.findById(id);
    return pickAuthor(author);
  },

  async create({ name, email, password, role, photo }) {
    const hash = await hashPassword(password);

    const author = await repo.create({
      name,
      email: email.toLowerCase(),
      password: hash,
      role,
      photo, // ✅ FOTO SALVA AQUI
      active: true,
    });

    return pickAuthor(author);
  },

  async list({ page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;
    const { total, items } = await repo.list(skip, Number(limit));

    return {
      total,
      items: items.map(pickAuthor),
    };
  },

  async getOne(id) {
    const author = await repo.findById(id);
    return pickAuthor(author);
  },

async update(id, data) {
  if (data.password) {
    data.password = await hashPassword(data.password);
  }

  const author = await repo.update(id, data);

  return pickAuthor(author);
}


};
