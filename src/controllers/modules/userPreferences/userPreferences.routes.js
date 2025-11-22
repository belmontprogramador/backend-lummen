// src/controllers/modules/userPreferences/userPreferences.routes.js
const router = require("express").Router();
const controller = require("./userPreferences.controller");

const { requireAuth } = require("../../../middleware/authUser");
const { requireApiKey } = require("../../../middleware/apiAuth");

const dynamicRoute = require("../../../middleware/dynamicRoute");

// 🔐 Todas as rotas exigem API KEY
router.use(requireApiKey);

// 🔒 Todas rotas exigem autenticação
router.use(requireAuth);

/* ============================================
   GET — Buscar preferências (sem dynamicRoute)
   FRONT usa: GET /user-preferences
============================================ */
router.get(
  "/", 
  controller.get
);

/* ============================================
   GET — Preferências públicas de outro usuário
   FRONT usa: GET /user-preferences/:userId/public
============================================ */
router.get(
  "/:userId/public",
  dynamicRoute("preferences_get_public"),
  controller.getPublic
);

/* ============================================
   PATCH FREE — atualização sem pagamento
   FRONT usa: PATCH /user-preferences/free
============================================ */
router.patch(
  "/free",
  dynamicRoute("preferences_update_free"),
  controller.updateFree
);

/* ============================================
   PATCH PREMIUM — atualização com plano
   FRONT usa: PATCH /user-preferences/premium
============================================ */
router.patch(
  "/premium",
  dynamicRoute("preferences_update_premium"),
  controller.updatePremium
);

/* ============================================
   OPTIONS — apenas leitura
   FRONT usa: GET /user-preferences/options
============================================ */
router.get(
  "/options",
  controller.options
);

module.exports = router;
