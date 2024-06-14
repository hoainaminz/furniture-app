const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const brandRoutes = require('./routes/brandRoutes'); // Thêm route cho Brand
const colorRoutes = require('./routes/colorRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const roomTypeRoutes = require('./routes/roomTypeRoutes');
const designStyleRoutes = require('./routes/designStyleRoutes');
const itemImageRoutes = require('./routes/itemImageRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(express.json());
// app.use(cors());
app.use(cors({
    origin: '*', // Thay thế bằng IP của bạn
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Fake notification
app.get('/', (req, res) => {
    res.send('Chào mừng bạn đến với API Furniture Gallery!');
});

// Lấy pool từ file db.js
const pool = require('./config/db');

// Sử dụng route
app.use('/api/items', itemRoutes(pool));
app.use('/api/auth', authRoutes(pool));
app.use('/api/colors', colorRoutes);
app.use('/api/brands', brandRoutes(pool)); // Truyền pool vào brandRoutes
app.use('/api/categories', categoryRoutes(pool));
app.use('/api/roomTypes', roomTypeRoutes(pool));
app.use('/api/designStyles', designStyleRoutes(pool));
app.use('/api/itemImages', itemImageRoutes(pool));
app.use('/api/users', userRoutes(pool));
app.use('/api', uploadRoutes);


// Xử lý lỗi (giữ nguyên)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Lỗi server!' });
});

// Khởi động server (giữ nguyên)
app.listen(port, () => {
    console.log(`Server đang chạy tại cổng ${port}`);
});
