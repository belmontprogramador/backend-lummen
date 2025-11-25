const express = require("express");
const router = express.Router();

const controller = require("./likes.controller");

const { requireAuth } = require("../../../middleware/authUser");
const { requireApiKey } = require("../../../middleware/apiAuth");
const dynamicRoute = require("../../../middleware/dynamicRoute");

// 🔐 API KEY + Auth
router.use(requireApiKey);
router.use(requireAuth);

//
// ❤️ LIKE
//
router.post(
  "/",
  dynamicRoute("like_create"),
  controller.create
);

// -------------------------
// 🔥 ROTAS FIXAS PRIMEIRO!
// -------------------------
router.get(
  "/matches",
  dynamicRoute("like_matches"),
  controller.matches
);

router.get(
  "/sent",
  dynamicRoute("like_sent"),
  controller.sent
);

router.get(
  "/received",
  dynamicRoute("like_received"),
  controller.received
);

router.get(
  "/all",
  dynamicRoute("like_all"),
  controller.all
);

// -------------------------
// ⚠️ ROTAS COM PARÂMETROS (DEPOIS!)
// -------------------------
router.get(
  "/check/:likedId",
  dynamicRoute("like_check"),
  controller.check
);

router.delete(
  "/:likedId",
  dynamicRoute("like_delete"),
  controller.remove
);

//
// 💔 DISLIKE
//
router.post(
  "/dislike",
  dynamicRoute("dislike_create"),
  controller.createDislike
);

router.delete(
  "/dislike/:dislikedId",
  dynamicRoute("dislike_delete"),
  controller.removeDislike
);

//
// ⏭ SKIP
//
router.post(
  "/skip",
  dynamicRoute("skip_create"),
  controller.createSkip
);

module.exports = router;
