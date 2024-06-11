const pool = require('../config/db');

const ItemImage = {
    getAll: async () => {
        try {
            const [rows] = await pool.execute('SELECT * FROM item_images');
            return rows;
        } catch (err) {
            throw err;
        }
    },

    getByItemId: async (itemId) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM item_images WHERE itemId = ?', [itemId]);
            return rows;
        } catch (err) {
            throw err;
        }
    },

    create: async (itemId, imageUrl) => {
        try {
            const [result] = await pool.execute(
                'INSERT INTO item_images (itemId, imageUrl) VALUES (?, ?)',
                [itemId, imageUrl]
            );
            return result.insertId;
        } catch (err) {
            throw err;
        }
    },

    delete: async (id) => {
        try {
            const [result] = await pool.execute('DELETE FROM item_images WHERE id = ?', [id]);
            return result.affectedRows;
        } catch (err) {
            throw err;
        }
    }
};

module.exports = ItemImage;
