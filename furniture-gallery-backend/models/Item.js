const pool = require('../config/db');

const Item = {
  getAll: async () => {
    try {
      const [rows] = await pool.execute('SELECT * FROM items');
      return rows;
    } catch (err) {
      throw err;
    }
  },

  getById: async (itemId) => {
    try {
      const [rows] = await pool.execute('SELECT * FROM items WHERE id = ?', [itemId]);
      return rows.length > 0 ? rows[0] : null;
    } catch (err) {
      throw err;
    }
  },

  create: async (name, categoryId, description) => {
    try {
      const [result] = await pool.execute(
          'INSERT INTO items (name, categoryId, description) VALUES (?, ?, ?)',
          [name, categoryId, description]
      );
      return result.insertId;
    } catch (err) {
      throw err;
    }
  },

  update: async (itemId, name, categoryId, description) => {
    try {
      const [result] = await pool.execute(
          'UPDATE items SET name = ?, categoryId = ?, description = ? WHERE id = ?',
          [name, categoryId, description, itemId]
      );
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  },

  delete: async (itemId) => {
    try {
      const [result] = await pool.execute('DELETE FROM items WHERE id = ?', [itemId]);
      return result.affectedRows;
    } catch (err) {
      throw err;
    }
  },
};
module.exports = Item;
