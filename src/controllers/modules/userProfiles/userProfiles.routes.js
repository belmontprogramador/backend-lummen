// src/modules/userProfiles/userProfiles.routes.js

const express = require("express");
const router = express.Router();

const controller = require("./userProfiles.controller");
const { requireAuth } = require("../../../middleware/authUser");
const { requireApiKey } = require("../../../middleware/apiAuth");
const dynamicRoute = require("../../../middleware/dynamicRoute");

// 🔐 API KEY + Auth em todas
router.use(requireApiKey);
router.use(requireAuth);


// Perfil logado (GET unificado)
router.get("/me", controller.getMe);

// Atualizar perfil FREE (só campos básicos) → rota protegida
router.put(
  "/free",
  dynamicRoute("profile_update_free"),
  controller.updateFree
);

// Atualizar perfil PREMIUM (perfil completo) → rota protegida
router.put(
  "/premium",
  dynamicRoute("profile_update_premium"),
  controller.updatePremium
);

// Deletar perfil inteiro
router.delete("/", controller.delete);

// Trazer enums traduzidos
router.get("/enums", controller.getEnums);

module.exports = router;
