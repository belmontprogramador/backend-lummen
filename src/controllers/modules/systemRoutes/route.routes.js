// src/modules/systemRoutes/route.routes.js
const express = require("express");
const router = express.Router();

const controller = require("./route.controller");

// GET /system-routes → lista as rotas cadastradas no banco
router.get("/", controller.list);

module.exports = router;
