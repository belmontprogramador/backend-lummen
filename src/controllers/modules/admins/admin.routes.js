const router = require("express").Router();
const controller = require("./admin.controller");
const { auth, requireRole } = require("../../../middleware/auth"); 
const { requireAdminApiKey } = require("../../../middleware/requireAdminApiKey");


// LOGIN (sem API key)
router.post("/login", controller.login);

router.use(requireAdminApiKey);

// A partir daqui → precisa token de ADMIN
router.use(auth);

// ---------- AUTH ----------
router.get("/me", controller.me);

// ---------- CRUD ----------
router.post("/",  requireRole("SUPER"), controller.create);
router.get("/",   requireRole("SUPER", "ADMIN"), controller.list);
router.get("/:id", requireRole("SUPER", "ADMIN"), controller.getOne);
router.put("/:id", requireRole("SUPER", "ADMIN"), controller.update);
router.delete("/:id", requireRole("SUPER"), controller.remove);

module.exports = router;
