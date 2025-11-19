const router = require("express").Router();
const controller = require("./userPreferences.controller");
const { requireAuth } = require("../../../utils/authUser");
const requirePaidUser = require("../../../utils/requirePaidUser");

// Preferências do usuário
router.get("/", requireAuth, controller.get);
router.patch("/", requireAuth, controller.update);


// ➕ NOVO: opções traduzidas
router.get("/options", requireAuth, controller.options);

module.exports = router;
