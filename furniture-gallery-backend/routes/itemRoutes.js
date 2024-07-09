const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

module.exports = (pool) => {
    // Middleware xác thực
    router.use(authenticateJWT);

    // Gán pool vào request
    router.use((req, res, next) => {
        req.pool = pool;
        next();
    });

    // Các route hiện có
    router.get('/', itemController.getAllItems);
    router.get('/:id', itemController.getItemById);
    router.post('/items', upload.array('images', 10), itemController.createItem);
    router.post('/', upload.array('images', 10), itemController.createItem);
    router.put('/:id', upload.array('images', 10), itemController.updateItem);
    router.delete('/:id', itemController.deleteItem);
    router.get('/latest', itemController.getLatestItems);
    router.get('/:id/images', itemController.getItemImages);
    router.get('/:id/brand', itemController.getItemBrand);
    router.get('/:id/roomType', itemController.getItemRoomType);
    router.get('/:id/designStyle', itemController.getItemDesignStyle);
    router.get('/:id/related', itemController.getRelatedItems);
    router.get('/:id/colors', itemController.getItemColors);
    router.get('/user/:userId/items', authenticateJWT, itemController.getUserItems);

    return router;
};
