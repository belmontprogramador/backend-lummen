const express = require("express");
const router = express.Router();

const controller = require("./userProfiles.controller");
const { auth } = require("../../../utils/auth");
const { requireApiKey } = require("../../../utils/apiAuth");

// Perfil logado
router.get("/me", requireApiKey, auth, controller.getMe);

// Atualizar perfil completo
router.put("/", requireApiKey, auth, controller.update);

// Deletar todas as seções
router.delete("/", requireApiKey, auth, controller.delete);

// Trazer enums traduzidos
router.get("/enums", requireApiKey, auth, controller.getEnums);

module.exports = router;
