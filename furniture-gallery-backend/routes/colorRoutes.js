// const express = require('express');
// const router = express.Router();
// const colorController = require('../controllers/colorController');
//
// module.exports = (pool) => {
//     router.get('/', (req, res) => colorController.getAllColors(req, res, req.pool));
//     router.post('/', (req, res) => colorController.createColor(req, res, req.pool));
//     router.get('/:id', (req, res) => colorController.getColorById(req, res, req.pool));
//     router.put('/:id', (req, res) => colorController.updateColor(req, res, req.pool));
//     router.delete('/:id', (req, res) => colorController.deleteColor(req, res, req.pool));
//
//     router.use((req, res, next) => {
//         req.pool = pool;
//         next();
//     });
//
//     return router;
// };
const express = require('express');
const router = express.Router();
const colorController = require('../controllers/colorController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const brandController = require("../controllers/brandController");

// Middleware xác thực
router.use(authenticateJWT);

// Route CRUD
router.get('/', colorController.getAllColors);
router.get('/:id', colorController.getColorById);
router.post('/', colorController.createColor);
router.put('/:id', colorController.updateColor);
router.delete('/:id', colorController.deleteColor);
router.post('/addColor', colorController.addColorToItem);
router.get('/:colorId/items', colorController.getItemsByColor);

module.exports = router;

