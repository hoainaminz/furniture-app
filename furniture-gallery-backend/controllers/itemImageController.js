const ItemImage = require('../models/ItemImage');
const logger = require('../config/logger');

exports.getAllItemImages = async (req, res) => {
    try {
        const itemImages = await ItemImage.getAll();
        res.json(itemImages);
    } catch (err) {
        logger.error('Error fetching item images:', err);
        res.status(500).json({ message: 'Error fetching item images' });
    }
};

exports.getItemImagesByItemId = async (req, res) => {
    const { itemId } = req.params;
    try {
        const itemImages = await ItemImage.getByItemId(itemId);
        res.json(itemImages);
    } catch (err) {
        logger.error('Error fetching item images by item ID:', err);
        res.status(500).json({ message: 'Error fetching item images by item ID' });
    }
};

exports.createItemImage = async (req, res) => {
    const { itemId, imageUrl } = req.body;

    logger.info('Create item image request received:', { itemId, imageUrl });

    if (!itemId || !imageUrl) {
        logger.warn('Missing fields');
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const itemImageId = await ItemImage.create(itemId, imageUrl);
        logger.info('Item image created with ID:', itemImageId);
        res.status(201).json({ message: 'Item image created', itemImageId });
    } catch (err) {
        logger.error('Error creating item image:', err);
        res.status(500).json({ message: 'Error creating item image' });
    }
};

exports.deleteItemImage = async (req, res) => {
    const { id } = req.params;

    logger.info('Delete item image request received:', { id });

    try {
        const affectedRows = await ItemImage.delete(id);
        if (affectedRows > 0) {
            logger.info('Item image deleted with ID:', id);
            res.status(200).json({ message: 'Item image deleted' });
        } else {
            res.status(404).json({ message: 'Item image not found' });
        }
    } catch (err) {
        logger.error('Error deleting item image:', err);
        res.status(500).json({ message: 'Error deleting item image' });
    }
};
