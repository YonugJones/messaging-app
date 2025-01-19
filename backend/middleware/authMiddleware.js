require('dotenv').config();
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/customError');

const authenticateToken = asyncHandler(async (req, res) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    throw new CustomError('Unauthorized: no token provided', 401);
  }

  const token = authHeader.split(' ')[1];

  if (!process.env.JWT_SECRET) {
    throw new CustomError('Server error: JWT_SECRET not defined', 500);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new CustomError('Forbidden: token has expired', 403);
    } else {
      throw new CustomError('Unauthorized: invalid token', 401);
    }
  }
});

module.exports = authenticateToken;