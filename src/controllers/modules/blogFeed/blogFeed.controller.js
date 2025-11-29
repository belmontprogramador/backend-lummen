const service = require("./blogFeed.service");

module.exports = {
  async list(req, res) {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);

      const data = await service.listFeed(page, limit);

      // ✅ Cache leve para o aplicativo
      res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=120");

      res.json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

 async getById(req, res) {
  try {
    const { id } = req.params;

    const data = await service.getById(id);

    res.set("Cache-Control", "public, max-age=120");

    res.json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
},

};
