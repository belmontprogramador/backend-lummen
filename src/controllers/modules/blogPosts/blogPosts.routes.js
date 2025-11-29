const express = require("express");
const router = express.Router();

const controller = require("./blogPosts.controller");
const upload = require("../../../utils/multerBlog");

const { auth, requireRole } = require("../../../middleware/auth");
const { requireAdminApiKey } = require("../../../middleware/requireAdminApiKey");

// 🔓 PÚBLICO — LISTAR POSTS (COM PAGINAÇÃO)
router.get("/", controller.list);

// 🔒 LISTAR POSTS DO AUTOR LOGADO
// 🔑 EXIGE: API KEY + JWT + ROLE
router.get(
  "/me",
  requireAdminApiKey,
  auth,
  requireRole("AUTHOR", "ADMIN", "SUPER"),
  controller.listMine
);

// 🔓 PÚBLICO — BUSCAR POST POR ID
router.get("/:id", controller.getOne);

// 🔓 PÚBLICO — LISTAR POSTS POR CATEGORIA (slug ou id)
router.get("/category/:value", controller.listByCategory);


// 🔒 CRIAR POST — AUTHOR | ADMIN | SUPER
// 🔑 EXIGE: API KEY + JWT + ROLE
router.post(
  "/",
  requireAdminApiKey,
  auth,
  requireRole("AUTHOR", "ADMIN", "SUPER"),
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  controller.create
);

// 🔒 ATUALIZAR POST — AUTHOR | ADMIN | SUPER
// 🔑 EXIGE: API KEY + JWT + ROLE
router.put(
  "/:id",
  requireAdminApiKey,
  auth,
  requireRole("AUTHOR", "ADMIN", "SUPER"),
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  controller.update
);

// 🔒 DELETE POST — AUTHOR | ADMIN | SUPER
// 🔑 EXIGE: API KEY + JWT + ROLE
router.delete(
  "/:id",
  requireAdminApiKey,
  auth,
  requireRole("AUTHOR", "ADMIN", "SUPER"),
  controller.remove
);

module.exports = router;
