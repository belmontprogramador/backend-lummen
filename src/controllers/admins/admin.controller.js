const jwt = require('jsonwebtoken');
const { prisma } = require('../../dataBase/prisma');
const { hashPassword, comparePassword } = require('../../utils/hash');

// helper para não expor senha
const pickAdmin = (a) => ({
  id: a.id,
  name: a.name,
  email: a.email,
  role: a.role,
  active: a.active,
  createdAt: a.createdAt,
  updatedAt: a.updatedAt,
});

// ------------------ AUTH ------------------

// POST /admins/login
exports.login = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email e password são obrigatórios' });

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !admin.active) return res.status(401).json({ error: 'Credenciais inválidas' });

  const ok = await comparePassword(password, admin.password);
  if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' });

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.json({ token, admin: pickAdmin(admin) });
};

// GET /admins/me
exports.me = async (req, res) => {
  const me = await prisma.admin.findUnique({ where: { id: req.user.id } });
  if (!me) return res.status(404).json({ error: 'Admin não encontrado' });
  res.json(pickAdmin(me));
};

// ------------------ CRUD ------------------

// POST /admins  (apenas SUPER cria)
exports.create = async (req, res) => {
  try {
    const { name, email, password, role = 'ADMIN', active = true } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password são obrigatórios' });

    const exists = await prisma.admin.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: 'E-mail já cadastrado' });

    const hash = await hashPassword(password);
    const admin = await prisma.admin.create({
      data: { name, email, password: hash, role, active },
    });

    res.status(201).json(pickAdmin(admin));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// GET /admins  (listar com paginação)
exports.list = async (req, res) => {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.max(parseInt(req.query.limit || '20', 10), 1);
  const skip = (page - 1) * limit;

  const [total, items] = await Promise.all([
    prisma.admin.count(),
    prisma.admin.findMany({
      skip,
      take: limit,
      orderBy: { id: 'desc' },
    }),
  ]);

  res.json({
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    items: items.map(pickAdmin),
  });
};

// GET /admins/:id
exports.getOne = async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'id inválido' });

  const admin = await prisma.admin.findUnique({ where: { id } });
  if (!admin) return res.status(404).json({ error: 'Admin não encontrado' });
  res.json(pickAdmin(admin));
};

// PUT /admins/:id
exports.update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'id inválido' });

    const { name, email, password, role, active } = req.body || {};

    if (email) {
      const conflict = await prisma.admin.findUnique({ where: { email } });
      if (conflict && conflict.id !== id) return res.status(409).json({ error: 'E-mail já em uso' });
    }

    const data = { name, email, role, active };
    if (password) data.password = await hashPassword(password);
    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);

    const updated = await prisma.admin.update({ where: { id }, data });
    res.json(pickAdmin(updated));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// DELETE /admins/:id
exports.remove = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'id inválido' });
    await prisma.admin.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'Admin não encontrado' });
    res.status(400).json({ error: e.message });
  }
};
