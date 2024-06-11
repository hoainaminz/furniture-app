const RoomType = require('../models/RoomType');
const logger = require('../config/logger');

exports.getAllRoomTypes = async (req, res) => {
    try {
        const roomTypes = await RoomType.getAll();
        res.json(roomTypes);
    } catch (err) {
        logger.error('Error fetching room types:', err);
        res.status(500).json({ message: 'Error fetching room types' });
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
        logger.error('Error fetching room type:', err);
        res.status(500).json({ message: 'Error fetching room type' });
    }
};

exports.createRoomType = async (req, res) => {
    const { name, imageUrl } = req.body;

    logger.info('Create room type request received:', { name, imageUrl });

    if (!name || !imageUrl) {
        logger.warn('Missing fields');
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const roomTypeId = await RoomType.create(name, imageUrl);
        logger.info('Room type created with ID:', roomTypeId);
        res.status(201).json({ message: 'Room type created', roomTypeId });
    } catch (err) {
        logger.error('Error creating room type:', err);
        res.status(500).json({ message: 'Error creating room type' });
    }
};

exports.updateRoomType = async (req, res) => {
    const { id } = req.params;
    const { name, imageUrl } = req.body;

    logger.info('Update room type request received:', { id, name, imageUrl });

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
        logger.error('Error updating room type:', err);
        res.status(500).json({ message: 'Error updating room type' });
    }
};

exports.deleteRoomType = async (req, res) => {
    const { id } = req.params;

    logger.info('Delete room type request received:', { id });

    try {
        const affectedRows = await RoomType.delete(id);
        if (affectedRows > 0) {
            logger.info('Room type deleted with ID:', id);
            res.status(200).json({ message: 'Room type deleted' });
        } else {
            res.status(404).json({ message: 'Room type not found' });
        }
    } catch (err) {
        logger.error('Error deleting room type:', err);
        res.status(500).json({ message: 'Error deleting room type' });
    }
};

exports.addRoomTypeToItem = async (req, res) => {
    const { roomTypeId, itemId } = req.body;

    logger.info('Add room type to item request received:', { roomTypeId, itemId });

    if (!roomTypeId || !itemId) {
        logger.warn('Missing roomTypeId or itemId');
        return res.status(400).json({ message: 'Please provide roomTypeId and itemId' });
    }

    try {
        await RoomType.addRoomTypeToItem(itemId, roomTypeId);
        logger.info('Room type added to item:', { roomTypeId, itemId });
        res.status(200).json({ message: 'Room type added to item' });
    } catch (err) {
        logger.error('Error adding room type to item:', err);
        res.status(500).json({ message: 'Error adding room type to item' });
    }
};
// Lấy danh sách các Item dựa trên RoomTypeId
exports.getItemsByRoomType = async (req, res) => {
    try {
        const roomTypeId = req.params.roomTypeId;
        const items = await RoomType.getItemsByRoomType(roomTypeId);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
