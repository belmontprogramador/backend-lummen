const service = require("./blogCategories.service");

module.exports = {
  async create(req, res) {
    try {
      const category = await service.create(req.body);
      res.status(201).json(category);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async list(req, res) {
    try {
      const categories = await service.list();
      res.json(categories);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getBySlug(req, res) {
    try {
      const category = await service.getBySlug(req.params.slug);
      res.json(category);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const category = await service.update(req.params.id, req.body);
      res.json(category);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getById(req, res) {
  try {
    const category = await service.getById(req.params.id);
    res.json(category);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
},


  async remove(req, res) {
    try {
      await service.remove(req.params.id);
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};
