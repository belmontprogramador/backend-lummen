const router = require("express").Router();
const { requireAuth } = require("../../../middleware/authUser");
const { requireApiKey } = require("../../../middleware/apiAuth");
const dynamicRoute = require("../../../middleware/dynamicRoute");
const controller = require("./feed.controllers");

// 🔐 API KEY
router.use(requireApiKey);

// 🔒 Login obrigatório
router.use(requireAuth);

// ⭐ FEED FREE
router.get(
  "/free",
  dynamicRoute("feed_list_free"),
  (req, res, next) => {
    req.user.routeTag = "feed_list_free";
    next();
  },
  controller.list
);

// ⭐ FEED PREMIUM
router.get(
  "/premium",
  dynamicRoute("feed_list_premium"),
  (req, res, next) => {
    req.user.routeTag = "feed_list_premium";
    next();
  },
  controller.list
);

// ⭐ FEED SUPER PREMIUM
router.get(
  "/super",
  dynamicRoute("feed_list_super_premium"),
  (req, res, next) => {
    req.user.routeTag = "feed_list_super_premium";
    next();
  },
  controller.list
);


// ⭐ ITEM ESPECÍFICO FREE
router.get(
  "/free/:id",
  dynamicRoute("feed_view_free"),
  (req, res, next) => {
    req.user.routeTag = "feed_view_free";
    next();
  },
  controller.getOne
);

// ⭐ ITEM ESPECÍFICO PREMIUM
router.get(
  "/premium/:id",
  dynamicRoute("feed_view_premium"),
  (req, res, next) => {
    req.user.routeTag = "feed_view_premium";
    next();
  },
  controller.getOne
);

module.exports = router;
