const pool = require('../config/db');

const User = {
    create: async (user, callback) => {
        const { username, email, password, phone, address, avatar, roleId } = user;
        try {
            const [result] = await pool.execute(
                'INSERT INTO users (username, email, password, phone, address, avatar, roleId) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [username, email, password, phone, address, avatar, roleId]
            );
            callback(null, result.insertId); // Return the newly created user ID
        } catch (err) {
            console.error('Error inserting user:', err);
            callback(err, null);
        }
    },

    findByUsername: async (username, callback) => {
        console.log('Executing query to find user by username:', username);
        try {
            const [results] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
            console.log('Query executed successfully, results:', results);
            callback(null, results[0]); // Return the first found user (should be unique)
        } catch (err) {
            console.error('Error executing query:', err);
            callback(err, null);
        }
    },
    updatePassword: async (id, password) => {
        try {
            const [result] = await pool.query(
                'UPDATE users SET password = ? WHERE id = ?',
                [password, id]
            );
            return result.affectedRows;
        } catch (err) {
            throw err;
        }
    },

    updateProfile: async (id, email, phone, address, avatar) => {
        try {
            const [result] = await pool.query(
                'UPDATE users SET email = ?, phone = ?, address = ?, avatar = ? WHERE id = ?',
                [email, phone, address, avatar, id]
            );
            return result.affectedRows;
        } catch (err) {
            throw err;
        }
    }
};
module.exports = User;
