const service = require("./feed.service");

module.exports = {
  async list(req, res) {
    try {
      const locale = req.headers["x-locale"] || req.query.locale || "en";

      // passa o usuário completo (com routeTag)
      const result = await service.list(req.query, req.user, locale);

      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async getOne(req, res) {
    try {
      const locale = req.headers["x-locale"] || req.query.locale || "en";

      const result = await service.getOne(req.params.id, req.user, locale);

      return res.json(result);
    } catch (err) {
      return res.status(404).json({ error: err.message });
    }
  },
};
