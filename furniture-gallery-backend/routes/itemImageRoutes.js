const express = require('express');
const router = express.Router();
const itemImageController = require('../controllers/itemImageController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { deleteUnusedImages } = require('../scripts/deleteUnusedImages');

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
    router.delete('/unused', async (req, res) => {
        try {
            await deleteUnusedImages();
            res.status(200).json({ message: 'Đã xoá thành công các hình ảnh không sử dụng!' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi khi xoá hình ảnh không sử dụng.' });
        }
    });
    return router;
};
