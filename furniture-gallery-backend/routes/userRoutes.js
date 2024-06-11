const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/authMiddleware');

module.exports = (pool) => {
    router.use(authenticateJWT);

    // Middleware để gán pool vào request
    router.use((req, res, next) => {
        req.pool = pool;
        next();
    });

    router.get('/', userController.getAllUsers);
    router.get('/:id', userController.getUserById);
    router.post('/', userController.createUser);
    router.put('/:id', userController.updateUser);
    router.delete('/:id', userController.deleteUser);

    // Thêm route cho việc cập nhật mật khẩu và thông tin cá nhân
    router.put('/:id/password', userController.updatePassword);
    router.put('/:id/profile', userController.updateProfile);

    return router;
};
