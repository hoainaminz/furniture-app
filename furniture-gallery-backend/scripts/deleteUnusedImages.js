const fs = require('fs');
const path = require('path');
require('dotenv').config();
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

async function deleteUnusedImages() {
    try {
        const [itemImages] = await pool.query('SELECT imageUrl FROM item_images');
        const [brandImages] = await pool.query('SELECT imageUrl FROM brands');
        const [categoryImages] = await pool.query('SELECT imageUrl FROM categories');
        const [colorImages] = await pool.query('SELECT imageUrl FROM colors');
        const [designStyleImages] = await pool.query('SELECT imageUrl FROM design_styles');
        const [roomTypeImages] = await pool.query('SELECT imageUrl FROM room_types');
        const [userAvatars] = await pool.query('SELECT avatar FROM users');

        const usedImages = new Set([
            ...itemImages.map(row => row.imageUrl),
            ...brandImages.map(row => row.imageUrl),
            ...categoryImages.map(row => row.imageUrl),
            ...colorImages.map(row => row.imageUrl),
            ...designStyleImages.map(row => row.imageUrl),
            ...roomTypeImages.map(row => row.imageUrl),
            ...userAvatars.map(row => row.avatar),
        ]);

        const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
        const files = fs.readdirSync(uploadsDir);

        const unusedImages = files.filter(file => !usedImages.has(file));

        for (const file of unusedImages) {
            fs.unlinkSync(path.join(uploadsDir, file));
            console.log(`Deleted unused image: ${file}`);
        }

        console.log('Đã xoá thành công các hình ảnh không sử dụng!');
    } catch (err) {
        console.error('Lỗi khi xoá hình ảnh không sử dụng:', err);
    }
}

deleteUnusedImages();
