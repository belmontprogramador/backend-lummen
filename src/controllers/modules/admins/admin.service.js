const repo = require("./admin.repository");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../../../utils/hash");

const pickAdmin = (a) => ({
  id: a.id,
  name: a.name,
  email: a.email,
  role: a.role,
  active: a.active,
  createdAt: a.createdAt,
  updatedAt: a.updatedAt,
});

module.exports = {
  async login({ email, password }) {
    if (!email || !password) throw new Error("email e password são obrigatórios");

    const admin = await repo.findByEmail(email);
    if (!admin || !admin.active) throw new Error("Credenciais inválidas");

    const ok = await comparePassword(password, admin.password);
    if (!ok) throw new Error("Credenciais inválidas");

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    

    return { token, admin: pickAdmin(admin) };
  },

  async me(adminId) {
    const admin = await repo.findById(adminId);
    if (!admin) throw new Error("Admin não encontrado");
    return pickAdmin(admin);
  },

  async create({ name, email, password, role = "ADMIN", active = true }) {
    if (!name || !email || !password) {
      throw new Error("name, email e password são obrigatórios");
    }

    const exists = await repo.findByEmail(email);
    if (exists) throw new Error("E-mail já cadastrado");

    const hash = await hashPassword(password);
    const admin = await repo.create({ name, email, password: hash, role, active });

    return pickAdmin(admin);
  },

  async list({ page = 1, limit = 20 }) {
    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;

    const { total, items } = await repo.list({ skip, limit });

    return {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      items: items.map(pickAdmin),
    };
  },

  async getOne(id) {
    const admin = await repo.findById(id);
    if (!admin) throw new Error("Admin não encontrado");
    return pickAdmin(admin);
  },

  async update(id, data) {
    if (data.email) {
      const conflict = await repo.findByEmail(data.email);
      if (conflict && conflict.id !== id) {
        throw new Error("E-mail já em uso");
      }
    }

    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    const admin = await repo.update(id, data);
    return pickAdmin(admin);
  },

  async remove(id) {
    return repo.remove(id);
  }
};
