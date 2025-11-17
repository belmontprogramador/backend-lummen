// src/modules/passwordReset/passwordReset.controller.js
const service = require("./passwordReset.service");

module.exports = {
  async forgotPassword(req, res) {
    try {
      const result = await service.forgotPassword(req.body.email);
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async resetPassword(req, res) {
    try {
      const result = await service.resetPassword(req.body);
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
};
