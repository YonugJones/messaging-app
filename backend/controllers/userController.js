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
      data: {
        users: []
      }
    });
  }

  res.status(200).json({
    success: true,
    message: 'All users fetched',
    data: {
      users,
    },
  });
});

module.exports = {
  getAllUsers
}