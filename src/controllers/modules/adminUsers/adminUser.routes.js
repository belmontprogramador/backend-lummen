const router = require("express").Router();
const controller = require("./adminUser.controller");

const { auth, requireRole } = require("../../../middleware/auth");
const { requireAdminApiKey } = require("../../../middleware/requireAdminApiKey");

// 🔐 API KEY do painel
router.use(requireAdminApiKey);

// 🔐 Autenticação admin (token)
router.use(auth);

// ---------- ROTAS ----------

// LISTAR USERS
router.get("/", requireRole("SUPER", "ADMIN"), controller.list);

// BUSCAR 1 USER
router.get("/:id", requireRole("SUPER", "ADMIN"), controller.getOne);

// ATUALIZAR USER
router.put("/:id", requireRole("SUPER", "ADMIN"), controller.update);

// DELETAR USER
router.delete("/:id", requireRole("SUPER"), controller.remove);

module.exports = router;
