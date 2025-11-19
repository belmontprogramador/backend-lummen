const router = require("express").Router();
const { requireAuth } = require("../../../middleware/authUser");
const { requireApiKey } = require("../../../middleware/apiAuth");
const dynamicRoute = require("../../../middleware/dynamicRoute"); 
const controller = require("./feed.controllers");

// 🔐 1) API KEY obrigatória
router.use(requireApiKey);

// 🔒 2) Login obrigatório
router.use(requireAuth);

// 🔒 3) Rota: listar feed — tag: "feed_list"
router.get(
  "/",
  dynamicRoute("feed_list"),
  controller.list
);

// 🔒 4) Rota: pegar item específico — tag: "feed_view"
router.get(
  "/:id",
  dynamicRoute("feed_view"),
  controller.getOne
);

module.exports = router;
