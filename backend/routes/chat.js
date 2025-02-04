const express = require('express');
const chatController = require('../controllers/chatController');
const { authenticateToken }  = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', authenticateToken, chatController.getUserChats);
router.get('/:chatId', authenticateToken, chatController.getChat);
router.post('/new', authenticateToken, chatController.createChat);
router.post('/:chatId/users', authenticateToken, chatController.addUserToChat);

module.exports = router;