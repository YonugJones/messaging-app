const express = require('express');
const chatController = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/:chatId', authenticateToken, chatController.getChat);
router.post('/new', authenticateToken, chatController.createChat);

module.exports = router;