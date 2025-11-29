const express = require("express");
const router = express.Router();
const upload = require("../../../utils/multerBlogAuthor");

const controller = require("./blogAuth.controller");
const { requireAdminApiKey } = require("../../../middleware/requireAdminApiKey");
const { auth, requireRole } = require("../../../middleware/auth");

/* 🔓 LOGIN */
router.post("/login", controller.login);

/* 🔵 AUTH */
router.get("/me", auth, controller.me);

/* 🔴 ADMIN / SUPER */

// ✅ CRIAR COM FOTO
router.post(
  "/admin",
  requireAdminApiKey,
  auth,
  requireRole("ADMIN", "SUPER"),
  upload.single("photo"),
  controller.create
);

// LISTAR
router.get(
  "/admin",
  requireAdminApiKey,
  auth,
  requireRole("ADMIN", "SUPER"),
  controller.list
);

// BUSCAR
router.get(
  "/admin/:id",
  requireAdminApiKey,
  auth,
  requireRole("ADMIN", "SUPER"),
  controller.getOne
);

// ✅ ATUALIZAR COM FOTO
router.put(
  "/admin/:id",
  requireAdminApiKey,
  auth,
  requireRole("ADMIN", "SUPER"),
  upload.single("photo"),
  controller.update
);

// REMOVER
router.delete(
  "/admin/:id",
  requireAdminApiKey,
  auth,
  requireRole("ADMIN", "SUPER"),
  controller.remove
);

module.exports = router;
