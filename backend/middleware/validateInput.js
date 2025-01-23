const { body, validationResult } = require('express-validator');

const validateSignup = [
  body('username')
    .notEmpty()
    .withMessage('Username field must not be empty')
    .isLength({ min: 3, max: 24 })
    .withMessage('Username mus be between 3 and 24 characters long')
    .matches(/^\S+$/)
    .withMessage('Username must not contain spaces'),
  body('password')
    .isLength({ min: 10 })
    .withMessage('Password must be at least 10 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/)
    .withMessage('Password must contain at least one special character'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords must match'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      next();
    },
];

const validateLogin = [
  body('username')
    .notEmpty()
    .withMessage('Username is blank'),
  body('password')
    .notEmpty()
    .withMessage('Password required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

const validateUpdateUserInfo = [
  body('username')
    .notEmpty()
    .withMessage('Username field must not be empty')
    .isLength({ min: 3, max: 24 })
    .withMessage('Username mus be between 3 and 24 characters long')
    .matches(/^\S+$/)
    .withMessage('Username must not contain spaces'),
  body('profilePic')
    .optional()
    .isURL()
    .withMessage('Profile picture must be a valid URL'),
  body('profileBio')
    .optional()
    .isLength({ max: 255 })
    .withMessage('profileBio must not exceed 255 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
]

const validateMessage = [
  body('content')
    .notEmpty()
    .withMessage('Content field cannot be blank')
    .isLength({ max: 1000 })
    .withMessage('Content cannot exceed 1000 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
]

module.exports = {
  validateSignup,
  validateLogin,
  validateUpdateUserInfo,
  validateMessage,
}