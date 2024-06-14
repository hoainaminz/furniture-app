const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { authenticateJWT } = require('../middleware/authMiddleware');

module.exports = (pool) => {
    router.use(authenticateJWT);

    router.use((req, res, next) => {
        req.pool = pool;
        next();
    });

    router.get('/', brandController.getAllBrand);
    router.get('/:id', brandController.getBrandById);
    router.post('/', brandController.createBrand);
    router.put('/:id', brandController.updateBrand);
    router.delete('/:id', brandController.deleteBrand);

    // Gán nhãn hiệu cho sản phẩm
    router.post('/addBrand', brandController.addBrandToItem);
    router.get('/:brandId/items', brandController.getItemsByBrand);

    return router;
};
