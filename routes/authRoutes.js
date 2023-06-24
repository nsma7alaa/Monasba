const express = require('express');

const {
  signupValidator,
  loginValidator,
  resetPasswordValidator,
} = require('../utils/validators/authValidator');

const {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
  resendForgetPassword,
  protect,
} = require('../controllers/authController');

const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signupValidator, signup);

router.post('/login', loginValidator, login);

router.post('/forgotPassword', forgotPassword);

router.post('/verifyResetCode', verifyPassResetCode);

router.use(protect);

router.post('/resendForgetPassword', resendForgetPassword);

router.post(
  '/resetPassword',
  authController.protect,
  resetPasswordValidator,
  resetPassword
);

module.exports = router;
