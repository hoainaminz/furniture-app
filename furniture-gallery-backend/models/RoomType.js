const pool = require('../config/db');
const db = require("../config/db");
// const getItemsByRoomType = async (roomTypeId) => {
//     const [rows] = await db.query(`
//         SELECT items.*
//         FROM items
//         JOIN item_room_types ON items.id = item_room_types.itemId
//         WHERE item_room_types.roomTypeId = ?
//     `, [roomTypeId]);
//     return rows;
// };
const RoomType = {
    getAll: async () => {
        try {
            const [rows] = await pool.execute('SELECT * FROM room_types');
            return rows;
        } catch (err) {
            throw err;
        }
    },

    getById: async (roomTypeId) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM room_types WHERE id = ?', [roomTypeId]);
            return rows.length > 0 ? rows[0] : null;
        } catch (err) {
            throw err;
        }
    },

    create: async (name, imageUrl) => {
        try {
            const [result] = await pool.execute(
                'INSERT INTO room_types (name, imageUrl) VALUES (?, ?)',
                [name, imageUrl]
            );
            return result.insertId;
        } catch (err) {
            throw err;
        }
    },

    update: async (roomTypeId, name, imageUrl) => {
        try {
            const [result] = await pool.execute(
                'UPDATE room_types SET name = ?, imageUrl = ? WHERE id = ?',
                [name, imageUrl, roomTypeId]
            );
            return result.affectedRows;
        } catch (err) {
            throw err;
        }
    },

    delete: async (roomTypeId) => {
        try {
            const [result] = await pool.execute('DELETE FROM room_types WHERE id = ?', [roomTypeId]);
            return result.affectedRows;
        } catch (err) {
            throw err;
        }
    },

    addRoomTypeToItem: async (itemId, roomTypeId) => {
        try {
            const [existingRows] = await pool.execute('SELECT * FROM item_room_types WHERE itemId = ? AND roomTypeId = ?', [itemId, roomTypeId]);
            if (existingRows.length > 0) {
                throw new Error('Room type already assigned to item');
            }
            await pool.execute('INSERT INTO item_room_types (itemId, roomTypeId) VALUES (?, ?)', [itemId, roomTypeId]);
        } catch (err) {
            throw err;
        }
    },
    getItemsByRoomType: async (roomTypeId, page, limit) => { // Nhận page và limit
        try {
            const offset = (page - 1) * limit;
            const [rows] = await db.query(
                `SELECT i.* 
       FROM items i
       JOIN item_room_types ic ON i.id = ic.itemId
       WHERE ic.roomTypeId = ?
       LIMIT ? OFFSET ?`,
                [roomTypeId, limit, offset]
            );
            return rows;
        } catch (err) {
            throw err;
        }
    },
};

module.exports = RoomType;
