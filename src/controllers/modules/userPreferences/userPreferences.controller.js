const service = require("./userPreferences.service");

module.exports = {
  async get(req, res) {
    try {
      const prefs = await service.get(req.user.id);
      return res.json(prefs);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

async updateFree(req, res) {
    try {
      const allowedFields = [
        "maxDistanceKm",
        "ageMin",
        "ageMax",
        "preferredGenders",
        "preferredOrientations"
      ];

      const filtered = {};
      for (const key of allowedFields) {
        if (req.body[key] !== undefined) {
          filtered[key] = req.body[key];
        }
      }

      const prefs = await service.update(req.user.id, filtered);
      return res.json(prefs);

    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async updatePremium(req, res) {
    try {
      const prefs = await service.update(req.user.id, req.body);
      return res.json(prefs);

    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },


  // ➕ NOVO
  async options(req, res) {
    try {
      const opts = await service.options(req.headers["x-locale"] || "en");
      return res.json(opts);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
};
