const prisma = require('../prisma/prismaClient');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/customError');

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { id: 'asc' },
    select: {
      id: true,
      username: true,
    },
  });

  if (users.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'No users found',
      data: users
    });
  }

  res.status(200).json({
    success: true,
    message: 'All users fetched',
    data: users,
  });
});

const getUser = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    throw new CustomError('Invalid userID', 400);
  }

  const user = await prisma.user.findUnique({ 
    where: { id: userId },
    select: {
      username: true,
      profilePic: true,
      profileBio: true
    }, 
   });

   if (!user) {
    throw new CustomError('User not found', 404);
   }

   res.status(200).json({
    success: true,
    message: 'User information retrieved',
    data: user,
   });
});

const updateUserInfo = asyncHandler(async (req, res) => {

  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    throw new CustomError('Invalid user ID', 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      username: true,
      profilePic: true,
      profileBio: true
    }
  });

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  const { username, profilePic, profileBio } = req.body;

  const updateUser = await prisma.user.update({
    where: { id: userId },
    data: {
      username,
      profilePic,
      profileBio,
    },
    select: {
      username: true,
      profilePic: true,
      profileBio: true,
    },
  });

    // Generate a new access token
    const accessToken = jwt.sign(
      { id: updateUser.id, username: updateUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
    );

  res.status(200).json({
    success: true,
    message: 'User information updated',
    data: {
      ...updateUser,
      accessToken
    }
  });
});

module.exports = {
  getAllUsers,
  getUser,
  updateUserInfo,
}