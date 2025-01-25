const express = require('express');
const userController = require('../controllers/userController');
const { authorizeUser }  = require('../middleware/authMiddleware');
const { validateUpdateUserInfo } = require('../middleware/validateInput');
const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/:userId', authorizeUser, userController.getUser);
router.put('/:userId', authorizeUser, validateUpdateUserInfo, userController.updateUserInfo);

module.exports = router;