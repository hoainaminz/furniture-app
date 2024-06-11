const Item = require('../models/Item');

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

exports.createItem = async (req, res) => {
    try {
        const { name, categoryId, description } = req.body;
        if (!name || !categoryId || !description) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin sản phẩm' });
        }
        const newItemId = await Item.create(name, categoryId, description);
        res.status(201).json({ message: 'Tạo sản phẩm thành công', itemId: newItemId });
    } catch (err) {
        console.error('Lỗi khi tạo sản phẩm:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const { name, categoryId, description } = req.body;
        if (!name || !categoryId || !description) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin sản phẩm' });
        }
        const updatedRows = await Item.update(itemId, name, categoryId, description);
        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        res.json({ message: 'Cập nhật sản phẩm thành công' });
    } catch (err) {
        console.error('Lỗi khi cập nhật sản phẩm:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// exports.deleteItem = async (req, res) => {
//     try {
//         const itemId = req.params.id;
//         const deletedRows = await Item.delete(itemId);
//         if (deletedRows === 0) {
//             return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
//         }
//         res.json({ message: 'Xóa sản phẩm thành công' });
//     } catch (err) {
//         console.error('Lỗi khi xóa sản phẩm:', err);
//         res.status(500).json({ message: 'Lỗi server' });
//     }
// };
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
            return res.status(404).json({ message: 'Không tìm thấy hình ảnh cho sản phẩm này' });
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
// Lấy sản phẩm liên quan
exports.getRelatedItems = async (req, res) => {
    try {
        const itemId = req.params.id;
        // Lấy chi tiết sản phẩm để tìm các thuộc tính liên quan
        const [itemRows] = await req.pool.execute('SELECT * FROM items WHERE id = ?', [itemId]);
        if (itemRows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        const item = itemRows[0];

        // Truy vấn các sản phẩm liên quan dựa trên mã màu, danh mục và thương hiệu
        const [relatedItems] = await req.pool.execute(`
            SELECT DISTINCT i.*
            FROM items i
            LEFT JOIN item_brands ib ON i.id = ib.itemId
            LEFT JOIN item_colors ic ON i.id = ic.itemId
            WHERE 
                (ib.brandId IN (SELECT brandId FROM item_brands WHERE itemId = ?)
                OR i.categoryId = ?
                OR ic.colorId IN (SELECT colorId FROM item_colors WHERE itemId = ?))
                AND i.id != ?
        `, [itemId, item.categoryId, itemId, itemId]);

        if (relatedItems.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm liên quan' });
        }
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