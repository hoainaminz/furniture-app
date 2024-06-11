const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const logger = require('../config/logger');

exports.register = [
    // Kiểm tra và xác thực các trường nhập vào
    check('username').notEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('phone').notEmpty().withMessage('Phone number is required'),
    check('address').notEmpty().withMessage('Address is required'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password, phone, address } = req.body;
        const avatar = req.file ? req.file.path : '';
        const roleId = req.body.roleId || 2;

        logger.info('Register request received:', { username, email, password, phone, address, avatar, roleId });

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
                User.create({ username, email, password: hash, phone, address, avatar, roleId }, (err, userId) => {
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
    // Kiểm tra và xác thực các trường nhập vào
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

            const token = jwt.sign({ userId: user.id, isAdmin: user.roleId === 1 }, process.env.JWT_SECRET || 'your_jwt_secret', {
                expiresIn: '1d',
            });

            logger.info('Login successful, token generated');
            res.json({
                token,
                username: user.username,
                roleId: user.roleId
            });

        } catch (err) {
            logger.error('Error during login:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }
];
