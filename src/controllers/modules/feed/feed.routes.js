const router = require("express").Router();
const { requireAuth } = require("../../../utils/authUser");
const controller = require("./feed.controllers");

router.get("/", requireAuth, controller.list);
router.get("/:id", requireAuth, controller.getOne);

module.exports = router;
