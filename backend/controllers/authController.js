require('dotenv').config();
const prisma = require('../prisma/prismaClient');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/customError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = asyncHandler(async (req, res) => {

  const { username, password } = req.body;

  if ( !username || !password) {
    throw new CustomError('All fields are required', 400);
  }

  const checkUsername = await prisma.user.findUnique({ where: { username } });
  if (checkUsername) {
    throw new CustomError('Username is taken', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
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
      username: newUser.username,
    },
    token,
  });
});

const login = asyncHandler(async (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    throw new CustomError('Username and password are required', 403);
  }

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    throw new CustomError('Incorrect username', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new CustomError('Incorrect password', 401);
  }

  if (!process.env.JWT_SECRET) {
    throw new CustomError('JWT_SECRET is not defined', 500);
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '1h' }
  );

  res.status(200).json({
    success: true,
    message: 'Login successful. Welcome back, ' + user.username,
    data: {
      id: user.id,
      username: user.username,
    },
    token,
  })

});

module.exports = {
  signup,
  login
}