const pool = require('../config/db');
const db = require("../config/db");
// const getItemsByDesignStyle = async (designStyleId) => {
//     const [rows] = await db.query(`
//         SELECT items.*
//         FROM items
//         JOIN item_design_styles ON items.id = item_design_styles.itemId
//         WHERE item_design_styles.designStyleId = ?
//     `, [designStyleId]);
//     return rows;
// };
const DesignStyle = {
    getAll: async () => {
        try {
            const [rows] = await pool.execute('SELECT * FROM design_styles');
            return rows;
        } catch (err) {
            throw err;
        }
    },

    getById: async (designStyleId) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM design_styles WHERE id = ?', [designStyleId]);
            return rows.length > 0 ? rows[0] : null;
        } catch (err) {
            throw err;
        }
    },

    create: async (name, imageUrl) => {
        try {
            const [result] = await pool.execute(
                'INSERT INTO design_styles (name, imageUrl) VALUES (?, ?)',
                [name, imageUrl]
            );
            return result.insertId;
        } catch (err) {
            throw err;
        }
    },

    update: async (designStyleId, name, imageUrl) => {
        try {
            const [result] = await pool.execute(
                'UPDATE design_styles SET name = ?, imageUrl = ? WHERE id = ?',
                [name, imageUrl, designStyleId]
            );
            return result.affectedRows;
        } catch (err) {
            throw err;
        }
    },

    delete: async (designStyleId) => {
        try {
            const [result] = await pool.execute('DELETE FROM design_styles WHERE id = ?', [designStyleId]);
            return result.affectedRows;
        } catch (err) {
            throw err;
        }
    },

    addDesignStyleToItem: async (itemId, designStyleId) => {
        try {
            const [existingRows] = await pool.execute('SELECT * FROM item_design_styles WHERE itemId = ? AND designStyleId = ?', [itemId, designStyleId]);
            if (existingRows.length > 0) {
                throw new Error('Design style already assigned to item');
            }
            await pool.execute('INSERT INTO item_design_styles (itemId, designStyleId) VALUES (?, ?)', [itemId, designStyleId]);
        } catch (err) {
            throw err;
        }
    },
    getItemsByDesignStyle: async (designStyleId, page, limit) => { // Nhận page và limit
        try {
            const offset = (page - 1) * limit;
            const [rows] = await db.query(
                `SELECT i.* 
       FROM items i
       JOIN item_design_styles ic ON i.id = ic.itemId
       WHERE ic.designStyleId = ? AND i.pending = 0
       LIMIT ? OFFSET ?`,
                [designStyleId, limit, offset]
            );
            return rows;
        } catch (err) {
            throw err;
        }
    },
};

module.exports = DesignStyle;
