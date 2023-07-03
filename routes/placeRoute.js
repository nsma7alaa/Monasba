const express = require('express');
const {
  getAllPlaces,
  getPlace,
  getMyPlace,
  createPlace,
  deleteSavedPlaceData,
  uploadPlaceImage,
  resizeImage,
  updateMyplace,
} = require('../controllers/placeController');
const authController = require ('../controllers/authController');
const router = express.Router();

router
.route('/')
.get(getAllPlaces)

router
.route('/single/:id')
.get(getPlace)


router.use(authController.protect);

//owner
// router.use(authController.allowedTo("owner"));

router
.route('/')
.post( authController.allowedTo("owner") ,uploadPlaceImage, resizeImage, createPlace);

router.get('/getmyplace', authController.allowedTo("owner") , getMyPlace);

router.patch('/updatemyPlace',uploadPlaceImage,resizeImage, updateMyplace)

router.delete('/deleteMyplace', deleteSavedPlaceData);



module.exports = router;
