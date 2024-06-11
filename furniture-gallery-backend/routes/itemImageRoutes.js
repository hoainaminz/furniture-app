const express = require('express');
const router = express.Router();
const itemImageController = require('../controllers/itemImageController');
const { authenticateJWT } = require('../middleware/authMiddleware');

module.exports = (pool) => {
    router.use(authenticateJWT);

    // Middleware để gán pool vào request
    router.use((req, res, next) => {
        req.pool = pool;
        next();
    });

    // Route CRUD cho ItemImage
    router.get('/', itemImageController.getAllItemImages);
    router.get('/:itemId', itemImageController.getItemImagesByItemId);
    router.post('/', itemImageController.createItemImage);
    router.delete('/:id', itemImageController.deleteItemImage);

    return router;
};
