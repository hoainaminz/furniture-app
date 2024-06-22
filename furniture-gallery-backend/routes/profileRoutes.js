const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/me', authMiddleware.authenticateJWT, profileController.getProfile);
router.put('/update', authMiddleware.authenticateJWT, profileController.updateProfile);
router.put('/change-password', authMiddleware.authenticateJWT, profileController.changePassword);

module.exports = router;
