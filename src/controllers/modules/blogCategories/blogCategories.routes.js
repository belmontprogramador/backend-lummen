const express = require("express");
const router = express.Router();

const controller = require("./blogCategories.controller");
const { auth, requireRole } = require("../../../middleware/auth");

// 🔓 LISTAR TODAS AS CATEGORIAS (PÚBLICO)
router.get("/", controller.list);

router.get(
  "/id/:id",
  auth,
  requireRole("ADMIN", "SUPER"),
  controller.getById
);

// 🔎 BUSCAR CATEGORIA POR SLUG (PÚBLICO)
router.get("/:slug", controller.getBySlug);

// 🔒 CRIAR CATEGORIA (ADMIN | SUPER)
router.post(
  "/",
  auth,
  requireRole("ADMIN", "SUPER"),
  controller.create
);

// 🔒 ATUALIZAR CATEGORIA (ADMIN | SUPER)
router.put(
  "/:id",
  auth,
  requireRole("ADMIN", "SUPER"),
  controller.update
);

// 🔒 REMOVER CATEGORIA (ADMIN | SUPER)
router.delete(
  "/:id",
  auth,
  requireRole("ADMIN", "SUPER"),
  controller.remove
);

module.exports = router;
