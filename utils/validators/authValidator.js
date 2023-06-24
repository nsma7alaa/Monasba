const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel');

exports.signupValidator = [
  check('firstName')
    .notEmpty()
    .withMessage('firstName required')
    .isLength({ min: 3 })
    .withMessage('Too short firstName'),

  check('lastName')
    .notEmpty()
    .withMessage('lastName required')
    .isLength({ min: 3 })
    .withMessage('Too short lastName'),

  check('userName')
    .notEmpty()
    .withMessage('userName required')
    .isLength({ min: 3 })
    .withMessage('Too short User name'),

  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('E-mail already in user'));
        }
      })
    ),

  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  check('phoneNumber')
    .notEmpty()
    .withMessage('phoneNumber required')
    .isMobilePhone(['ar-EG'])
    .withMessage('Invalid phone number only accepted Egy Phone numbers'),

  check('country').notEmpty().withMessage('country required'),

  check('city').notEmpty().withMessage('city required'),

  validatorMiddleware,
];

exports.loginValidator = [
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address'),

  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  validatorMiddleware,
];

exports.resetPasswordValidator = [
  body('passwordConfirm')
    .notEmpty()
    .withMessage('You must enter the password confirm'),
  body('password')
    .notEmpty()
    .withMessage('You must enter new password')
    .custom(async (val, { req }) => {
      // 1) Verify password confirm
      if (val !== req.body.passwordConfirm) {
        return Promise.reject(
          new Error('password and passwordConfirm are not the same!')
        );
      }
      return true;
    }),
  validatorMiddleware,
];
