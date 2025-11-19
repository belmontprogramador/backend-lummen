const router = require("express").Router();
const controller = require("./userPreferences.controller");

const { requireAuth } = require("../../../middleware/authUser");
const { requireApiKey } = require("../../../middleware/apiAuth");

const requireRouteAccess = require("../../../middleware/requireRouteAccess");
const requirePaidPlan = require("../../../middleware/requirePaidPlan");

// 🔐 1) Todas as rotas exigem API KEY
router.use(requireApiKey);

// 🔒 2) GET: buscar preferências do usuário
// (não precisa de pagamento nem rota especial)
router.get(
  "/",
  requireAuth,
  controller.get
);

// 🔒 3) PATCH FREE — precisa ter permissão da rota
router.patch(
  "/free",
  requireAuth,
  requireRouteAccess("preferences_free"),
  controller.updateFree
);

// 🔒 4) PATCH PREMIUM — precisa ter plano pago + permissão da rota
router.patch(
  "/premium",
  requireAuth,
  requirePaidPlan(),                // 🔥 verificar pagamento ativo
  requireRouteAccess("preferences_premium"),  // 🔥 verificar rota liberada pelo plano
  controller.updatePremium
);

// 🔒 5) OPTIONS — apenas usuário logado
router.get(
  "/options",
  requireAuth,
  controller.options
);

module.exports = router;
