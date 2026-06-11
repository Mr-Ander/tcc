const express = require('express');
const router = express.Router();
const PlantController = require('../controllers/PlantController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, PlantController.getAll);
router.get('/:id', authMiddleware, PlantController.getById);
router.post('/', authMiddleware, PlantController.create);
router.put('/:id', authMiddleware, adminMiddleware, PlantController.updateStatus);
router.delete('/:id', authMiddleware, adminMiddleware, PlantController.delete);

module.exports = router;
