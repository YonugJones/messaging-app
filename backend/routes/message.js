const express = require('express');
const messageController = require('../controllers/messageController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validateMessage } = require('../middleware/validateInput');
const router = express.Router();

router.post('/send', authenticateToken, validateMessage, messageController.sendMessage);
router.put('/:messageId', authenticateToken, validateMessage, messageController.editMessage);

module.exports = router;