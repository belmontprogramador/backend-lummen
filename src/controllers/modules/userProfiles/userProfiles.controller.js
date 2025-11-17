const service = require("./userProfiles.service");

module.exports = {
  async getMe(req, res) {
    try {
      const locale = req.headers["x-locale"] || "en";
      const userId = req.user.id;
      const data = await service.getProfile(userId, locale);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async update(req, res) {
    try {
      const userId = req.user.id;
      const locale = req.headers["x-locale"] || "en";
      const body = req.body;

      const updated = await service.updateProfile(userId, body, locale);
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const userId = req.user.id;
      await service.deleteProfile(userId);
      res.json({ message: "Profile deleted" });
    } catch (err) {
      res.status(500).json({ error: "Error deleting profile" });
    }
  },

 async getEnums(req, res) {
  try {
    const locale =
      req.headers["x-locale"] ||
      req.query.locale ||
      "en";

    const enums = await service.getEnums(locale);
    res.json(enums);
  } catch (err) {
    console.error("ERRO REAL ENUMS:", err);
    res.status(500).json({ error: "Failed to load enums" });
  }
}


};
