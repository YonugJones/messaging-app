const prisma = require('../prisma/prismaClient');
const asyncHandler = require('express-async-handler');
const CustomError = require('../errors/customError');
const jwt = require('jsonwebtoken');

const logout = asyncHandler(async (req, res) => {
  // on client, also delete the accessToken

  // extract the refreshToken attached to the cookie
  const { refreshToken } = req.cookies;
  // if no refreshToken is present, respond with success for idempotent behavior
  if (!refreshToken) {
    return res.status(204).json({ success: true });
  }

  try {
    // verify the refresh tokens validity and extract the payload
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // find user in database matching payload id to user id
    const user = await prisma.user.findUnique({ where: { id: payload.id } });

    // if user doesn't exist or token does not match the users token in database, delete refreshToken
    if (!user || user.refreshToken !== refreshToken) {
      res.clearCookie('refreshToken', { 
        httpOnly: true, 
        sameSite: 'None',
        secure: true
      });
      return res.status(204).json({ success: true })
    }

    // Delete refresh cookie in DB
    await prisma.user.update({
      where: { id: payload.id },
      data: {
        refreshToken: null
      },
    });

    res.clearCookie('refreshToken', { 
      httpOnly: true, 
      sameSite: 'None',
      secure: true
    });
    res.status(200).json({
      sucess: true,
      message: `${user.username} successfully logged out`,
    });
  } catch (err) {
    throw new CustomError('Failed to delete refresh token', 403);
  };
});

module.exports = {
  logout
}