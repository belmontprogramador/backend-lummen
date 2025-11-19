const service = require("./admin.service");

module.exports = {
  login: async (req, res) => {
    try {
      const result = await service.login(req.body);
      res.json(result);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  me: async (req, res) => {
    try {
      const result = await service.me(req.user.id);
      res.json(result);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  create: async (req, res) => {
    try {
      const result = await service.create(req.body);
      res.status(201).json(result);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  list: async (req, res) => {
    try {
      const result = await service.list(req.query);
      res.json(result);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const result = await service.getOne(Number(req.params.id));
      res.json(result);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  update: async (req, res) => {
    try {
      const result = await service.update(Number(req.params.id), req.body);
      res.json(result);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  remove: async (req, res) => {
    try {
      await service.remove(Number(req.params.id));
      res.status(204).send();
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
};
