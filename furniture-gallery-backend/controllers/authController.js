const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const logger = require('../config/logger');
const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

exports.register = [
    upload.single('avatar'),

    check('username').notEmpty().withMessage('Username is required'),
    check('fullName').notEmpty().withMessage('Full name is required'),
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('phone').notEmpty().withMessage('Phone number is required'),
    check('address').notEmpty().withMessage('Address is required'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, fullName, email, password, phone, address } = req.body;
        const avatar = 'default_avatar.jpg'; // default avatar
        const roleId = req.body.roleId || 2;

        logger.info('Register request received:', { username, fullName, email, password, phone, address, avatar, roleId });

        try {
            const existingUser = await new Promise((resolve, reject) => {
                User.findByUsername(username, (err, user) => {
                    if (err) return reject(err);
                    resolve(user);
                });
            });

            if (existingUser) {
                logger.warn('Username already exists');
                return res.status(400).json({ message: 'Username already exists' });
            }

            const hash = await bcrypt.hash(password, 10);

            await new Promise((resolve, reject) => {
                User.create({ username, fullName, email, password: hash, phone, address, avatar, roleId }, (err, userId) => {
                    if (err) return reject(err);
                    resolve(userId);
                });
            });

            logger.info('User created:', username);
            res.status(201).json({ message: 'User created' });

        } catch (err) {
            logger.error('Error during registration:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }
];

exports.login = [
    check('username').notEmpty().withMessage('Username is required'),
    check('password').notEmpty().withMessage('Password is required'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        logger.info('Login request received:', { username, password });

        try {
            const user = await new Promise((resolve, reject) => {
                User.findByUsername(username, (err, user) => {
                    if (err) return reject(err);
                    resolve(user);
                });
            });

            if (!user) {
                logger.warn('Invalid credentials - user not found');
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                logger.warn('Invalid credentials - password mismatch');
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user.id, isAdmin: user.roleId === 1, fullName: user.fullName }, process.env.JWT_SECRET || 'your_jwt_secret', {
                expiresIn: '1d',
            });

            logger.info('Login successful, token generated');
            res.json({
                token,
                username: user.username,
                fullName: user.fullName,
                roleId: user.roleId
            });

        } catch (err) {
            logger.error('Error during login:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }
];

exports.getMe = async (req, res) => {
    const { id } = req.user;
    try {
        const user = await User.getById(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        logger.error('Error fetching user:', err);
        res.status(500).json({ message: 'Error fetching user' });
    }
};

exports.updateProfile = [
    upload.single('avatar'),

    async (req, res) => {
        const { id } = req.user;
        const { fullName, email, phone, address } = req.body;
        const avatar = req.file ? req.file.filename : 'default_avatar.jpg';

        logger.info('Update profile request received:', { id });

        if (!fullName || !email || !phone || !address) {
            logger.warn('Missing fields');
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin' });
        }

        try {
            const affectedRows = await User.updateProfile(id, fullName, email, phone, address, avatar);
            if (affectedRows > 0) {
                logger.info('Profile updated for user ID:', id);
                res.status(200).json({ message: 'Profile updated' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (err) {
            logger.error('Error updating profile:', err);
            res.status(500).json({ message: 'Error updating profile' });
        }
    }
];

exports.changePassword = async (req, res) => {
    const { id } = req.user;
    const { currentPassword, newPassword } = req.body;

    logger.info('Change password request received:', { id });

    if (!currentPassword || !newPassword) {
        logger.warn('Missing fields');
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    try {
        const user = await User.getById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        const hash = await bcrypt.hash(newPassword, 10);
        const affectedRows = await User.updatePassword(id, hash);
        if (affectedRows > 0) {
            logger.info('Password updated for user ID:', id);
            res.status(200).json({ message: 'Password updated' });
        } else {
            res.status(500).json({ message: 'Error updating password' });
        }
    } catch (err) {
        logger.error('Error updating password:', err);
        res.status(500).json({ message: 'Error updating password' });
    }
};
