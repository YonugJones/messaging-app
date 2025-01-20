const prisma = require('../prisma/prismaClient');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/customError');

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
    }
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
      id: true,
      name: true,
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
   })
})

const updateUserInfo = asyncHandler(async (req, res) => {

  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    throw new CustomError('Invalid user ID', 400);
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  const { name, username, profilePic, profileBio } = req.body;


  const updateUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      username,
      profilePic,
      profileBio
    },
    select: {
      id: true,
      name: true,
      username: true,
      profilePic: true,
      profileBio: true
    },
  });

  res.status(200).json({
    success: true,
    message: 'User information updated',
    data: updateUser
  })
})

module.exports = {
  getAllUsers,
  getUser,
  updateUserInfo
}