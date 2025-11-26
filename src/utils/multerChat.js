const multer = require("multer");
const path = require("path");

// salvando em: src/uploads/chat
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("src", "uploads", "chat"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  },
});

module.exports = multer({ storage });
