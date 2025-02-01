require('dotenv').config();
const prisma = require('../prisma/prismaClient');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/customError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = asyncHandler(async (req, res) => {
  // finds inputed username and password in signup fields
  const { username, password } = req.body;
  if ( !username || !password) {
    throw new CustomError('All fields are required', 400);
  }

  // checks if the username already exists in the database
  const takenUsername = await prisma.user.findUnique({ where: { username } });
  if (takenUsername) {
    throw new CustomError('Username is taken', 409);
  }

  // hashes and salts the password before storing
  const hashedPassword = await bcrypt.hash(password, 10);

  // creates the user and adds to user database
  const newUser = await prisma.user.create({
    data: {
      username,
      password: hashedPassword
    },
  });

  // response to front end
  res.status(201).json({
    success: true,
    message: 'New user created',
    data: {
      id: newUser.id,
      username: newUser.username,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  // check if username and password field are entered
  const { username, password } = req.body;
  if (!username || !password) {
    throw new CustomError('Username and password are required', 403);
  }

  // find if user exists in database
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    throw new CustomError('Incorrect username', 401);
  }

  // compares the inputed password with the found users password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new CustomError('Incorrect password', 401);
  }

  // checks that access and refresh token secrets exist in .env
  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    throw new CustomError('JWT_SECRET is not defined', 500);
  }

  // Create JWTs
  const accessToken = jwt.sign(
    { id: user.id, username: user.username }, // payload
    process.env.ACCESS_TOKEN_SECRET, // secret key
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' } // options
  );

  const refreshToken = jwt.sign(
    { id: user.id, username: user.username }, // payload
    process.env.REFRESH_TOKEN_SECRET, // secret key
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '1d' } // options
  );

  // save refresh token into user database
  await prisma.user.update({ 
    where: { username }, 
    data: { refreshToken }
  });

  // set the refreshToken in an httpOnly cookie for added security
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, // prevent client side access
    sameSite: 'None',
    secure: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day in ms
  });



  // response to front end
  res.status(200).json({
    success: true,
    message: 'Login successful. Welcome back, ' + user.username,
    data: {
      id: user.id,
      username: user.username,
      accessToken,
    },
  })
});

module.exports = {
  signup,
  login,
}