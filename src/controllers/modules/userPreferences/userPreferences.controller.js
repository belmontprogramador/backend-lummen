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

async update(req, res) {
  try {
    const mode = req.body.mode;  // "free" ou "premium"

    if (!mode) {
      return res.status(400).json({ error: "Mode is required: free or premium" });
    }

    const isPaid = req.user.isPaid;

    // ###############################
    // BLOQUEAR PREMIUM PARA FREE
    // ###############################
    if (mode === "premium" && !isPaid) {
      console.log("⛔ Bloqueado PREMIUM para usuário free:", req.user.id);
      return res.status(403).json({
        error: "Você precisa ser premium.",
        code: "PREMIUM_REQUIRED",
      });
    }

    // ###############################
    // FREE → filtrar campos permitidos
    // ###############################
    if (mode === "free") {
      const allowedFree = [
        "maxDistanceKm",
        "ageMin",
        "ageMax",
        "preferredGenders",
        "preferredOrientations"
      ];

      const filtered = {};
      allowedFree.forEach((key) => {
        if (req.body[key] !== undefined) {
          filtered[key] = req.body[key];
        }
      });

      console.log("🟦 Salvando FREE:", filtered);
      const prefs = await service.update(req.user.id, filtered);
      return res.json(prefs);
    }

    // ###############################
    // PREMIUM → salva tudo
    // ###############################
    console.log("🟪 Salvando PREMIUM:", req.body);
    const prefs = await service.update(req.user.id, req.body);
    return res.json(prefs);

  } catch (err) {
    console.log("❌ ERROR:", err);
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
