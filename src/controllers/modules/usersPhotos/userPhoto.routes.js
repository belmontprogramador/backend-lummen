const router = require("express").Router();
const multer = require("multer");
const path = require("path");

const controller = require("./userPhoto.controller");
const { requireApiKey } = require("../../../utils/apiAuth");
const { requireAuth } = require("../../../utils/authUser");

const upload = multer({
  dest: path.join(__dirname, "../../../uploads/photos")
});

router.use(requireApiKey);
router.use(requireAuth);

// 📌 LISTAR FOTOS DO USUÁRIO
router.get("/:userId", controller.list);

// 📌 CRIAR NOVA FOTO
router.post(
  "/:userId",
  upload.single("photo"),
  controller.create
);

// 📌 MULTIPLOS UPLOADS
router.post(
  "/:userId/multi",
  upload.array("photos", 10),
  controller.createMany
);

router.patch(
  "/:userId/bulk",
  upload.array("files", 10),
  controller.bulkUpdate
);



// 📌 ATUALIZAR FOTO POR POSIÇÃO
router.patch(
  "/:userId/:position",
  upload.single("photo"),
  controller.updateByPosition
);

// 📌 DELETAR UMA FOTO POR ID
router.delete("/:photoId", controller.remove);

module.exports = router;
