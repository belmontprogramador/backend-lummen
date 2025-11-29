const service = require("./blogAuth.service");

module.exports = {
  async login(req, res) {
    try {
      const result = await service.login(req.body);
      res.json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  },

  async me(req, res) {
    const author = await service.me(req.user.id);
    res.json(author);
  },

  async create(req, res) {
    try {
      const photo = req.file?.filename;
      const author = await service.create({ ...req.body, photo });
      res.status(201).json(author);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async list(req, res) {
    const result = await service.list(req.query);
    res.json(result);
  },

  async getOne(req, res) {
    const author = await service.getOne(req.params.id);
    res.json(author);
  },

async update(req, res) {
  try {
    console.log("🧾 BODY:", req.body);
    console.log("🖼 FILE:", req.file);

    const photo = req.file ? req.file.filename : undefined;

    const data = {
      ...req.body,
      ...(photo && { photo }),
    };

    // ✅ CONVERSÃO CORRETA DE BOOLEAN
    if (typeof data.active === "string") {
      data.active = data.active === "true";
    }

    const author = await service.update(req.params.id, data);

    return res.json(author);

  } catch (err) {
    console.error("❌ ERRO UPDATE:", err.message);
    return res.status(400).json({ error: err.message });
  }
},

  async remove(req, res) {
    await service.remove(req.params.id);
    res.status(204).send();
  },
};
