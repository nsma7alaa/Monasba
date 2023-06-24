const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel');

exports.createUserValidator = [
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

exports.getUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),

  check('firstName')
    .optional()
    .notEmpty()
    .withMessage('firstName required')
    .isLength({ min: 3 })
    .withMessage('Too short firstName'),

  check('lastName')
    .optional()
    .notEmpty()
    .withMessage('lastName required')
    .isLength({ min: 3 })
    .withMessage('Too short lastName'),

  check('userName')
    .optional()
    .notEmpty()
    .withMessage('userName required')
    .isLength({ min: 3 })
    .withMessage('Too short userName'),

  check('email')
    .optional()
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

  check('phone')
    .optional()
    .isMobilePhone(['ar-EG'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

  check('profileImg').optional(),

  check('role').optional(),

  check('country').optional().notEmpty().withMessage('country required'),

  check('city').optional().notEmpty().withMessage('city required'),

  check('role').optional().notEmpty().withMessage('role required'),

  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  body('currentPassword')
    .notEmpty()
    .withMessage('You must enter your current password'),
  body('passwordConfirm')
    .notEmpty()
    .withMessage('You must enter the password confirm'),
  body('password')
    .notEmpty()
    .withMessage('You must enter new password')
    .custom(async (val, { req }) => {
      // 1) Verify current password
      const user = await User.findById(req.params.id);
      if (!user) {
        return Promise.reject(new Error('There is no user for this id'));
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        return Promise.reject(new Error('Incorrect current password'));
      }

      // 2) Verify password confirm
      if (val !== req.body.passwordConfirm) {
        return Promise.reject(new Error('Password Confirmation incorrect'));
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  check('firstName')
    .optional()
    .notEmpty()
    .withMessage('firstName required')
    .isLength({ min: 3 })
    .withMessage('Too short firstName'),

  check('lastName')
    .optional()
    .notEmpty()
    .withMessage('lastName required')
    .isLength({ min: 3 })
    .withMessage('Too short lastName'),

  check('userName')
    .optional()
    .notEmpty()
    .withMessage('userName required')
    .isLength({ min: 3 })
    .withMessage('Too short userName'),

  check('phone')
    .optional()
    .isMobilePhone(['ar-EG'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

  check('profileImg').optional(),

  check('role').optional(),

  check('country').optional().notEmpty().withMessage('country required'),

  check('city').optional().notEmpty().withMessage('city required'),

  validatorMiddleware,
];

exports.updateLoggedUserPasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('You must enter your current password')
    .custom(async (val, { req }) => {
      const isCorrectPassword = await bcrypt.compare(val, req.user.password);
      if (!isCorrectPassword) {
        return Promise.reject(new Error('Current password incorrect'));
      }
      return true;
    }),

  body('passwordConfirm')
    .notEmpty()
    .withMessage('You must enter the password confirm'),
  body('password')
    .notEmpty()
    .withMessage('You must enter new password')
    .custom(async (val, { req }) => {
      if (val === req.body.currentPassword) {
        return Promise.reject(
          new Error('Current password and new Password can not be the same!')
        );
      }
      if (val !== req.body.passwordConfirm) {
        return Promise.reject(
          new Error('password and passwordConfirm are not the same!')
        );
      }
      return true;
    }),
  check('profileImg').optional(),
  validatorMiddleware,
];
