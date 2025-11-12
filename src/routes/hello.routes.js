const express = require("express");
const router = express.Router();
const { helloWorld } = require("../controllers/hello.controller");

// Rota principal
router.get("/", helloWorld);

module.exports = router;
