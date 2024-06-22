const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

module.exports = (pool) => {
    router.post('/register', authController.register);
    router.post('/login', authController.login);
    return router;
};