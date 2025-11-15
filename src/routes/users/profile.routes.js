const router = require("express").Router();
const controller = require("../controllers/profile.controller");
const requireAuth = require("../middlewares/requireAuth");
const validate = require("../validators/profile.validator");

// LISTAR TODOS
router.get("/", requireAuth, controller.listProfiles);

// OBTER UM
router.get("/:userId", requireAuth, controller.getProfile);

// CRIAR
router.post("/:userId", requireAuth, validate.createProfile, controller.createProfile);

// ATUALIZAR
router.put("/:userId", requireAuth, validate.updateProfile, controller.updateProfile);

// REMOVER
router.delete("/:userId", requireAuth, controller.deleteProfile);

module.exports = router;

