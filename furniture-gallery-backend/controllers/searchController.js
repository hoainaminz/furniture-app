// controllers/searchController.js
const pool = require('../config/db');

const searchItems = async (req, res) => {
    try {
        const { keyword, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        if (!keyword) {
            return res.status(400).json({ message: 'Keyword is required' });
        }

        const [rows] = await pool.query(
            `SELECT items.*, item_images.imageUrl 
             FROM items 
             LEFT JOIN item_images ON items.id = item_images.itemId
             WHERE MATCH (items.name, items.description) AGAINST (?) AND items.pending = 0
             LIMIT ? OFFSET ?`,
            [keyword, parseInt(limit), parseInt(offset)]
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
