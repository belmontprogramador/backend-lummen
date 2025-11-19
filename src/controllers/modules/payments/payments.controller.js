const service = require("./payments.service");

module.exports = {
  async webhook(req, res) {
    try {
      const result = await service.handleWebhook(req.body);
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async listByUser(req, res) {
    try {
      const result = await service.listByUser(req.user.id);
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async createPayment(req, res) {
    try {
      const result = await service.createPayment(req.user.id, req.body);
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
};
