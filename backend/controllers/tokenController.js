require('dotenv').config();
const prisma = require('../prisma/prismaClient');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/customError');
const jwt = require('jsonwebtoken');

const refreshAccessToken = asyncHandler(async (req, res) => {
  // extract the refreshToken attached to the cookie
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw new CustomError('Refresh token missing', 403);
  }

  try {
    // verify the refresh tokens validity and extract the payload
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // find user in database matching payload id to user id
    const user = await prisma.user.findUnique({ where: { id: payload.id } });

    // compares refresh token of user found in DB with refresh token attached to request 
    if (!user || user.refreshToken !== refreshToken) {
      throw new CustomError('Invalid refresh token', 403)
    }

    // creates new accessToken using users credentials
    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
    );

    // generate new refreshToken to help prevent reuse attacks
    const newRefreshToken =jwt.sign(
      { id: user.id, username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '1d' }
    );

    // store new refreshToken in database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken }
    })

    // set new refreshToken in cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    })

    // response to front end
    res.status(200).json({ accessToken });
  } catch (err) {
    throw new CustomError('Failed to refresh access token', 403);
  };
});

module.exports = {
  refreshAccessToken
}