const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/CommentController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

router.get('/:plantaId', authMiddleware, CommentController.getByPlantId);
router.post('/', authMiddleware, CommentController.create);
router.delete('/:id', authMiddleware, adminMiddleware, CommentController.delete);

module.exports = router;
