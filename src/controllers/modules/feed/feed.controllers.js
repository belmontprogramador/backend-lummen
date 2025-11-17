const service = require("./feed.service");

module.exports = {
  async list(req, res) {
    try {
      const result = await service.list(req.query, req.user.id);
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async getOne(req, res) {
    try {
      const user = await service.getOne(req.params.id);
      return res.json(user);
    } catch (err) {
      return res.status(404).json({ error: err.message });
    }
  }
};
