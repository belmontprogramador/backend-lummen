const express = require("express");
const router = express.Router();

const controller = require("./messages.controller");

const { requireAuth } = require("../../../middleware/authUser");
const { requireApiKey } = require("../../../middleware/apiAuth");
const dynamicRoute = require("../../../middleware/dynamicRoute");

// 🔧 IMPORTAR MULTER CORRETO
const upload = require("../../../utils/multerChat");

// 🔐 API KEY + AUTH
router.use(requireApiKey);
router.use(requireAuth);

// ===============================================
// 📩 HISTÓRICO ENTRE DOIS USUÁRIOS
// ===============================================
router.get(
  "/:otherUserId",
  dynamicRoute("messages_list"),
  controller.list
);

// ===============================================
// ✉️ ENVIAR MENSAGEM DE TEXTO/IMAGEM (JÁ COM URL)
// ===============================================
router.post(
  "/",
  dynamicRoute("messages_send"),
  controller.send
);

// ===============================================
// 📤 UPLOAD DE ARQUIVO DO CHAT
// ===============================================
router.post(
  "/upload",
  upload.single("file"),
  async (req, res) => {
    console.log("🟦 REQ FILE:", req.file);
console.log("🟧 REQ BODY:", req.body);
console.log("🟨 REQ HEADERS:", req.headers["content-type"]);

    if (!req.file) {
      return res.status(400).json({ error: "Arquivo não enviado" });
    }

    return res.json({
      url: "/uploads/chat/" + req.file.filename,
    });
  }
);

module.exports = router;
