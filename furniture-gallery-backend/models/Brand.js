const pool = require('../config/db');
const db = require("../config/db");
// const getItemsByBrand = async (brandId) => {
//     const [rows] = await db.query(`
//         SELECT items.*
//         FROM items
//         JOIN item_brands ON items.id = item_brands.itemId
//         WHERE item_brands.brandId = ?
//     `, [brandId]);
//     return rows;
// };
const Brand = {
    getAll: async () => {
        try {
            const [rows] = await pool.execute('SELECT * FROM brands');
            return rows;
        } catch (err) {
            throw err;
        }
    },

    getById: async (brandId) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM brands WHERE id = ?', [brandId]);
            return rows.length > 0 ? rows[0] : null;
        } catch (err) {
            throw err;
        }
    },

    create: async (name, imageUrl) => {
        try {
            const [result] = await pool.execute(
                'INSERT INTO brands (name, imageUrl) VALUES (?, ?)',
                [name, imageUrl]
            );
            return result.insertId;
        } catch (err) {
            throw err;
        }
    },

    update: async (brandId, name, imageUrl) => {
        try {
            const [result] = await pool.execute(
                'UPDATE brands SET name = ?, imageUrl = ? WHERE id = ?',
                [name, imageUrl, brandId]
            );
            return result.affectedRows;
        } catch (err) {
            throw err;
        }
    },

    delete: async (brandId) => {
        try {
            const [result] = await pool.execute('DELETE FROM brands WHERE id = ?', [brandId]);
            return result.affectedRows;
        } catch (err) {
            throw err;
        }
    },

    addBrandToItem: async (itemId, brandId) => {
        try {
            const [existingRows] = await pool.execute(
                'SELECT * FROM item_brands WHERE itemId = ? AND brandId = ?',
                [itemId, brandId]
            );
            if (existingRows.length > 0) {
                throw new Error('Nhãn hiệu đã được gán cho sản phẩm');
            }
            await pool.execute('INSERT INTO item_brands (itemId, brandId) VALUES (?, ?)', [itemId, brandId]);
        } catch (err) {
            throw err;
        }
    },
    // getItemsByBrand,
    getItemsByBrand: async (brandId, page, limit) => { // Nhận page và limit
        try {
            const offset = (page - 1) * limit;
            const [rows] = await db.query(
                `SELECT i.* 
       FROM items i
       JOIN item_brands ic ON i.id = ic.itemId
       WHERE ic.brandId = ?
       LIMIT ? OFFSET ?`,
                [brandId, limit, offset]
            );
            return rows;
        } catch (err) {
            throw err;
        }
    },
};

module.exports = Brand;
