const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const asyncHandler = require('express-async-handler');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/sendEmail');
const sendSMS = require('../utils/send_sms');
const createToken = require('../utils/createToken');

const User = require('../models/userModel');

// @desc    Signup
// @route   GET /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  // 1- Create user
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    country: req.body.country,
    city: req.body.city,
    phoneNumber: req.body.phoneNumber,
  });

  // 2- Generate token
  const token = createToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: newUser,
  });
});

// @desc    Login
// @route   GET /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  // 1) check if password and email in the body (validation)
  const user = await User.findOne({ email: req.body.email });

  // 2) check if user exist & check if password is correct
  if (
    !user ||
    !(await user.correctPassword(req.body.password, user.password))
  ) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) generate token
  const token = createToken(user._id);

  // Delete password from response
  delete user._doc.password;

  // 4) send response to client side
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

// @desc   make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError(
        'You are not login, Please login to get access this route',
        401
      )
    );
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  // 3) Check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new AppError(
        'The user that belong to this token does no longer exist',
        401
      )
    );
  }

  // 4) Check if user change his password after token created
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  req.user = currentUser;
  next();
});

// @desc    Authorization (User Permissions)
// ["user", "owner"]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You are not allowed to access this route', 403)
      );
    }
    next();
  });

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  let user;
  if (req.body.flag === 'email') {
    user = await User.findOne({ email: req.body.email });
  } else if (req.body.flag === 'sms') {
    user = await User.findOne({ phoneNumber: req.body.phoneNumber });
  }

  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) If user exist, Generate hash reset random 6 digits and save it in db valid for (10 min)
  const resetCode = user.generateVerificationCode();

  await user.save();

  // 3) Send it to user's email
  const message = `Hi ${user.firstName},\n We received a request to reset the password on your Monasba Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The Monasba Team`;

  if (req.body.flag === 'email') {
    // 3) Send the reset code via email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset code (valid for 10 min)',
        message,
      });
    } catch (err) {
      user.passwordResetCode = undefined;
      user.passwordResetExpires = undefined;
      user.passwordResetVerified = undefined;

      await user.save();

      return next(new AppError('There is an error in sending email', 500));
    }
  } else if (req.body.flag === 'sms') {
    try {
      sendSMS({
        subject: 'Your password reset token (valid for 10 min)',
        to: user.phoneNumber,
        from: process.env.TWILIO_TO,
        message,
      });

      res.status(200).json({
        status: 'success',
        message: 'Verification Code sent to phone number!',
      });
    } catch (err) {
      user.passwordResetCode = undefined;
      user.passwordResetExpires = undefined;

      await user.save();

      return next(
        new AppError(
          'There was an error sending the email. Try again later!',
          500
        )
      );
    }
  }

  // 4) generate token
  const token = createToken(user._id);

  res.status(200).json({
    status: 'success',
    message: 'Reset code sent to email',
    token,
  });
});

// @desc    Verify password reset code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex');

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError('Reset code invalid or expired'));
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;

  await user.save();

  res.status(200).json({
    status: 'success',
  });
});

// @desc    Reset password
// @route   POST /api/v1/auth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne(req.user._id);
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new AppError('Reset code not verified', 400));
  }

  user.password = req.body.password;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token
  const token = createToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

// @desc    Resend password
// @route   POST /api/v1/auth/resendForgetPassword
// @access  Public
exports.resendForgetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on his id.
  const user = await User.findById(req.user.id).select('+resendCodeCount');

  // 2) Check if this user is already used resent api 3 times or more
  if (user.resendCodeCount >= 3) {
    return next(
      new AppError(
        'You have reached the maximum number of verification code requests. Try again later',
        400
      )
    );
  }

  // 2) Generate hash reset random 6 digits and save it in db valid for (10 min)
  const resetCode = user.generateVerificationCode();
  user.resendCodeCount += 1;
  await user.save();

  // 3) Send it to user's email
  const message = `Hi ${user.firstName},\n We received a request to reset the password on your Monasba Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The Monasba Team`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset code (valid for 10 min)',
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    return next(new AppError('There is an error in sending email', 500));
  }

  // 4) generate token
  const token = createToken(user._id);

  res.status(200).json({
    status: 'success',
    message: 'Reset code sent to email',
    token,
  });
});
