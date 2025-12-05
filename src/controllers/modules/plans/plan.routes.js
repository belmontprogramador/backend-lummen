const router = require("express").Router();
const controller = require("./plan.controller");
const { auth, requireRole } = require("../../../middleware/auth");

// Rota pública do app
router.get("/public", controller.getPublicPlans);

// LISTAR ROTAS (para UI)
router.get("/routes/all", auth, requireRole("SUPER", "ADMIN"), controller.listRoutes);

// CRUD admin
router.post("/", auth, requireRole("SUPER"), controller.create);
router.get("/",  controller.list);
router.get("/:id", auth, requireRole("SUPER", "ADMIN"), controller.getOne);
router.put("/:id", auth, requireRole("SUPER", "ADMIN"), controller.update);
router.delete("/:id", auth, requireRole("SUPER"), controller.remove);

module.exports = router;
