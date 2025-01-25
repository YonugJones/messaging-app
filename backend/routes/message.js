const express = require('express');
const messageController = require('../controllers/messageController');
const { validateMessage } = require('../middleware/validateInput');
const router = express.Router();

router.post('/send', validateMessage, messageController.sendMessage);
router.put('/:messageId', validateMessage, messageController.editMessage);

module.exports = router;