const Brand = require('../models/Brand');

exports.getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.getAll();
        res.json(brands);
    } catch (err) {
        console.error('Lỗi khi lấy danh sách nhãn hiệu:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getBrandById = async (req, res) => {
    const { id } = req.params;
    try {
        const brand = await Brand.getById(id);
        if (brand) {
            res.json(brand);
        } else {
            res.status(404).json({ message: 'Không tìm thấy nhãn hiệu' });
        }
    } catch (err) {
        console.error('Lỗi khi lấy thông tin nhãn hiệu:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.createBrand = async (req, res) => {
    const { name, imageUrl } = req.body;

    if (!name || !imageUrl) {
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin nhãn hiệu' });
    }

    try {
        const brandId = await Brand.create(name, imageUrl);
        res.status(201).json({ message: 'Tạo nhãn hiệu thành công', brandId });
    } catch (err) {
        console.error('Lỗi khi tạo nhãn hiệu:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.updateBrand = async (req, res) => {
    const { id } = req.params;
    const { name, imageUrl } = req.body;

    if (!name || !imageUrl) {
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin nhãn hiệu' });
    }

    try {
        const affectedRows = await Brand.update(id, name, imageUrl);
        if (affectedRows > 0) {
            res.status(200).json({ message: 'Cập nhật nhãn hiệu thành công' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy nhãn hiệu' });
        }
    } catch (err) {
        console.error('Lỗi khi cập nhật nhãn hiệu:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.deleteBrand = async (req, res) => {
    const { id } = req.params;

    try {
        const affectedRows = await Brand.delete(id);
        if (affectedRows > 0) {
            res.status(200).json({ message: 'Xóa nhãn hiệu thành công' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy nhãn hiệu' });
        }
    } catch (err) {
        console.error('Lỗi khi xóa nhãn hiệu:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.addBrandToItem = async (req, res) => {
    const { itemId, brandId } = req.body;

    if (!itemId || !brandId) {
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    try {
        await Brand.addBrandToItem(itemId, brandId);
        res.status(200).json({ message: 'Đã gán nhãn hiệu cho sản phẩm' });
    } catch (err) {
        console.error('Lỗi khi gán nhãn hiệu cho sản phẩm:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
exports.getItemsByBrand = async (req, res) => {
    try {
        const brandId = req.params.brandId;
        const items = await Brand.getItemsByBrand(brandId);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};