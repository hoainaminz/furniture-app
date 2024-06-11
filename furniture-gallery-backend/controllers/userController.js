const User = require('../models/User');
const logger = require('../config/logger');
const bcrypt = require('bcryptjs'); // Thêm dòng này để import bcry

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.json(users);
    } catch (err) {
        logger.error('Error fetching users:', err);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;
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

exports.createUser = async (req, res) => {
    const { username, email, password, phone, address, avatar } = req.body;

    logger.info('Create user request received:', { username, email, password, phone, address, avatar });

    if (!username || !email || !password) {
        logger.warn('Missing fields');
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin người dùng' });
    }

    try {
        const userId = await User.create(username, email, password, phone, address, avatar);
        logger.info('User created with ID:', userId);
        res.status(201).json({ message: 'User created', userId });
    } catch (err) {
        logger.error('Error creating user:', err);
        res.status(500).json({ message: 'Error creating user' });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password, phone, address, avatar } = req.body;

    logger.info('Update user request received:', { id, username, email, password, phone, address, avatar });

    if (!username || !email || !password) {
        logger.warn('Missing fields');
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin người dùng' });
    }

    try {
        const affectedRows = await User.update(id, username, email, password, phone, address, avatar);
        if (affectedRows > 0) {
            logger.info('User updated with ID:', id);
            res.status(200).json({ message: 'User updated' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        logger.error('Error updating user:', err);
        res.status(500).json({ message: 'Error updating user' });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    logger.info('Delete user request received:', { id });

    try {
        const affectedRows = await User.delete(id);
        if (affectedRows > 0) {
            logger.info('User deleted with ID:', id);
            res.status(200).json({ message: 'User deleted' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        logger.error('Error deleting user:', err);
        res.status(500).json({ message: 'Error deleting user' });
    }
};
exports.updatePassword = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    logger.info('Update password request received:', { id });

    if (!password) {
        logger.warn('Missing fields');
        return res.status(400).json({ message: 'Vui lòng cung cấp mật khẩu mới' });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        const affectedRows = await User.updatePassword(id, hash);
        if (affectedRows > 0) {
            logger.info('Password updated for user ID:', id);
            res.status(200).json({ message: 'Password updated' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        logger.error('Error updating password:', err);
        res.status(500).json({ message: 'Error updating password' });
    }
};

exports.updateProfile = async (req, res) => {
    const { id } = req.params;
    const { email, phone, address, avatar } = req.body;

    logger.info('Update profile request received:', { id });

    if (!email || !phone || !address || !avatar) {
        logger.warn('Missing fields');
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    try {
        const affectedRows = await User.updateProfile(id, email, phone, address, avatar);
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
};