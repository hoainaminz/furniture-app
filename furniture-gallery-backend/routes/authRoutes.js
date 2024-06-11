const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middleware/upload');

module.exports = (pool) => {
    // Đảm bảo sử dụng middleware để truyền pool
    // router.post('/register', (req, res) => authController.register(req, res, pool));
    // router.post('/login', (req, res) => authController.login(req, res, pool));

    // router.post('/register', authController.register);
    // router.post('/login', authController.login);
    router.post('/register', upload.single('avatar'), authController.register);
    router.post('/login', authController.login);
    return router;
};
