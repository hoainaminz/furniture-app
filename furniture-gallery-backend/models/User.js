const pool = require('../config/db');

const User = {
    create: async (user, callback) => {
        const { username, fullName, email, password, phone, address, roleId } = user;
        const avatar = 'default_avatar.jpg';
        try {
            const [result] = await pool.execute(
                'INSERT INTO users (username, fullName, email, password, phone, address, avatar, roleId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [username, fullName, email, password, phone, address, avatar, roleId]
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

};

module.exports = User;
