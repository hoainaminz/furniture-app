const express = require('express');
const router = express.Router();
const colorController = require('../controllers/colorController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Middleware xác thực
router.use(authenticateJWT);

// Route CRUD
router.get('/', colorController.getAllColors);
router.get('/:id', colorController.getColorById);
router.post('/', upload.single('image'), colorController.createColor);
router.put('/:id', upload.single('image'), colorController.updateColor);
router.delete('/:id', colorController.deleteColor);
router.post('/addColor', colorController.addColorToItem);
router.get('/:colorId/items', colorController.getItemsByColor);

module.exports = router;
