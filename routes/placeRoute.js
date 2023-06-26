const express = require('express');
const {
  getAllPlaces,
  getPlace,
  createPlace,
  deletePlace,
  uploadPlaceImage,
  resizeImage,
  updatePlaceData,
} = require('../controllers/placeController');
const authController = require ('../controllers/authController')
const router = express.Router();
router.use(authController.protect);

router
.route('/')
.get(getAllPlaces)

router
.route('/single/:id')
.get(getPlace)


//owner
router.use(authController.allowedTo("owner"));

router
.route('/')
.get(getAllPlaces)
.post(uploadPlaceImage, resizeImage, createPlace);


router
.route('/:id')
.get( getPlace)
.patch(uploadPlaceImage, resizeImage, updatePlaceData)
.delete(deletePlace);

module.exports = router;
