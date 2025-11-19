const router = require("express").Router();
const controller = require("./admin.controller");
const { auth, requireRole } = require("../../../middleware/auth");
const { requireApiKey } = require("../../../middleware/apiAuth");

// ⚠️ Somente rotas privadas usam API KEY
router.post("/login", controller.login);   // 👈 LOGIN sem API key

// 🔐 Daqui para frente exige API KEY
router.use(requireApiKey);

// ---------- AUTH ----------
router.get("/me", auth, controller.me);

// ---------- CRUD ----------
router.post("/", auth, requireRole("SUPER"), controller.create);
router.get("/", auth, requireRole("SUPER", "ADMIN"), controller.list);
router.get("/:id", auth, requireRole("SUPER", "ADMIN"), controller.getOne);
router.put("/:id", auth, requireRole("SUPER", "ADMIN"), controller.update);
router.delete("/:id", auth, requireRole("SUPER"), controller.remove);

module.exports = router;
