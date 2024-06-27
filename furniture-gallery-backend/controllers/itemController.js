const Item = require('../models/Item');
const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.getAll();
        res.json(items);
    } catch (err) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getItemById = async (req, res) => {
    try {
        const itemId = req.params.id;
        const item = await Item.getById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        res.json(item);
    } catch (err) {
        console.error('Lỗi khi lấy thông tin sản phẩm:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// exports.createItem = async (req, res) => {
//     const { name, category, description, color, brand, roomType, designStyle } = req.body;
//     const images = req.files;
//
//     if (!name || !category || !description || !images) {
//         return res.status(400).json({ error: 'All fields are required' });
//     }
//
//     try {
//         const [itemResult] = await pool.query(
//             'INSERT INTO items (name, categoryId, description) VALUES (?, ?, ?)',
//             [name, category, description]
//         );
//
//         const itemId = itemResult.insertId;
//
//         const imagePromises = images.map(image => {
//             return pool.query(
//                 'INSERT INTO item_images (itemId, imageUrl) VALUES (?, ?)',
//                 [itemId, image.filename]
//             );
//         });
//
//         const colorPromise = pool.query(
//             'INSERT INTO item_colors (itemId, colorId) VALUES (?, ?)',
//             [itemId, color]
//         );
//
//         const brandPromise = pool.query(
//             'INSERT INTO item_brands (itemId, brandId) VALUES (?, ?)',
//             [itemId, brand]
//         );
//
//         const roomTypePromise = pool.query(
//             'INSERT INTO item_room_types (itemId, roomTypeId) VALUES (?, ?)',
//             [itemId, roomType]
//         );
//
//         const designStylePromise = pool.query(
//             'INSERT INTO item_design_styles (itemId, designStyleId) VALUES (?, ?)',
//             [itemId, designStyle]
//         );
//
//         await Promise.all([...imagePromises, colorPromise, brandPromise, roomTypePromise, designStylePromise]);
//
//         res.status(201).json({ message: 'Item created successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// };
exports.createItem = async (req, res) => {
    const { name, category, description, brand, roomType, designStyle, colors } = req.body;
    const images = req.files;

    if (!name || !category || !description || !images) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const [itemResult] = await pool.query(
            'INSERT INTO items (name, categoryId, description) VALUES (?, ?, ?)',
            [name, category, description]
        );

        const itemId = itemResult.insertId;

        const imagePromises = images.map(image => {
            return pool.query(
                'INSERT INTO item_images (itemId, imageUrl) VALUES (?, ?)',
                [itemId, image.filename]
            );
        });

        const colorPromises = colors.map(colorId => {
            return pool.query(
                'INSERT INTO item_colors (itemId, colorId) VALUES (?, ?)',
                [itemId, colorId]
            );
        });

        const brandPromise = pool.query(
            'INSERT INTO item_brands (itemId, brandId) VALUES (?, ?)',
            [itemId, brand]
        );

        const roomTypePromise = pool.query(
            'INSERT INTO item_room_types (itemId, roomTypeId) VALUES (?, ?)',
            [itemId, roomType]
        );

        const designStylePromise = pool.query(
            'INSERT INTO item_design_styles (itemId, designStyleId) VALUES (?, ?)',
            [itemId, designStyle]
        );

        await Promise.all([...imagePromises, ...colorPromises, brandPromise, roomTypePromise, designStylePromise]);

        res.status(201).json({ message: 'Item created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
//
// exports.updateItem = async (req, res) => {
//     const itemId = req.params.id;
//     const { name, categoryId, description, brand, roomType, designStyle, colors } = req.body;
//     const images = req.files;
//
//     try {
//         // 1. Cập nhật bảng `items`
//         await req.pool.execute(
//             'UPDATE items SET name = ?, categoryId = ?, description = ? WHERE id = ?',
//             [name, categoryId, description, itemId]
//         );
//
//         // 2. Cập nhật bảng `item_images`
//         if (images && images.length > 0) {
//             await req.pool.execute('DELETE FROM item_images WHERE itemId = ?', [itemId]);
//             const imagePromises = images.map(image => req.pool.execute(
//                 'INSERT INTO item_images (itemId, imageUrl) VALUES (?, ?)',
//                 [itemId, image.filename]
//             ));
//             await Promise.all(imagePromises);
//         }
//
//         // 3. Cập nhật bảng `item_colors`
//         await req.pool.execute('DELETE FROM item_colors WHERE itemId = ?', [itemId]);
//         if (colors && colors.length > 0) {
//             const colorPromises = colors.map(colorId => req.pool.execute(
//                 'INSERT INTO item_colors (itemId, colorId) VALUES (?, ?)',
//                 [itemId, colorId]
//             ));
//             await Promise.all(colorPromises);
//         }
//
//         // 4. Cập nhật bảng `item_brands`
//         await req.pool.execute('DELETE FROM item_brands WHERE itemId = ?', [itemId]);
//         if (brand) { // Kiểm tra xem có brand mới hay không
//             await req.pool.execute(
//                 'INSERT INTO item_brands (itemId, brandId) VALUES (?, ?)',
//                 [itemId, brand]
//             );
//         }
//
//         // 5. Cập nhật bảng `item_room_types`
//         await req.pool.execute('DELETE FROM item_room_types WHERE itemId = ?', [itemId]);
//         if (roomType) { // Kiểm tra xem có roomType mới hay không
//             await req.pool.execute(
//                 'INSERT INTO item_room_types (itemId, roomTypeId) VALUES (?, ?)',
//                 [itemId, roomType]
//             );
//         }
//
//         // 6. Cập nhật bảng `item_design_styles`
//         await req.pool.execute('DELETE FROM item_design_styles WHERE itemId = ?', [itemId]);
//         if (designStyle) { // Kiểm tra xem có designStyle mới hay không
//             await req.pool.execute(
//                 'INSERT INTO item_design_styles (itemId, designStyleId) VALUES (?, ?)',
//                 [itemId, designStyle]
//             );
//         }
//
//         res.json({ message: 'Item updated successfully' });
//     } catch (error) {
//         console.error('Error updating item:', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// };
exports.updateItem = async (req, res) => {
    const { id } = req.params;
    const { name, categoryId, description, brand, roomType, designStyle, colors } = req.body;
    const images = req.files;

    if (!name || !categoryId || !description) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Cập nhật thông tin cơ bản của sản phẩm
        await pool.query(
            'UPDATE items SET name = ?, categoryId = ?, description = ? WHERE id = ?',
            [name, categoryId, description, id]
        );

        // Cập nhật màu sắc
        if (colors) {
            await pool.query('DELETE FROM item_colors WHERE itemId = ?', [id]);
            const colorPromises = colors.map(colorId => {
                return pool.query('INSERT INTO item_colors (itemId, colorId) VALUES (?, ?)', [id, colorId]);
            });
            await Promise.all(colorPromises);
        }

        // Cập nhật thương hiệu
        if (brand) {
            await pool.query('DELETE FROM item_brands WHERE itemId = ?', [id]);
            await pool.query('INSERT INTO item_brands (itemId, brandId) VALUES (?, ?)', [id, brand]);
        }

        // Cập nhật loại phòng
        if (roomType) {
            await pool.query('DELETE FROM item_room_types WHERE itemId = ?', [id]);
            await pool.query('INSERT INTO item_room_types (itemId, roomTypeId) VALUES (?, ?)', [id, roomType]);
        }

        // Cập nhật phong cách thiết kế
        if (designStyle) {
            await pool.query('DELETE FROM item_design_styles WHERE itemId = ?', [id]);
            await pool.query('INSERT INTO item_design_styles (itemId, designStyleId) VALUES (?, ?)', [id, designStyle]);
        }

        // Cập nhật hình ảnh
        if (images.length > 0) {
            const [oldImages] = await pool.query('SELECT imageUrl FROM item_images WHERE itemId = ?', [id]);
            oldImages.forEach((image) => {
                const imagePath = path.join(__dirname, '../uploads', image.imageUrl);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });
            await pool.query('DELETE FROM item_images WHERE itemId = ?', [id]);

            const imagePromises = images.map(image => {
                return pool.query('INSERT INTO item_images (itemId, imageUrl) VALUES (?, ?)', [id, image.filename]);
            });
            await Promise.all(imagePromises);
        }

        res.status(200).json({ message: 'Item updated successfully' });
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteItem = async (req, res) => {
    const itemId = req.params.id;
    const connection = await req.pool.getConnection();

    try {
        await connection.beginTransaction();

        // Xóa tất cả các hàng liên quan trong bảng item_brands
        await connection.query('DELETE FROM item_brands WHERE itemId = ?', [itemId]);

        // Xóa tất cả các hàng liên quan trong bảng item_images (nếu có)
        await connection.query('DELETE FROM item_images WHERE itemId = ?', [itemId]);

        // Xóa tất cả các hàng liên quan trong bảng item_colors (nếu có)
        await connection.query('DELETE FROM item_colors WHERE itemId = ?', [itemId]);

        // Xóa tất cả các hàng liên quan trong bảng item_room_types (nếu có)
        await connection.query('DELETE FROM item_room_types WHERE itemId = ?', [itemId]);

        // Xóa tất cả các hàng liên quan trong bảng item_design_styles (nếu có)
        await connection.query('DELETE FROM item_design_styles WHERE itemId = ?', [itemId]);

        // Cuối cùng, xóa hàng trong bảng items
        await connection.query('DELETE FROM items WHERE id = ?', [itemId]);

        await connection.commit();

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Error deleting item' });
    } finally {
        connection.release();
    }
};
// Lấy các sản phẩm mới nhất
exports.getLatestItems = async (req, res) => {
    try {
        const [rows] = await req.pool.execute('SELECT * FROM items ORDER BY id DESC LIMIT 3');
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        res.json(rows);
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm mới nhất:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Lấy hình ảnh của sản phẩm
exports.getItemImages = async (req, res) => {
    try {
        const itemId = req.params.id;
        const [rows] = await req.pool.execute('SELECT * FROM item_images WHERE itemId = ?', [itemId]);
        if (rows.length === 0) {
            // return res.status(404).json({ message: 'Không tìm thấy hình ảnh cho sản phẩm này' });
            return res.status(200).json([{ imageUrl: 'default.jpg' }]);
        }
        res.json(rows);
    } catch (error) {
        console.error('Lỗi khi lấy hình ảnh của sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
// Lấy thông tin brand của một item
exports.getItemBrand = async (req, res) => {
    try {
        const itemId = req.params.id;
        const [rows] = await req.pool.execute(`
            SELECT brands.*
            FROM item_brands
            JOIN brands ON item_brands.brandId = brands.id
            WHERE item_brands.itemId = ?
        `, [itemId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy brand cho sản phẩm này' });
        }
        res.json(rows);
    } catch (error) {
        console.error('Lỗi khi lấy brand của sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Lấy thông tin room type của một item
exports.getItemRoomType = async (req, res) => {
    try {
        const itemId = req.params.id;
        const [rows] = await req.pool.execute(`
            SELECT room_types.*
            FROM item_room_types
            JOIN room_types ON item_room_types.roomTypeId = room_types.id
            WHERE item_room_types.itemId = ?
        `, [itemId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy room type cho sản phẩm này' });
        }
        res.json(rows); // Trả về tất cả các room types
    } catch (error) {
        console.error('Lỗi khi lấy room type của sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Lấy thông tin design style của một item
exports.getItemDesignStyle = async (req, res) => {
    try {
        const itemId = req.params.id;
        const [rows] = await req.pool.execute(`
            SELECT design_styles.*
            FROM item_design_styles
            JOIN design_styles ON item_design_styles.designStyleId = design_styles.id
            WHERE item_design_styles.itemId = ?
        `, [itemId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy design style cho sản phẩm này' });
        }
        res.json(rows); // Trả về tất cả các design styles
    } catch (error) {
        console.error('Lỗi khi lấy design style của sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
exports.getRelatedItems = async (req, res) => {
    try {
        const itemId = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;

        // Lấy categoryId của sản phẩm hiện tại
        const [itemRows] = await pool.query('SELECT categoryId FROM items WHERE id = ?', [itemId]);
        if (itemRows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        const categoryId = itemRows[0].categoryId;

        // Tính toán offset
        const offset = (page - 1) * limit;

        // Truy vấn các sản phẩm liên quan dựa trên mã màu và danh mục
        const [relatedItems] = await pool.query(`
        SELECT DISTINCT i.*
        FROM items i
        LEFT JOIN item_colors ic ON i.id = ic.itemId
        WHERE 
            (i.categoryId = ?  -- Sử dụng categoryId đã lấy ở trên
            OR ic.colorId IN (SELECT colorId FROM item_colors WHERE itemId = ?))
            AND i.id != ?
        LIMIT ? OFFSET ?
    `, [categoryId, itemId, itemId, limit, offset]);

        res.json(relatedItems);
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm liên quan:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
exports.uploadItemImages = async (req, res) => {
    try {
        const itemId = req.params.id;
        const files = req.files;

        const images = files.map(file => ({
            itemId,
            imageUrl: file.filename,
        }));

        await Item.addImages(images);

        res.status(201).json({ message: 'Upload images successfully', images });
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ message: 'Error uploading images' });
    }
};
exports.getItemColors = async (req, res) => {
    try {
        const itemId = req.params.id;
        const [rows] = await pool.query(
            `SELECT colors.*
             FROM item_colors
             JOIN colors ON item_colors.colorId = colors.id
             WHERE item_colors.itemId = ?`,
            [itemId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy màu cho sản phẩm này' });
        }
        res.json(rows);
    } catch (error) {
        console.error('Lỗi khi lấy màu của sản phẩm:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};