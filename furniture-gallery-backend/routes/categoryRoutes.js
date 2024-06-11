const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateJWT } = require('../middleware/authMiddleware');

module.exports = (pool) => {
    router.use(authenticateJWT);

    // Middleware để gán pool vào request
    router.use((req, res, next) => {
        req.pool = pool;
        next();
    });

    // Route CRUD
    router.get('/', categoryController.getAllCategories);
    router.get('/:id', categoryController.getCategoryById);
    router.post('/', categoryController.createCategory);
    router.put('/:id', categoryController.updateCategory);
    router.delete('/:id', categoryController.deleteCategory);
    router.get('/:categoryId/items', categoryController.getItemsByCategory);
    return router;
};
