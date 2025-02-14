require('dotenv').config();
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/customError');

const authenticateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    throw new CustomError('Unauthorized: no token provided', 401);
  }

  // Bearer 1234 becomes 1234
  const token = authHeader.split(' ')[1];

  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new CustomError('Server error: ACCESS_TOKEN_SECRET not defined', 500);
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next(); 
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new CustomError('Unauthorized: token has expired', 403);
    } else {
      throw new CustomError('Unauthorized: invalid token', 401);
    }
  }
});

const authorizeUser = asyncHandler(async (req, res, next) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    throw new CustomError('Invalid user ID', 400);
  }

  if (req.user.id !== userId) {
    throw new CustomError('Unauthorized: cannot perform this action', 403)
  }

  next();
})

module.exports = {
  authenticateToken,
  authorizeUser
};