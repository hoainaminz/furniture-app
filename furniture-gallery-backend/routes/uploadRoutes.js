const express = require('express');
const upload = require('../middleware/uploadMiddleware'); // Đường dẫn đến file upload

const router = express.Router();

router.post('/upload', upload.array('images', 10), (req, res) => {
    res.json({ message: 'Files uploaded successfully', files: req.files });
});

module.exports = router;
