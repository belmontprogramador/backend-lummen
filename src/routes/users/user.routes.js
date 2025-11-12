// src/routes/users/user.routes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ctrl = require('../../controllers/users/user.controller');
const { requireAuth } = require('../../utils/authUser');
const { requireApiKey } = require('../../utils/apiAuth'); 

const router = express.Router();

router.use(requireApiKey);

// pasta física: <projeto>/src/uploads/users
const uploadDir = path.join(__dirname, '../../uploads/users');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// storage simples
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

// aceita só imagens comuns
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error('Tipo de arquivo inválido. Envie JPG, PNG ou WEBP.'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
});

// públicas
router.post('/', upload.single('photo'), ctrl.create);
router.post('/login', ctrl.login);

// protegidas
router.get('/', requireAuth, ctrl.list);
router.get('/:id', requireAuth, ctrl.getOne);
router.patch('/:id', requireAuth, upload.single('photo'), ctrl.update);
router.delete('/:id', requireAuth, ctrl.remove);
router.patch('/:id/status', requireAuth, ctrl.setStatus);
router.patch('/:id/paid', requireAuth, ctrl.setPaidWebhook);
// router.post('/send-email', requireAuth, ctrl.sendEmailToLoggedUser);
router.post('/forgot-password', ctrl.forgotPassword);  
router.post('/reset-password', ctrl.resetPassword);

module.exports = router;
