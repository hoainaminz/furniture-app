const multer = require('multer');
const path = require('path');
const Color = require('../models/Color');
const logger = require('../config/logger');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

exports.uploadImage = upload.single('image');

exports.getAllColors = async (req, res) => {
    try {
        const colors = await Color.getAll();
        res.json(colors);
    } catch (err) {
        logger.error('Error fetching colors:', err);
        res.status(500).json({ message: 'Error fetching colors' });
    }
};

exports.getColorById = async (req, res) => {
    const { id } = req.params;
    try {
        const color = await Color.getById(id);
        if (color) {
            res.json(color);
        } else {
            res.status(404).json({ message: 'Color not found' });
        }
    } catch (err) {
        logger.error('Error fetching color:', err);
        res.status(500).json({ message: 'Error fetching color' });
    }
};

exports.createColor = async (req, res) => {
    const { name } = req.body;
    const imageUrl = req.file ? req.file.filename : null;

    logger.info('Create color request received:', { name, imageUrl });

    if (!name || !imageUrl) {
        logger.warn('Missing fields');
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin màu sắc' });
    }

    try {
        const colorId = await Color.create(name, imageUrl);
        logger.info('Color created with ID:', colorId);
        res.status(201).json({ message: 'Color created', colorId });
    } catch (err) {
        logger.error('Error creating color:', err);
        res.status(500).json({ message: 'Error creating color' });
    }
};

exports.updateColor = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const imageUrl = req.file ? req.file.filename : req.body.imageUrl;

    logger.info('Update color request received:', { id, name, imageUrl });

    if (!name || !imageUrl) {
        logger.warn('Missing fields');
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin màu sắc' });
    }

    try {
        const affectedRows = await Color.update(id, name, imageUrl);
        if (affectedRows > 0) {
            logger.info('Color updated with ID:', id);
            res.status(200).json({ message: 'Color updated' });
        } else {
            res.status(404).json({ message: 'Color not found' });
        }
    } catch (err) {
        logger.error('Error updating color:', err);
        res.status(500).json({ message: 'Error updating color' });
    }
};

exports.deleteColor = async (req, res) => {
    const { id } = req.params;

    logger.info('Delete color request received:', { id });

    try {
        const affectedRows = await Color.delete(id);
        if (affectedRows > 0) {
            logger.info('Color deleted with ID:', id);
            res.status(200).json({ message: 'Color deleted' });
        } else {
            res.status(404).json({ message: 'Color not found' });
        }
    } catch (err) {
        logger.error('Error deleting color:', err);
        res.status(500).json({ message: 'Error deleting color' });
    }
};

exports.addColorToItem = async (req, res) => {
    const { itemId, colorId } = req.body;

    if (!itemId || !colorId) {
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin' });
    }

    try {
        await Color.addColorToItem(itemId, colorId);
        res.status(200).json({ message: 'Đã gán mã màu cho sản phẩm' });
    } catch (err) {
        console.error('Lỗi khi gán mã màu cho sản phẩm:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getItemsByColor = async (req, res) => {
    try {
        const colorId = req.params.colorId;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;

        const items = await Color.getItemsByColor(colorId, page, limit);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
