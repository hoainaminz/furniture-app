const pool = require('../config/db');

const Item = {
  getAll: async (userId = null) => {
    try {
      let query = 'SELECT * FROM items WHERE pending = 0';
      if (userId) {
        query += ` AND (items.id IN (SELECT itemId FROM user_items WHERE userId = ?) OR items.id IN (SELECT itemId FROM user_items WHERE userId = ?))`;
        const [rows] = await pool.execute(query, [userId, userId]);
        return rows;
      }
      const [rows] = await pool.execute(query);
      return rows;
    } catch (err) {
      throw err;
    }
  },
  getPending: async (userId = null) => {
    try {
      let query = 'SELECT * FROM items WHERE pending = 1';
      if (userId) {
        query += ` AND (items.id IN (SELECT itemId FROM user_items WHERE userId = ?) OR items.id IN (SELECT itemId FROM user_items WHERE userId = ?))`;
        const [rows] = await pool.execute(query, [userId, userId]);
        return rows;
      }
      const [rows] = await pool.execute(query);
      return rows;
    } catch (err) {
      throw err;
    }
  },

  getById: async (itemId) => {
    try {
      const [rows] = await pool.execute('SELECT * FROM items WHERE id = ? AND pending = 0', [itemId]);
      return rows.length > 0 ? rows[0] : null;
    } catch (err) {
      throw err;
    }
  },

  create: async (name, categoryId, description, userId) => {
    try {
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      const [result] = await connection.execute(
          'INSERT INTO items (name, categoryId, description, pending) VALUES (?, ?, ?, ?)',
          [name, categoryId, description, userId ? 1 : 0]
      );

      const itemId = result.insertId;

      await connection.execute(
          'INSERT INTO user_items (userId, itemId) VALUES (?, ?)',
          [userId, itemId]
      );

      await connection.commit();
      connection.release();

      return itemId;
    } catch (err) {
      throw err;
    }
  },
  update: async (itemId, name, categoryId, description) => {
    try {
      const [result] = await pool.execute(
          'UPDATE items SET name = ?, categoryId = ?, description = ? WHERE id = ? AND pending = 0',
          [name, categoryId, description, itemId]
      );
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  },

  delete: async (itemId) => {
    try {
      const [result] = await pool.execute('DELETE FROM items WHERE id = ? AND pending = 0', [itemId]);
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  },

};
module.exports = Item;
