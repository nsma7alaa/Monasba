const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const bcrypt = require('bcryptjs');

const handlersFactory = require('./handlersFactory');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const createToken = require('../utils/createToken');

// Upload single image
exports.uploadUserImage = uploadSingleImage('profileImg');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    // Save image into our db
    req.body.profileImg = filename;
  }

  next();
});

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getAllUsers = handlersFactory.getAll(User);

// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = handlersFactory.getOne(User);

// @desc    Create user
// @route   POST  /api/v1/users
// @access  Private/Admin
exports.createUser = handlersFactory.createOne(User);

// @desc    Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      email: req.body.email,
      country: req.body.country,
      city: req.body.city,
      phoneNumber: req.body.phoneNumber,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!document) {
    return next(new AppError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      document,
    },
  });
});

// @desc    Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = handlersFactory.deleteOne(User);

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!document) {
    return next(new AppError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      document,
    },
  });
});

// @desc    Get Logged user data
// @route   GET /api/v1/users/getMe
// @access  Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    Update logged user password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/Protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Update user password based user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // 2) Generate token
  const token = createToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

// @desc    Update logged user data (without password, role)
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      country: req.body.country,
      city: req.body.city,
      phoneNumber: req.body.phoneNumber,
      profileImg: req.body.profileImg,
    },
    { new: true }
  );

  await updatedUser.save();

  res.status(200).json({
    status: 'success',
    data: updatedUser,
  });
});

// @desc    Deactivate logged user
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/Protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'Success',
  });
});
