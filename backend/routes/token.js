const express = require('express');
const { refreshAccessToken } = require('../controllers/tokenController');
const router = express.Router();

router.get('/', refreshAccessToken);

module.exports = router;