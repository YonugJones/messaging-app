require('dotenv').config();
const prisma = require('../prisma/prismaClient');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/customError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = asyncHandler(async (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    throw new CustomError('All fields are required', 400);
  }

  const checkUsername = await prisma.user.findUnique({ where: { username } });
  if (checkUsername) {
    throw new CustomError('Username is taken', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      username,
      password: hashedPassword
    },
  });

  const token = jwt.sign(
    { id: newUser.id, username: newUser.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '1h' }
  );

  res.status(201).json({
    success: true,
    message: 'New user created',
    data: {
      id: newUser.id,
      name: newUser.name,
      username: newUser.username
    },
    token
  });
});

module.exports = {
  signup
}