const express = require('express');
const router = express.Router();
const roomTypeController = require('../controllers/roomTypeController');
const { authenticateJWT } = require('../middleware/authMiddleware');

module.exports = (pool) => {
    router.use(authenticateJWT);

    // Middleware để gán pool vào request
    router.use((req, res, next) => {
        req.pool = pool;
        next();
    });

    // Route CRUD
    router.get('/', roomTypeController.getAllRoomTypes);
    router.get('/:id', roomTypeController.getRoomTypeById);
    router.post('/', roomTypeController.createRoomType);
    router.put('/:id', roomTypeController.updateRoomType);
    router.delete('/:id', roomTypeController.deleteRoomType);

    // Route gán RoomType cho Item
    router.post('/addRoomtype', roomTypeController.addRoomTypeToItem);
    router.get('/:roomTypeId/items', roomTypeController.getItemsByRoomType);
    return router;
};
