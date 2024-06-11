const Category = {
    getAll: async (pool) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM categories');
            return rows;
        } catch (err) {
            throw err;
        }
    },

    getById: async (pool, categoryId) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM categories WHERE id = ?', [categoryId]);
            return rows.length > 0 ? rows[0] : null;
        } catch (err) {
            throw err;
        }
    },

    create: async (pool, name, imageUrl) => {
        try {
            const [result] = await pool.execute(
                'INSERT INTO categories (name, imageUrl) VALUES (?, ?)',
                [name, imageUrl]
            );
            return result.insertId;
        } catch (err) {
            throw err;
        }
    },

    update: async (pool, categoryId, name, imageUrl) => {
        try {
            const [result] = await pool.execute(
                'UPDATE categories SET name = ?, imageUrl = ? WHERE id = ?',
                [name, imageUrl, categoryId]
            );
            return result.affectedRows;
        } catch (err) {
            throw err;
        }
    },

    delete: async (pool, categoryId) => {
        try {
            const [result] = await pool.execute('DELETE FROM categories WHERE id = ?', [categoryId]);
            return result.affectedRows;
        } catch (err) {
            throw err;
        }
    }
};

module.exports = Category;
