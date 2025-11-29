const express = require("express");
const router = express.Router();
const controller = require("./blogFeed.controller");

const { requireApiKey } = require("../../../middleware/apiAuth");
const { requireAuth } = require("../../../middleware/authUser");
const dynamicRoute = require("../../../middleware/dynamicRoute");

// 🔓 FEED DO APP (API KEY + JWT + PLANO)
router.get(
  "/",
  requireApiKey,
  requireAuth,
  dynamicRoute("blog_feed"),
  controller.list
);

// 🔓 DETALHE DO POST POR ID (API KEY + JWT + PLANO)
router.get(
  "/:id",
  requireApiKey,
  requireAuth,
  dynamicRoute("blog_feed"),
  controller.getById
);

module.exports = router;
