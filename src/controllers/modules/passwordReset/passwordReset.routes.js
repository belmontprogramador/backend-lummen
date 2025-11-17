// src/modules/passwordReset/passwordReset.routes.js
const router = require("express").Router();
const controller = require("./passwordReset.controller");
const { requireApiKey } = require("../../../utils/apiAuth");

// Todas as rotas precisam de API KEY
router.use(requireApiKey);

router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);

module.exports = router;
