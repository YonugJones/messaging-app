const express = require('express');
const { signup } = require('../controllers/authController');
const { validateSignup } = require('../middleware/validateInput');
const router = express.Router();

router.post('/signup', validateSignup, signup);

module.exports = router;