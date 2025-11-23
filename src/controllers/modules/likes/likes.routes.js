const express = require("express");
const router = express.Router();

const controller = require("./likes.controller");
const { requireAuth } = require("../../../middleware/authUser");
const { requireApiKey } = require("../../../middleware/apiAuth");
const dynamicRoute = require("../../../middleware/dynamicRoute");

// 🔐 API KEY + Auth
router.use(requireApiKey);
router.use(requireAuth);

// ❤️ Criar Like ou Super Like
router.post(
  "/",
  dynamicRoute("like_create"),
  controller.create
);

// 💔 Remover Like
router.delete(
  "/:likedId",
  dynamicRoute("like_delete"),
  controller.remove
);

// 🔄 Verificar se deu like
router.get(
  "/check/:likedId",
  dynamicRoute("like_check"),
  controller.check
);

// 🔁 Lista de quem curtiu
router.get(
  "/received",
  dynamicRoute("like_received"),
  controller.received
);

module.exports = router;
