const express = require('express');
const chatController = require('../controllers/chatController');
const router = express.Router();

router.get('/:chatId', chatController.getChat);
router.post('/new', chatController.createChat);
router.put('/:chatId', chatController.addUserToChat);

module.exports = router;