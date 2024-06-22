const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
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

exports.getProfile = async (req, res) => {
    const userId = req.user.userId;

    try {
        const [results] = await pool.execute('SELECT username, fullName, email, phone, address, avatar FROM users WHERE id = ?', [userId]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(results[0]);
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProfile = [
    upload.single('avatar'),
    async (req, res) => {
        const userId = req.user.userId;
        const { fullName, phone, address } = req.body;
        let avatar = req.file ? req.file.filename : null;

        try {
            const [existingUser] = await pool.execute('SELECT avatar FROM users WHERE id = ?', [userId]);

            if (existingUser.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            avatar = avatar || existingUser[0].avatar;

            await pool.execute('UPDATE users SET fullName = ?, phone = ?, address = ?, avatar = ? WHERE id = ?', [fullName, phone, address, avatar, userId]);

            res.json({ message: 'Profile updated successfully' });
        } catch (err) {
            console.error('Error updating profile:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }
];

exports.changePassword = async (req, res) => {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    try {
        const [results] = await pool.execute('SELECT password FROM users WHERE id = ?', [userId]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, results[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Old password is incorrect' });
        }

        const hash = await bcrypt.hash(newPassword, 10);
        await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hash, userId]);

        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error('Error changing password:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
