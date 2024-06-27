const DesignStyle = require('../models/DesignStyle');
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

exports.getAllDesignStyles = async (req, res) => {
    try {
        const designStyles = await DesignStyle.getAll();
        res.json(designStyles);
    } catch (err) {
        logger.error('Error fetching design styles:', err);
        res.status(500).json({ message: 'Error fetching design styles' });
    }
};

exports.getDesignStyleById = async (req, res) => {
    const { id } = req.params;
    try {
        const designStyle = await DesignStyle.getById(id);
        if (designStyle) {
            res.json(designStyle);
        } else {
            res.status(404).json({ message: 'Design style not found' });
        }
    } catch (err) {
        logger.error('Error fetching design style:', err);
        res.status(500).json({ message: 'Error fetching design style' });
    }
};

exports.createDesignStyle = [
    upload.single('imageUrl'),
    async (req, res) => {
        const { name } = req.body;
        const imageUrl = req.file ? req.file.filename : null;

        logger.info('Create design style request received:', { name, imageUrl });

        if (!name || !imageUrl) {
            logger.warn('Missing fields');
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        try {
            const designStyleId = await DesignStyle.create(name, imageUrl);
            logger.info('Design style created with ID:', designStyleId);
            res.status(201).json({ message: 'Design style created', designStyleId });
        } catch (err) {
            logger.error('Error creating design style:', err);
            res.status(500).json({ message: 'Error creating design style' });
        }
    }
];

exports.updateDesignStyle = [
    upload.single('imageUrl'),
    async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;
        const imageUrl = req.file ? req.file.filename : req.body.imageUrl;

        logger.info('Update design style request received:', { id, name, imageUrl });

        if (!name || !imageUrl) {
            logger.warn('Missing fields');
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        try {
            const affectedRows = await DesignStyle.update(id, name, imageUrl);
            if (affectedRows > 0) {
                logger.info('Design style updated with ID:', id);
                res.status(200).json({ message: 'Design style updated' });
            } else {
                res.status(404).json({ message: 'Design style not found' });
            }
        } catch (err) {
            logger.error('Error updating design style:', err);
            res.status(500).json({ message: 'Error updating design style' });
        }
    }
];

exports.deleteDesignStyle = async (req, res) => {
    const { id } = req.params;

    logger.info('Delete design style request received:', { id });

    try {
        const affectedRows = await DesignStyle.delete(id);
        if (affectedRows > 0) {
            logger.info('Design style deleted with ID:', id);
            res.status(200).json({ message: 'Design style deleted' });
        } else {
            res.status(404).json({ message: 'Design style not found' });
        }
    } catch (err) {
        logger.error('Error deleting design style:', err);
        res.status(500).json({ message: 'Error deleting design style' });
    }
};

exports.addDesignStyleToItem = async (req, res) => {
    const { designStyleId, itemId } = req.body;

    logger.info('Add design style to item request received:', { designStyleId, itemId });

    if (!designStyleId || !itemId) {
        logger.warn('Missing designStyleId or itemId');
        return res.status(400).json({ message: 'Please provide designStyleId and itemId' });
    }

    try {
        await DesignStyle.addDesignStyleToItem(itemId, designStyleId);
        logger.info('Design style added to item:', { designStyleId, itemId });
        res.status(200).json({ message: 'Design style added to item' });
    } catch (err) {
        logger.error('Error adding design style to item:', err);
        res.status(500).json({ message: 'Error adding design style to item' });
    }
};

exports.getItemsByDesignStyle = async (req, res) => {
    try {
        const designStyleId = req.params.designStyleId;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;

        const items = await DesignStyle.getItemsByDesignStyle(designStyleId, page, limit);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};