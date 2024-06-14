const Category = require('../models/Category');
const logger = require('../config/logger');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.getAll(req.pool);
        res.json(categories);
    } catch (err) {
        logger.error('Error fetching categories:', err);
        res.status(500).json({ message: 'Error fetching categories' });
    }
};

exports.getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.getById(req.pool, id);
        if (category) {
            res.json(category);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (err) {
        logger.error('Error fetching category:', err);
        res.status(500).json({ message: 'Error fetching category' });
    }
};

exports.createCategory = [
    upload.single('imageUrl'),
    async (req, res) => {
        const { name } = req.body;
        const imageUrl = req.file ? req.file.filename : null;

        logger.info('Create category request received:', { name, imageUrl });

        if (!name || !imageUrl) {
            logger.warn('Missing fields');
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin danh mục' });
        }

        try {
            const categoryId = await Category.create(req.pool, name, imageUrl);
            logger.info('Category created with ID:', categoryId);
            res.status(201).json({ message: 'Category created', categoryId });
        } catch (err) {
            logger.error('Error creating category:', err);
            res.status(500).json({ message: 'Error creating category' });
        }
    }
];

exports.updateCategory = [
    upload.single('imageUrl'),
    async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;
        const imageUrl = req.file ? req.file.filename : null;

        logger.info('Update category request received:', { id, name, imageUrl });

        if (!name || !imageUrl) {
            logger.warn('Missing fields');
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin danh mục' });
        }

        try {
            const affectedRows = await Category.update(req.pool, id, name, imageUrl);
            if (affectedRows > 0) {
                logger.info('Category updated with ID:', id);
                res.status(200).json({ message: 'Category updated' });
            } else {
                res.status(404).json({ message: 'Category not found' });
            }
        } catch (err) {
            logger.error('Error updating category:', err);
            res.status(500).json({ message: 'Error updating category' });
        }
    }
];

exports.deleteCategory = async (req, res) => {
    const { id } = req.params;

    logger.info('Delete category request received:', { id });

    try {
        const affectedRows = await Category.delete(req.pool, id);
        if (affectedRows > 0) {
            logger.info('Category deleted with ID:', id);
            res.status(200).json({ message: 'Category deleted' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (err) {
        logger.error('Error deleting category:', err);
        res.status(500).json({ message: 'Error deleting category' });
    }
};

exports.getItemsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const [rows] = await req.pool.execute('SELECT * FROM items WHERE categoryId = ?', [categoryId]);
        // if (rows.length === 0) {
        //     return res.status(404).json({ message: 'Không tìm thấy sản phẩm cho danh mục này' });
        // }
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};
