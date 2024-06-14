const express = require('express');
const router = express.Router();
const designStyleController = require('../controllers/designStyleController');
const { authenticateJWT } = require('../middleware/authMiddleware');

module.exports = (pool) => {
    router.use(authenticateJWT);

    // Middleware để gán pool vào request
    router.use((req, res, next) => {
        req.pool = pool;
        next();
    });

    // Route CRUD
    router.get('/', designStyleController.getAllDesignStyles);
    router.get('/:id', designStyleController.getDesignStyleById);
    router.post('/', designStyleController.createDesignStyle);
    router.put('/:id', designStyleController.updateDesignStyle);
    router.delete('/:id', designStyleController.deleteDesignStyle);

    // Route gán DesignStyle cho Item
    router.post('/addDesignStyle', designStyleController.addDesignStyleToItem);
    router.get('/:designStyleId/items', designStyleController.getItemsByDesignStyle);
    return router;
};
