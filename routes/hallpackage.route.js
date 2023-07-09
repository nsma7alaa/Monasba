const express = require('express');
const {
  getAllPackage,
  getPackage,
  getMyPackage,
  createPackage,
  deletePackage,
  resizeImage,
  updateMyPackage,
} = require('../controllers/hallpackage.controller');
const authController = require ('../controllers/authController');
const router = express.Router();

router
.route('/')
.get(getAllPackage)

router
.route('/single/:id')
.get(getPackage)


router.use(authController.protect);


router
.route('/')
.post( authController.allowedTo("owner") , resizeImage, createPackage);

router.get('/getmyPackage', authController.allowedTo("owner") , getMyPackage);

router.put('/updatemyPackage',authController.allowedTo("owner") , resizeImage, updateMyPackage)

router.delete('/deletemyPackage',  authController.allowedTo("owner"), deletePackage);



module.exports = router;