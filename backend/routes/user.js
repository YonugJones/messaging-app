const express = require('express');
const userController = require('../controllers/userController');
const { authorizeUser, authenticateToken }  = require('../middleware/authMiddleware');
const { validateUpdateUserInfo } = require('../middleware/validateInput');
const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/:userId', authenticateToken, authorizeUser, userController.getUser);
router.put('/:userId', authenticateToken, authorizeUser, validateUpdateUserInfo, userController.updateUserInfo);

module.exports = router;