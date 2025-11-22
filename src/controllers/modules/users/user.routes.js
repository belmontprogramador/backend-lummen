// src/modules/users/user.routes.js
const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const controller = require("./user.controllers");
const { requireApiKey } = require("../../../middleware/apiAuth");
const { requireAuth } = require("../../../middleware/authUser");

const upload = multer({
  dest: path.join(__dirname, "../../../uploads/users")
});

router.post("/login", controller.login);

router.use(requireApiKey);

// ---------- ROTAS PRINCIPAIS ----------
router.post("/", upload.single("photo"), controller.create);


router.get("/", requireAuth, controller.list);
router.get("/me", requireAuth, controller.me);
router.get("/:id", requireAuth, controller.getOne);

// UPDATE SIMPLIFICADO — apenas foto e campos do User
router.patch("/:id", requireAuth, upload.single("photo"), controller.update);

router.delete("/:id", requireAuth, controller.remove);


// Senha do usuário logado
router.post("/update-password", requireAuth, controller.updatePassword);
router.post("/change-password", requireAuth, controller.changePassword);

module.exports = router;
