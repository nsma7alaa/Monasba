const express = require('express');

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
  updateLoggedUserPasswordValidator,
} = require('../utils/validators/userValidator');

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
} = require('../controllers/userController');

const {createNotification} = require ('../controllers/notificationController');

const authController = require('../controllers/authController');
const { getAllsavedPlaces } = require('../controllers/savedPlace.controller');

const router = express.Router();

router.use(authController.protect);

router.get('/getMe', getLoggedUserData, getUser);

router.patch(
  '/changeMyPassword',
  updateLoggedUserPasswordValidator,
  updateLoggedUserPassword
);

router.patch(
  '/updateMe',
  uploadUserImage,
  resizeImage,
  updateLoggedUserValidator,
  updateLoggedUserData
);

router.delete('/deleteMe', deleteLoggedUserData);

// Admin
router.use(authController.allowedTo("admin"));

router.patch(
  '/changePassword/:id',
  changeUserPasswordValidator,
  changeUserPassword
);

router
  .route('/')
  .get(getAllUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);

router
  .route('/:id')
  .get(getUserValidator, getUser)
  .patch(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

  router
  .route('/notification')
  .post(createNotification)
  .get(getAllsavedPlaces)
  
  

module.exports = router;
