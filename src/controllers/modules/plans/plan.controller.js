const service = require("./plan.service");

module.exports = {
  async create(req, res) {
    try {
      const plan = await service.create(req.body);
      res.status(201).json(plan);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async list(req, res) {
    try {
      const data = await service.list(req.query.page, req.query.limit);
      res.json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getOne(req, res) {
    try {
      const plan = await service.getOne(req.params.id);
      res.json(plan);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const updated = await service.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      await service.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

async getPublicPlans(req, res) {
  try {
    const realIp = req.clientIp; // 👈 corrigido

    const plans = await service.listPublic(realIp);
    return res.json(plans);

  } catch (err) {
    console.error("Erro ao obter planos públicos:", err);
    return res.status(400).json({ error: err.message });
  }
},

  async listRoutes(req, res) {
    try {
      const routes = await service.listRoutes();
      res.json(routes);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};
