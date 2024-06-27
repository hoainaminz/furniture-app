const Brand = require('../models/Brand');
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

exports.getAllBrand = async (req, res) => {
    try {
        const brand = await Brand.getAll();
        res.json(brand);
    } catch (err) {
        logger.error('Error fetching Brands:', err);
        res.status(500).json({ message: 'Error fetching Brands' });
    }
};

exports.getBrandById = async (req, res) => {
    const { id } = req.params;
    try {
        const brand = await Brand.getById(id);
        if (brand) {
            res.json(brand);
        } else {
            res.status(404).json({ message: 'Brand not found' });
        }
    } catch (err) {
        logger.error('Error fetching Brand:', err);
        res.status(500).json({ message: 'Error fetching Brand' });
    }
};

exports.createBrand = [
    upload.single('imageUrl'),
    async (req, res) => {
        const { name } = req.body;
        const imageUrl = req.file ? req.file.filename : null;

        logger.info('Create Brand request received:', { name, imageUrl });

        if (!name || !imageUrl) {
            logger.warn('Missing fields');
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        try {
            const brandId = await Brand.create(name, imageUrl);
            logger.info('Brand created with ID:', brandId);
            res.status(201).json({ message: 'Brand created', brandId });
        } catch (err) {
            logger.error('Error creating Brand:', err);
            res.status(500).json({ message: 'Error creating Brand' });
        }
    }
];

exports.updateBrand = [
    upload.single('imageUrl'),
    async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;
        const imageUrl = req.file ? req.file.filename : req.body.imageUrl;

        logger.info('Update Brand request received:', { id, name, imageUrl });

        if (!name || !imageUrl) {
            logger.warn('Missing fields');
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        try {
            const affectedRows = await Brand.update(id, name, imageUrl);
            if (affectedRows > 0) {
                logger.info('Brand updated with ID:', id);
                res.status(200).json({ message: 'Brand updated' });
            } else {
                res.status(404).json({ message: 'Brand not found' });
            }
        } catch (err) {
            logger.error('Error updating Brand:', err);
            res.status(500).json({ message: 'Error updating Brand' });
        }
    }
];

exports.deleteBrand = async (req, res) => {
    const { id } = req.params;

    logger.info('Delete Brand request received:', { id });

    try {
        const affectedRows = await Brand.delete(id);
        if (affectedRows > 0) {
            logger.info('Brand deleted with ID:', id);
            res.status(200).json({ message: 'Brand deleted' });
        } else {
            res.status(404).json({ message: 'Brand not found' });
        }
    } catch (err) {
        logger.error('Error deleting Brand:', err);
        res.status(500).json({ message: 'Error deleting Brand' });
    }
};

exports.addBrandToItem = async (req, res) => {
    const { brandId, itemId } = req.body;

    logger.info('Add Brand to item request received:', { brandId, itemId });

    if (!brandId || !itemId) {
        logger.warn('Missing BrandId or itemId');
        return res.status(400).json({ message: 'Please provide BrandId and itemId' });
    }

    try {
        await Brand.addBrandToItem(itemId, brandId);
        logger.info('Brand added to item:', { brandId, itemId });
        res.status(200).json({ message: 'Brand added to item' });
    } catch (err) {
        logger.error('Error adding Brand to item:', err);
        res.status(500).json({ message: 'Error adding Brand to item' });
    }
};
//
// exports.getItemsByBrand = async (req, res) => {
//     try {
//         const brandId = req.params.brandId;
//         const items = await Brand.getItemsByBrand(brandId);
//         res.json(items);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
exports.getItemsByBrand = async (req, res) => {
    try {
        const brandId = req.params.brandId;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;

        const items = await Brand.getItemsByBrand(brandId, page, limit);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
