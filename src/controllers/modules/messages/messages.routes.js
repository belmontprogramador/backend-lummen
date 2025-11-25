const express = require("express");
const router = express.Router();

const controller = require("./messages.controller");

const { requireAuth } = require("../../../middleware/authUser");
const { requireApiKey } = require("../../../middleware/apiAuth");
const dynamicRoute = require("../../../middleware/dynamicRoute");

// 🔐 API KEY + AUTH
router.use(requireApiKey);
router.use(requireAuth);

// 📩 HISTÓRICO ENTRE DOIS USUÁRIOS (match obrigatório)
router.get(
  "/:otherUserId",
  dynamicRoute("messages_list"),
  controller.list
);

// ✉️ ENVIAR MENSAGEM
router.post(
  "/",
  dynamicRoute("messages_send"),
  controller.send
);

module.exports = router;
