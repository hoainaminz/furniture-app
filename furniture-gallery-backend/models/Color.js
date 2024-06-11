const pool = require('../config/db');
const db = require('../config/db'); // Import kết nối tới database
const getItemsByColor = async (colorId) => {
    const [rows] = await db.query(`
        SELECT items.*
        FROM items
        JOIN item_colors ON items.id = item_colors.itemId
        WHERE item_colors.colorId = ?
    `, [colorId]);
    return rows;
};
const Color = {
    getAll: async () => {
        try {
            const [rows] = await pool.execute('SELECT * FROM colors');
            return rows;
        } catch (err) {
            throw err;
        }
    },

    getById: async (colorId) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM colors WHERE id = ?', [colorId]);
            return rows.length > 0 ? rows[0] : null;
        } catch (err) {
            throw err;
        }
    },

    create: async (name, imageUrl) => {
        try {
            const [result] = await pool.execute(
                'INSERT INTO colors (name, imageUrl) VALUES (?, ?)',
                [name, imageUrl]
            );
            return result.insertId;
        } catch (err) {
            throw err;
        }
    },

    update: async (colorId, name, imageUrl) => {
        try {
            const [result] = await pool.execute(
                'UPDATE colors SET name = ?, imageUrl = ? WHERE id = ?',
                [name, imageUrl, colorId]
            );
            return result.affectedRows;
        } catch (err) {
            throw err;
        }
    },

    delete: async (colorId) => {
        try {
            const [result] = await pool.execute('DELETE FROM colors WHERE id = ?', [colorId]);
            return result.affectedRows;
        } catch (err) {
            throw err;
        }
    },
    addColorToItem: async (itemId, colorId) => {
        try {
            const [existingRows] = await pool.execute(
                'SELECT * FROM item_colors WHERE itemId = ? AND colorId = ?',
                [itemId, colorId]
            );
            if (existingRows.length > 0) {
                throw new Error('Mã màu đã được gán cho sản phẩm');
            }
            await pool.execute('INSERT INTO item_colors (itemId, colorId) VALUES (?, ?)', [itemId, colorId]);
        } catch (err) {
            throw err;
        }
    },
    getItemsByColor,
};

module.exports = Color;
