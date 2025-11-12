const express = require("express");
const router = express.Router();
const matchCtrl = require("../../controllers/users/match.controller");

router.post("/like", matchCtrl.likeUser);

module.exports = router;
