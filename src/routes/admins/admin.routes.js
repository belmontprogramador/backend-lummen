const express = require('express');
const router = express.Router();
const admin = require('../../controllers/admins/admin.controller');
const { auth, requireRole } = require('../../utils/auth');
const { requireApiKey } = require('../../utils/apiAuth'); 

router.use(requireApiKey);

// Auth
router.post('/login', admin.login);
router.get('/me', auth, admin.me);

// CRUD (apenas SUPER pode criar/deletar; ADMIN pode listar/editar)
router.post('/',    auth, requireRole('SUPER'), admin.create);
router.get('/',     auth, requireRole('SUPER', 'ADMIN'), admin.list);
router.get('/:id',  auth, requireRole('SUPER', 'ADMIN'), admin.getOne);
router.put('/:id',  auth, requireRole('SUPER', 'ADMIN'), admin.update);
router.delete('/:id', auth, requireRole('SUPER'), admin.remove);

module.exports = router;
