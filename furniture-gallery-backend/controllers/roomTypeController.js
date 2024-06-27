const RoomType = require('../models/RoomType');
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

exports.getAllRoomTypes = async (req, res) => {
    try {
        const RoomTypes = await RoomType.getAll();
        res.json(RoomTypes);
    } catch (err) {
        logger.error('Error fetching Room types:', err);
        res.status(500).json({ message: 'Error fetching Room types' });
    }
};

exports.getRoomTypeById = async (req, res) => {
    const { id } = req.params;
    try {
        const roomType = await RoomType.getById(id);
        if (roomType) {
            res.json(roomType);
        } else {
            res.status(404).json({ message: 'Room type not found' });
        }
    } catch (err) {
        logger.error('Error fetching Room type:', err);
        res.status(500).json({ message: 'Error fetching Room type' });
    }
};

exports.createRoomType = [
    upload.single('imageUrl'),
    async (req, res) => {
        const { name } = req.body;
        const imageUrl = req.file ? req.file.filename : null;

        logger.info('Create Room type request received:', { name, imageUrl });

        if (!name || !imageUrl) {
            logger.warn('Missing fields');
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        try {
            const roomTypeId = await RoomType.create(name, imageUrl);
            logger.info('Room type created with ID:', roomTypeId);
            res.status(201).json({ message: 'Room type created', roomTypeId });
        } catch (err) {
            logger.error('Error creating Room type:', err);
            res.status(500).json({ message: 'Error creating Room type' });
        }
    }
];

exports.updateRoomType = [
    upload.single('imageUrl'),
    async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;
        const imageUrl = req.file ? req.file.filename : req.body.imageUrl;

        logger.info('Update Room type request received:', { id, name, imageUrl });

        if (!name || !imageUrl) {
            logger.warn('Missing fields');
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        try {
            const affectedRows = await RoomType.update(id, name, imageUrl);
            if (affectedRows > 0) {
                logger.info('Room type updated with ID:', id);
                res.status(200).json({ message: 'Room type updated' });
            } else {
                res.status(404).json({ message: 'Room type not found' });
            }
        } catch (err) {
            logger.error('Error updating Room type:', err);
            res.status(500).json({ message: 'Error updating Room type' });
        }
    }
];

exports.deleteRoomType = async (req, res) => {
    const { id } = req.params;

    logger.info('Delete Room type request received:', { id });

    try {
        const affectedRows = await RoomType.delete(id);
        if (affectedRows > 0) {
            logger.info('Room type deleted with ID:', id);
            res.status(200).json({ message: 'Room type deleted' });
        } else {
            res.status(404).json({ message: 'Room type not found' });
        }
    } catch (err) {
        logger.error('Error deleting Room type:', err);
        res.status(500).json({ message: 'Error deleting Room type' });
    }
};

exports.addRoomTypeToItem = async (req, res) => {
    const { RoomTypeId, itemId } = req.body;

    logger.info('Add Room type to item request received:', { RoomTypeId, itemId });

    if (!RoomTypeId || !itemId) {
        logger.warn('Missing RoomTypeId or itemId');
        return res.status(400).json({ message: 'Please provide RoomTypeId and itemId' });
    }

    try {
        await RoomType.addRoomTypeToItem(itemId, RoomTypeId);
        logger.info('Room type added to item:', { RoomTypeId, itemId });
        res.status(200).json({ message: 'Room type added to item' });
    } catch (err) {
        logger.error('Error adding Room type to item:', err);
        res.status(500).json({ message: 'Error adding Room type to item' });
    }
};

exports.getItemsByRoomType = async (req, res) => {
    try {
        const roomTypeId = req.params.roomTypeId;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;

        const items = await RoomType.getItemsByRoomType(roomTypeId, page, limit);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};