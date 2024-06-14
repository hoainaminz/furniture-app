const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'red_harmony',
    password: process.env.DB_PASSWORD || 'uBjZl-ZCzrwPz)Xe',
    database: process.env.DB_DATABASE || 'furniture_gallery',
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 0,
});

// Kiểm tra kết nối
pool.getConnection()
    .then(connection => {
        console.log('Kết nối đến cơ sở dữ liệu thành công!');
        connection.release();
    })
    .catch(err => {
        console.error('Lỗi kết nối đến cơ sở dữ liệu:', err);
    });

module.exports = pool;
