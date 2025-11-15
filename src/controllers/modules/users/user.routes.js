// src/modules/users/user.routes.js
const router = require("express").Router();
const multer = require("multer");
const path = require("path");   //  ✅ ADICIONAR ISTO
const controller = require("./user.controllers");
const { requireAuth } = require("../../../utils/authUser");


const upload = multer({
  dest: path.join(__dirname, "../../../uploads/users") // CA-MI-NHO CERTO!
});

router.post("/", upload.single("photo"), controller.create);
router.post("/login", controller.login);
router.get("/", requireAuth, controller.list);
router.get("/:id", requireAuth, controller.getOne);
router.patch("/:id", requireAuth, upload.single("photo"), controller.update);
router.delete("/:id", requireAuth, controller.remove);
router.post("/change-password", requireAuth, controller.changePassword);


// 🔄 Webhook para marcar usuário como pago
router.post("/paid/webhook", controller.setPaidWebhook);

// 🔒 Atualizar senha do usuário logado
router.post("/update-password", requireAuth, controller.updatePassword);

// 🧠 Solicitar redefinição (envia e-mail)
router.post("/forgot-password", controller.forgotPassword);

// 🔑 Redefinir senha com token
router.post("/reset-password", controller.resetPassword);

module.exports = router;
