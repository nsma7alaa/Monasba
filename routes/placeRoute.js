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

router.use(authController.protect);

// router.use(authController.allowedTo("user"));
router
.route('/')
.get(authController.allowedTo("user"), getAllPlaces)

router
.route('/single/:id')
.get(authController.allowedTo("user"), getPlace)


//owner
router.use(authController.allowedTo("owner"));

router
.route('/')
.get(getAllPlaces)
.post(uploadPlaceImage, resizeImage, createPlace);


router.get('/getmyplace', getMyPlace, getPlace);

router.patch('/updatemyPlace',uploadPlaceImage,resizeImage, updateMyplace)

router.delete('/deleteMyplace', deleteSavedPlaceData);



module.exports = router;
