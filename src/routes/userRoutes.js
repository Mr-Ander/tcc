const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

router.post('/cadastro', UserController.register);
router.post('/login', UserController.login);

router.get('/admins', authMiddleware, adminMiddleware, UserController.getAdmins);
router.post('/admins', authMiddleware, adminMiddleware, UserController.addAdmin);
router.delete('/admins/:id', authMiddleware, adminMiddleware, UserController.removeAdmin);

module.exports = router;
