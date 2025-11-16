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

/* 🔥 ROTAS ESPECÍFICAS ANTES DAS GENÉRICAS */
// DELETE
router.delete("/photo/:photoId", controller.remove);

// LISTAR
router.get("/user/:userId", controller.list);

// UPLOAD 1
router.post(
  "/user/:userId",
  upload.single("photo"),
  controller.create
);

// UPLOAD MULTIPLE
router.post(
  "/user/:userId/multi",
  upload.array("photos", 10),
  controller.createMany
);

// BULK
router.patch(
  "/user/:userId/bulk",
  upload.array("files", 10),
  controller.bulkUpdate
);

// UPDATE POSIÇÃO
router.patch(
  "/user/:userId/position/:position",
  upload.single("photo"),
  controller.updateByPosition
);

module.exports = router;
