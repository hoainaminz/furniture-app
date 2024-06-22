// controllers/searchController.js
const pool = require('../config/db');

const searchItems = async (req, res) => {
    try {
        const { keyword } = req.query;
        if (!keyword) {
            return res.status(400).json({ message: 'Keyword is required' });
        }

        const [rows] = await pool.query(
            `SELECT * FROM items WHERE name LIKE ? OR description LIKE ?`,
            [`%${keyword}%`, `%${keyword}%`]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No items found' });
        }

        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { searchItems };
