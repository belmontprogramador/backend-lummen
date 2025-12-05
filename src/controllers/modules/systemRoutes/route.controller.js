// src/modules/systemRoutes/route.controller.js
const service = require("./route.service");

module.exports = {
  async list(req, res) {
    try {
      const routes = await service.list();
      return res.json(routes);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
};
