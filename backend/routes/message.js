const express = require('express');
const messageController = require('../controllers/messageController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/send', authenticateToken, messageController.sendMessage);

module.exports = router;